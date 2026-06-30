---
slug: ai-dev-workflow
category: notes
title:
  zh: "我的 AI 开发工作流：Copilot + Cursor 写代码，LangSmith 追踪 LLM 应用"
  en: "My AI Dev Workflow: Copilot + Cursor for Code, LangSmith for LLM Apps"
date: 2026-06-27
tags:
  - "工作流"
  - "LangSmith"
  - "Cursor"
---

## 为什么 LLM 项目要单独配工具？

写普通后端时，路径往往很直：

```
输入确定 → 逻辑确定 → 输出可预期 → 日志和断点能跟
```

LLM 应用多好几层不确定：

```
用户问题 → 检索？ → 拼 prompt → 调模型 → 后处理 → 回答
              ↑           ↑            ↑
           可能漏检     可能超长      可能超时/幻觉
```

问题常常不是程序崩溃，而是**答非所问、偶发胡编、延迟飙高**——单靠断点不够。

所以需要两类工具：

| 阶段 | 干什么 | 我用什么 |
|------|--------|----------|
| 写代码 | 接口、RAG 链路、测试 | Copilot + Cursor |
| 跑起来之后 | 看 prompt、检索、耗时 | LangSmith |

## 先认识几个词

| 术语 | 白话 |
|------|------|
| **Copilot** | GitHub 的 AI 编程助手，编辑器里补全、聊天 |
| **Cursor** | 带 AI 的代码 IDE，能改多个文件、读整个仓库 |
| **LangSmith** | 记录每次 LLM 调用的输入输出和耗时 |
| **Trace** | 一次请求的完整链路（检索、模型、后处理） |
| **RAG** | 先查资料，再让模型回答 |
| **Prompt** | 发给模型的指令和上下文 |

## Copilot 和 Cursor 怎么分工？

两个都装不会必然冲突，关键是**定边界**。

### Copilot：行内副驾

**适合：**

- 写函数体、API 路由、测试样板
- 单文件里问报错、补下一行
- CRUD、配置、异常处理等重复劳动

**不太适合：**

- 从 0 拆需求并实现 5 个文件
- 读整个仓库做架构级修改

特点：**你写，它补**——改动小、可控。

### Cursor：项目级搭档

**适合：**

- 一次改多个文件（接口 + service + test）
- `@codebase` 在整个仓库里找相关代码
- `.cursor/rules` 写项目规矩（目录、禁止硬编码密钥等）

特点：**你说需求，它在项目里改**——改完在 IDE 里看 diff。

### 简单分工表

| 任务 | 用谁 |
|------|------|
| 补全下一行、写一个函数 | Copilot Tab |
| 新功能跨 3 个以上文件 | Cursor Agent |
| 解释报错、查单个函数 | Copilot Chat 或 Cursor Chat |
| 按仓库规范生成模块 | Cursor + rules |

日常习惯：Cursor 作主 IDE，Copilot 扩展负责 Tab 补全；Agent 只在多文件任务时开。

## LangSmith 解决什么问题？

代码写对 ≠ 应用好用。LangSmith 回答：**这次请求到底发生了什么。**

接入后，每次调用产生一条 **Trace**，例如：

```
Trace: POST /chat  (总耗时 3.2s)
├── Retriever      检索 4 条文档     0.4s
├── Prompt         最终 prompt 4200 tokens
├── ChatOpenAI     模型调用           2.5s
└── 最终回答
```

你能看到：

- 实际发给模型的 **Input / Output**（不是你以为发了什么）
- 每一步 **耗时** 和 **Token 用量**
- RAG 时 **检索到了哪几条 chunk**

### 最小接入（LangChain 项目）

注册 LangSmith 后设置环境变量：

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls__...
export LANGCHAIN_PROJECT=my-llm-app
```

LangChain 的 `invoke` / `stream` 会自动上报。示例：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是助手，只根据上下文回答。"),
    ("human", "{question}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini")

chain.invoke({"question": "KV cache 是什么？"})
```

打开 [smith.langchain.com](https://smith.langchain.com) 对应 Project 即可查看 trace。

非 LangChain 项目可用 LangSmith SDK 手动打点，工作量稍大。

### 和普通日志的区别

| 普通日志 | LangSmith |
|----------|-----------|
| 自己拼字符串 | 结构化 span，父子调用自动关联 |
| 难还原完整 prompt | 专门存 LLM 输入输出 |
| 检索、模型调用散落 | 一条 trace 串起来 |
| 延迟要自己算 | 每步自带耗时 |

常规日志（request id、错误栈）仍要保留；LangSmith 管 **LLM 特有** 那一段。

## 一次功能从 0 到上线

以「给内部文档加 RAG 问答接口」为例：

```
① 需求拆解          → 上传 / 检索 / API / 测试
② Cursor Agent      → 生成多文件骨架
③ Copilot Tab       → 补校验、异常处理、测试细节
④ 本地跑通          → 开 LangSmith，固定 5 个测试问题
⑤ 调 prompt / 检索  → 每次改完对比 trace
⑥ 人工 Review       → 密钥、注入、AI 胡写的逻辑
⑦ 部署 staging      → 用 tag 区分 dev / prod
```

## 常见误解

| 误解 | 实际情况 |
|------|----------|
| LangSmith 能保证回答正确 | 它只记录过程，不做质量裁判 |
| 有 AI 写代码就不用 Review | 必须看 diff，尤其密钥和边界条件 |
| Copilot 和 Cursor 只能二选一 | 可以组合：Tab 用 Copilot，多文件用 Cursor |
| Trace 可以代替测试集 | 排查单条问题好用；整体质量还要 eval |
| LangSmith 会把数据留在云端 | 默认上传 prompt；敏感项目要看 masking / 合规 |

## 成本与注意点

- **Copilot / Cursor**：都有订阅；Agent 生成的代码不保证正确  
- **LangSmith**：有免费额度，量大可能收费  
- **隐私**：公司项目看政策；别让 AI 读到 `.env`  

这套组合**不覆盖**：模型训练、选 base model、推理层性能优化（如 KV Cache）——那些要单独学。

## 小结

- **Copilot**：写下一行、单文件体力活  
- **Cursor**：多文件实现、读 codebase、项目 rules  
- **LangSmith**：跑起来后看 prompt、检索、耗时，复现「为什么这样答」  

写代码和观测要分开投资。最小起步：Cursor 作主 IDE + Copilot Tab；第一个 LLM 接口接 LangSmith；固定几条测试问句，**改 prompt 前先对比 trace**。

## 延伸阅读

- [GitHub Copilot 文档](https://docs.github.com/copilot)
- [Cursor 文档](https://docs.cursor.com)
- [LangSmith Tracing 快速开始](https://docs.smith.langchain.com/observability/how_to_guides/tracing)
- 同系列：[Claude Code vs Cursor vs Copilot：怎么选、怎么配合](/articles/notes/claude-code-vs-cursor-vs-copilot/)
- 同系列：[什么是 Token？理解 AI API 计费的核心概念](/articles/notes/what-is-token/)
