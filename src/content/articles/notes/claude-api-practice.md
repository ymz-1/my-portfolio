---
slug: claude-api-practice
category: notes
title:
  zh: Claude API实践
  en: Claude API Practice
date: 2026-02-28
readCount: 1.3W
---

Claude API 接入实践笔记：流式输出、工具调用与错误重试。

- Streaming：用 SSE 向前端推送 partial 结果
- 重试：对 429/5xx 做指数退避
- 成本控制：按阶段选模型，大纲用轻量、成稿用高质量

代码片段见项目仓库。

---en---

Claude API integration notes: streaming, tool use, and retries.

- Streaming: SSE for partial results to the client
- Retries: exponential backoff on 429/5xx
- Cost: pick models per stage — light for outlines, stronger for final drafts

Code snippets live in the project repo.
