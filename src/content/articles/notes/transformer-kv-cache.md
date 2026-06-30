---
slug: transformer-kv-cache
category: notes
title:
  zh: "从消息循环到 Transformer 注意力与 KV Cache"
  en: "From Message Loops to Transformer Attention and KV Cache"
date: 2026-06-24
tags:
  - "Transformer"
  - "KV Cache"
  - "推理"
---

## 为什么要从消息循环讲起？

我做 C++ 软件开发两年多，日常写业务逻辑，也做过 Win32 桌面程序——消息、窗口、回调是 debug 里反复出现的东西。

后来读 Attention 论文和 vLLM 文档，公式一行能看懂，脑子里却缺一张**运行时地图**：Q/K/V 在哪一步生成？推理时为什么要 KV Cache？显存怎么估？

我是用**消息循环**这张旧地图，才把 Attention 和 KV Cache 对上的。下文是这套理解方式；类比辅助直觉，不是严格证明。关键数字请用文中公式自己代参数算一遍。

## 先认识几个词

| 术语 | 白话 |
|------|------|
| **token** | 模型处理的一个字/词片段 |
| **Attention** | token 之间「谁该看谁、看多少」 |
| **Q / K / V** | Q：我在找什么；K/V：被查阅的内容 |
| **head** | 多头注意力里的分路 |
| **prefill** | 先把 prompt 整段处理完 |
| **decode** | 模型逐字生成后续内容 |
| **KV Cache** | 把算过的 K、V 存起来，避免重算 |

---

## 第一部分：消息循环——我熟悉的 hard routing

Win32 程序主线程通常阻塞在：

```cpp
while (GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);  // 调用 WndProc
}
```

我习惯把它抽象成四个对象：

| 对象 | 角色 |
|------|------|
| 消息队列 | FIFO 缓冲区 |
| 消息 `(hwnd, message, wParam, lParam)` | 带类型和载荷的事件 |
| 路由表 | `hwnd → WndProc` |
| Handler | 读取/修改程序状态 |

读这类程序，我脑子里固定三个问题：**谁发的？发给谁？怎么处理？**

这是 **hard routing**：给定窗口和消息类型，通常**唯一**确定一个 handler。多个 handler 抢同一事件，要额外设计，不是默认行为。

做 C++ 时还有另一套并行直觉——内存谁分配、模块边界在哪、瓶颈在拷贝还是 IO——后面看 Attention 的复杂度和 KV Cache 的显存，用的也是这套「资源从哪来到哪去」的思路。

---

## 第二部分：Attention——soft routing

### 和消息循环的对照

| 消息循环 | Self-Attention |
|----------|----------------|
| 一条消息 | 一个 token 的 Query |
| 窗口句柄 hWnd | Key |
| 消息参数 wParam/lParam | Value |
| 查路由表 | Q 与所有 K 算相似度 |
| DispatchMessage | 用 softmax 权重混合所有 V |

关键差异：Attention 是 **soft routing**——每个 token 向**所有** token 发请求，按相关度**连续分配权重**，不是离散跳转。

```
Hard routing (WndProc)              Soft routing (Self-Attention)

  (hwnd, msg) ──查表──► handler      q_i ──与所有 k_j 算分──► softmax 权重
  离散跳转，通常一对一                连续加权，一对全体
  handler 就地改状态                 输出新向量 + 残差保留旧信息
```

### Attention 怎么算

设序列长度 n，模型宽度 d_model。每个 token 投影成 Q、K、V：

```
Q = X · W^Q
K = X · W^K
V = X · W^V

Attention(Q, K, V) = softmax( Q·K^T / sqrt(d_k) + M ) · V
```

- `Q·K^T`：shape `[n, n]`，token i 对 token j 的原始分数
- `M`：mask（见下）
- `/ sqrt(d_k)`：维度过大时点积方差大，softmax 容易饱和（原论文 3.2.1 节）

**单 token 数据流：**

```
X[i] ──W_Q──► q_i ──┐
                     ├──► q_i·K^T / sqrt(d_k) ──► softmax ──► 权重
X[*] ──W_K──► K   ──┘                                        │
X[*] ──W_V──► V   ───────────────────────────────────────────┘
                                                               v
                                                          加权求和 → 输出[i]
```

