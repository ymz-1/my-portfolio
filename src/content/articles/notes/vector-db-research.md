---
slug: vector-db-research
category: notes
title:
  zh: 向量库调研笔记
  en: Vector DB Research Notes
date: 2026-02-10
readCount: 6.5K
---

为个人知识库小工具做的向量数据库调研摘要。

对比维度：本地部署难度、中文检索效果、过滤能力、价格。

候选：Chroma（轻量本地）、Qdrant（功能全）、pgvector（已有 Postgres 时省事）。

结论：MVP 阶段优先 Chroma，量上来再迁移。

---en---

Vector DB research for a personal knowledge-base tool.

Compared: local setup, Chinese retrieval quality, filtering, pricing.

Candidates: Chroma (lightweight local), Qdrant (full-featured), pgvector (if you already run Postgres).

Conclusion: start with Chroma for MVP, migrate when scale demands it.
