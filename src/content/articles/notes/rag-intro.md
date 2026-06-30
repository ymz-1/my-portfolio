---
slug: rag-intro
category: notes
title:
  zh: "RAG 入门：用检索增强生成打造企业级智能问答"
  en: "RAG Primer: Retrieval-Augmented Generation for Enterprise Q&A"
date: 2026-06-29
tags:
  - "RAG"
  - "向量数据库"
  - "知识库"
---

*RAG · 向量数据库 · 知识库 · 企业应用*

## 什么是 RAG？

**RAG（Retrieval-Augmented Generation，检索增强生成）** 是一种将**信息检索**与**大模型生成**相结合的技术架构。

核心思路：先从知识库中检索最相关的信息片段，再将这些片段作为上下文传给大模型，让模型基于**真实数据**生成回答。

```
用户提问 → 向量检索 → 找到相关文档片段 → 拼入 Prompt → 大模型生成回答
```

## 为什么需要 RAG？

### 大模型的局限性

| 问题 | 说明 | RAG 如何解决 |
| --- | --- | --- |
| 知识截止 | 模型训练数据有截止日期 | 外接实时更新的知识库 |
| 幻觉 | 模型可能编造事实 | 基于真实文档生成，可溯源 |
| 领域知识不足 | 通用模型缺少专业知识 | 注入企业私有文档 |
| 成本高 | 长上下文 = 更多 Token | 只检索最相关片段 |

### RAG vs 长上下文 vs 微调

| 方案 | 适用场景 | 成本 | 知识更新 |
| --- | --- | --- | --- |
| RAG | 大规模知识库 | 低 | 即时 |
| 长上下文 | 单次处理少量文档 | 高 | 每次重传 |
| 微调 | 风格/格式定制 | 很高 | 需重新训练 |

## RAG 核心架构

### 离线阶段：文档预处理

```
原始文档 → 文本提取 → 文本分块 → Embedding 向量化 → 存入向量数据库
```

#### 1. 文本分块（Chunking）

将长文档拆分为适当大小的片段。常用策略：

| 策略 | 块大小 | 适用场景 |
| --- | --- | --- |
| 固定长度 | 256-512 Token | 通用场景 |
| 按段落/章节 | 不固定 | 结构化文档 |
| 递归分割 | 256-1024 Token | 推荐默认选择 |
| 语义分块 | 动态 | 高精度场景 |

#### 2. 向量化（Embedding）

将文本块转换为高维向量，捕捉语义信息：

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-key",
    base_url="https://api.your-relay.com/v1"
)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="什么是 API 中转站？"
)

vector = response.data[0].embedding  # 1536 维向量
```

#### 3. 向量数据库选型

| 数据库 | 特点 | 适用场景 |
| --- | --- | --- |
| Pinecone | 全托管、免运维 | 快速起步 |
| Weaviate | 内置混合搜索 | 企业级 |
| Qdrant | 高性能、Rust 实现 | 大规模 |
| ChromaDB | 轻量、嵌入式 | 原型开发 |
| pgvector | PostgreSQL 扩展 | 已有 PG 的团队 |

### 在线阶段：检索 + 生成

```python
# 1. 用户提问向量化
query_vector = embed("API 中转站的价格怎么比？")

# 2. 在向量数据库中检索 Top-K 最相似的文档块
relevant_chunks = vector_db.search(query_vector, top_k=5)

# 3. 拼装 Prompt
context = "\n---\n".join([chunk.text for chunk in relevant_chunks])
prompt = f"""基于以下参考资料回答用户问题。如果资料中没有相关信息，请说明。

参考资料：
{context}

用户问题：API 中转站的价格怎么比？"""