一层 Attention 约 **O(n² · d)**。序列一长就是瓶颈——像「全连接路由表」的代价，和 WndProc 的 O(1) dispatch 完全不是一个量级。

### 多头、Mask、一层 Block

**多头**：h 组独立投影矩阵，各做一遍 Attention 再拼接——不是同一组 Q/K/V 算 h 遍。

**Mask**：

| 类型 | 作用 |
|------|------|
| Padding mask | pad 位不参与 attend |
| Causal mask | 生成时不能偷看未来 token，类似「未发生的事件不进处理链」 |

**一层 Transformer Block**：

```
输入 X
  → Multi-Head Attention   （token 之间路由，像 Dispatch）
  → 残差 + LayerNorm
  → FFN                    （每个 token 自己的业务逻辑，像 handler 内部）
  → 残差 + LayerNorm
```

- **残差** `X + SubLayer(X)`：像「保留旧状态 + 增量更新」，而不是 WndProc 里直接 mutate 全局变量

**位置编码**：Attention 本身不记顺序，必须加 PE 或 **RoPE**（现代 LLM 常用）。消息队列自带 FIFO 顺序；Transformer 的顺序是**显式编码**进去的。

---

## 第三部分：推理——KV Cache 就是状态缓存

Attention 搞清之后，推理瓶颈几乎绕不开 **KV Cache**。

### 问题：逐字生成 = 大量重复计算

聊天时模型**每步只产出一个 token**，却要和**全部历史**做 Attention。

**笨办法**：每步把整句 `[x_1..x_t]` 重新 forward。前面算过的 K/V 又被重算——像**每帧重新从磁盘读配置文件**，而不是读内存里的快照。

关键观察：`k_1..k_{t-1}` 和 `v_1..v_{t-1}` 在上一步已经算过，**数值不变**，只是被扔掉了。

### KV Cache 做什么

```
q_t = x_t · W^Q     ← 必须新算（只有当前字要「发问」）
k_t = x_t · W^K     ← 追加到 K_cache
v_t = x_t · W^V     ← 追加到 V_cache

输出 = softmax( q_t · K_cache^T / sqrt(d_k) ) · V_cache
```

**为什么只 cache K/V，不 cache Q？**

- 每步只有**最新 token**需要发 Q
- 历史 Q 只在「生成下一个字」时用一次
- 历史 K/V 会被**之后每个新 token**反复读取

```
Step 1:  x_1 → k_1, v_1 → 写入 cache
Step 2:  x_2 → k_2, v_2 → append；q_2 查 [k_1, k_2]
Step 3:  x_3 → k_3, v_3 → append；q_3 查 [k_1, k_2, k_3]
```

| C++ 里熟悉的 | KV Cache |
|--------------|----------|
| 循环里累积的状态 | 每层各自的 K_cache / V_cache |
| `vector::push_back` | 每步 append 一行 k_t, v_t |
| 只处理新事件 | 只对新 token 投影，不重算旧的 |

注意：读 cache 不是 O(1) 查表，而是 q 与**所有** k 做点积——cache 越长越慢。

### Prefill 与 Decode

| | Prefill（处理 prompt） | Decode（逐字生成） |
|--|------------------------|-------------------|
| 输入 | 整段 prompt | 每步 1 个 token |
| 特点 | GPU 并行，算力忙 | 每步读 growing cache |
| 瓶颈 | compute-bound | memory bandwidth |

```
  |←──── Prefill：整段 prompt ────→|← 1 token →|← 1 token →| ...
  并行，GPU 忙算                    串行，GPU 常等读 cache
```

Prefill 像程序启动时批量加载；Decode 像主循环每次处理新消息，但要翻一遍全部历史。

### 有 cache 之后

| | 每步 Attention | 生成 T 个 token 总计 |
|--|----------------|---------------------|
| 无 cache，每步重算整句 | 约 O(t²) | 约 O(T³) |
| 有 cache | 约 O(t) | 约 O(T²) |

cache 去掉**重复计算**，但没去掉「新 token 要扫完所有历史」。Decode 时 GPU 算力涨得快、显存带宽涨得慢，长序列常**卡在等数据**。

---

## 第四部分：显存估算与工程优化

### 公式与手算

每层、每个序列：

```
KV 字节数 = 2 × seq_len × n_kv_heads × d_head × 元素字节数
```