# 4. 调用大模型生成回答
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": prompt}]
)
```

## 提升 RAG 效果的关键技巧

### 1. 混合检索（Hybrid Search）

将**向量检索**（语义匹配）与**关键词检索**（精确匹配）结合，效果优于单一方式：

```
最终得分 = α × 向量相似度 + (1-α) × BM25 关键词得分
```

### 2. 重排序（Reranking）

用 Cross-Encoder 模型对初步检索结果进行**精细排序**，显著提升 Top-K 的相关性。

### 3. 查询改写（Query Rewriting）

让模型先将用户的口语化提问改写为更适合检索的形式：

- 原始："那个便宜的 GPT 替代品叫什么来着？"
- 改写："低成本 GPT-4 替代模型名称"

### 4. 上下文窗口管理

根据模型的上下文窗口大小和**Token 预算**决定检索数量：

- 预算充足：检索 10-15 个块
- 预算有限：检索 3-5 个高质量块

## RAG 的成本优势

以一个包含 10,000 篇文档的知识库为例：

| 方案 | 每次查询的 Token | 每 1,000 次查询成本 |
| --- | --- | --- |
| 全量塞入上下文 | ~500K | $1,250 |
| RAG（Top-5 检索） | ~3K | $7.50 |
| **节省** | | **99.4%** |

## 典型应用场景

- **企业客服**：基于产品文档自动回答用户问题
- **法律助手**：检索法规和案例辅助律师分析
- **技术文档搜索**：在 API 文档中精准找到答案
- **学术研究**：基于论文库回答研究问题

> RAG 中的 Embedding API 也可以通过中转站调用。使用 [LLM 预算计算器](https://yemai/llm) 估算 Embedding 和对话模型的综合成本。

---en---

*RAG · Vector Database · Knowledge Base · Enterprise Applications*

## What Is RAG?

**RAG (Retrieval-Augmented Generation)** combines **information retrieval** with **large language model generation**.

The core idea: retrieve the most relevant snippets from a knowledge base first, then pass them as context to the model so answers are grounded in **real data**.

```
User question → Vector search → Relevant chunks → Prompt assembly → LLM answer
```

## Why RAG?

### Limitations of LLMs

| Issue | Description | How RAG Helps |
| --- | --- | --- |
| Knowledge cutoff | Training data has a fixed date | Attach a continuously updated knowledge base |
| Hallucination | Models may invent facts | Generate from real documents with traceability |
| Weak domain knowledge | General models lack expertise | Inject private enterprise documents |
| High cost | Long context = more tokens | Retrieve only the most relevant snippets |

### RAG vs Long Context vs Fine-Tuning

| Approach | Best For | Cost | Knowledge Updates |
| --- | --- | --- | --- |
| RAG | Large-scale knowledge bases | Low | Instant |
| Long context | Small document sets per request | High | Re-upload each time |
| Fine-tuning | Style/format customization | Very high | Requires retraining |

## RAG Core Architecture

### Offline: Document Preprocessing

```
Raw documents → Text extraction → Chunking → Embedding → Vector database
```

#### 1. Chunking

Split long documents into appropriately sized segments. Common strategies:

| Strategy | Chunk Size | Use Case |
| --- | --- | --- |
| Fixed length | 256-512 tokens | General purpose |
| By paragraph/section | Variable | Structured documents |
| Recursive split | 256-1024 tokens | Recommended default |
| Semantic chunking | Dynamic | High-precision scenarios |

#### 2. Embedding

Convert text chunks into high-dimensional vectors that capture semantic meaning:

```
from openai import OpenAI

client = OpenAI(
    api_key="your-key",
    base_url="https://api.your-relay.com/v1"
)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="What is an API relay?"
)

vector = response.data[0].embedding  # 1536-dimensional vector
```

#### 3. Vector Database Options

| Database | Strengths | Use Case |
| --- | --- | --- |
| Pinecone | Fully managed, zero ops | Quick start |
| Weaviate | Built-in hybrid search | Enterprise |
| Qdrant | High performance, Rust | Large scale |
| ChromaDB | Lightweight, embeddable | Prototyping |
| pgvector | PostgreSQL extension | Teams already on Postgres |

### Online: Retrieve + Generate

```
# 1. Embed the user question
query_vector = embed("How do API relay prices compare?")

# 2. Search Top-K most similar chunks in the vector DB
relevant_chunks = vector_db.search(query_vector, top_k=5)

# 3. Assemble the prompt
context = "\n---\n".join([chunk.text for chunk in relevant_chunks])
prompt = f"""Answer the user's question based on the reference material below.
If the material does not contain relevant information, say so.

Reference material:
{context}

User question: How do API relay prices compare?"""

# 4. Call the LLM
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": prompt}]
)
```

## Key Techniques to Improve RAG

### 1. Hybrid Search

Combine **vector search** (semantic) with **keyword search** (exact match) for better results than either alone:

```
Final score = α × vector similarity + (1-α) × BM25 keyword score
```

### 2. Reranking

Use a cross-encoder model to **re-rank** initial retrieval results and improve Top-K relevance.

### 3. Query Rewriting

Have the model rewrite colloquial questions into retrieval-friendly form:

- Original: "What was that cheap GPT alternative called again?"
- Rewritten: "Low-cost GPT-4 alternative model names"

### 4. Context Window Management

Adjust retrieval count based on context window size and **token budget**:

- Generous budget: retrieve 10-15 chunks
- Tight budget: retrieve 3-5 high-quality chunks

## Cost Advantage of RAG

For a knowledge base with 10,000 documents:

| Approach | Tokens per Query | Cost per 1,000 Queries |
| --- | --- | --- |
| Full context stuffing | ~500K | $1,250 |
| RAG (Top-5 retrieval) | ~3K | $7.50 |
| **Savings** | | **99.4%** |

## Typical Use Cases

- **Enterprise support**: Answer user questions from product docs
- **Legal assistant**: Search regulations and cases for lawyers
- **Technical doc search**: Find precise answers in API documentation
- **Academic research**: Answer questions from a paper library

> Embedding APIs in RAG can also go through a relay. Use the [LLM cost calculator](https://yemai/llm) to estimate combined embedding and chat model costs.