**LLaMA-7B，FP16，seq=2048，batch=1**（MHA，`n_kv_heads=32, d_head=128, L=32`）：

```
单层 KV ≈ 32 MB
32 层合计 ≈ 1 GB
```

batch=64 时约 64 GB。模型越大、序列越长，KV 常超过权重本身。

### 常见优化

| 方案 | 干什么 |
|------|--------|
| **GQA / MQA** | 减少存 K/V 的 head 数，缩小 cache |
| **PagedAttention** | 块化管理 cache，少 padding 浪费（vLLM） |
| **KV 量化** | INT8/FP8 存，体积约减半 |
| **Continuous Batching** | 请求完成立刻插新请求，GPU 不空转 |

PagedAttention 我类比成：比 `vector` 整块 `realloc` 更像 **slab / deque 分块**——逻辑连续，物理可分散。

### decode 一步（伪代码）

```cpp
void decode_step(Tensor& x_t, Tensor& K_cache, Tensor& V_cache, int pos) {
    Tensor q_t = linear(x_t, W_Q);
    Tensor k_t = linear(x_t, W_K);
    Tensor v_t = linear(x_t, W_V);
    apply_rope(q_t, k_t, pos);

    K_cache.append(k_t);
    V_cache.append(v_t);

    Tensor scores = q_t @ K_cache.T / sqrt(d_head);
    Tensor out = softmax(scores) @ V_cache;
    // → FFN、下一层（每层有独立 cache）
}
```

读 vLLM / llama.cpp 时，我重点追三条线：K/V **存在哪、何时 append**；**Prefill 和 Decode 是否分开**；多请求时 **cache 怎么分配**。

---

## 我作为 C++ 工程师怎么读这些材料

1. 每个算子后写 **shape**（`B, n, d_model, h, d_head`）
2. 区分**路由算子**（Attention）和**逐点算子**（FFN、LayerNorm）
3. mask 当成**路由硬约束**，不是独立 trick
4. 推理优化直接**手算显存和带宽**，别只追公式

类比用到这就够。再往下该看 shape 和复杂度，不宜硬套 WndProc。

### 类比边界

**可以用：** hard ↔ soft routing；增量更新 ↔ 全量重算；append-only ↔ KV cache；PagedAttention ↔ 分页分配

**不要硬套：** 不是 hash map O(1)；不能乱删中间 cache；cache 是高维向量不是配置文件

---

## 常见误解

| 误解 | 实际情况 |
|------|----------|
| Attention = 模型「理解」语义 | 它是可学习的 token 路由层，能力来自多层堆叠 + 大数据 |
| KV Cache 存的是对话原文 | 存的是 K/V 浮点向量 |
| 有 Cache 后 decode 不再变慢 | 序列越长，读 cache 越多，可能卡带宽 |
| 只有 AI 论文才需要懂这些 | 做 LLM 应用、调 latency，仍要懂 Token 和 cache 量级 |
| Q 也要 cache | 只需 K/V |

---

## 小结

| 维度 | 消息循环 | Self-Attention | + KV Cache |
|------|----------|----------------|------------|
| 路由 | Hard，离散 | Soft，全体加权 | K/V 持久化 |
| 顺序 | 队列 FIFO | 需 PE/RoPE | 按序 append |
| 瓶颈 | — | 训练 O(n²) | 长序列读带宽 |

- **Attention**：Q·K^T 打分，softmax 混合 V——从 `DispatchMessage` 到 soft routing，介质从 handle 变成向量  
- **KV Cache**：历史 K/V 不再重算，**用显存换时间**  
- 从消息循环出发，是为了给 Attention 一张能 debug 的地图；地图认路之后，该换算力和显存的账本  

---

## 延伸阅读

- Vaswani et al., *Attention Is All You Need*, 2017
- Kwon et al., *PagedAttention*（vLLM）, 2023
- [vLLM](https://github.com/vllm-project/vllm) / [llama.cpp](https://github.com/ggerganov/llama.cpp)
- 同系列：[什么是 Token？理解 AI API 计费的核心概念](/articles/notes/what-is-token/)
- 同系列：[我的 AI 开发工作流：Copilot + Cursor + LangSmith](/articles/notes/ai-dev-workflow/)
