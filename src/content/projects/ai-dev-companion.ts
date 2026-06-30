import type { ProjectDetail } from "./types";

export const aiDevCompanion: ProjectDetail = {
  slug: "ai-dev-companion",
  title: "LLM 评测中心",
  description: {
    zh: "大模型竞技与选型平台（ModArena）— 多模型并排对比、Prompt Lab、Battle 盲测、批量评测与 AI 自动评分。",
    en: "LLM benchmarking platform (ModArena) — side-by-side comparison, Prompt Lab, blind Battle, batch eval, and AI auto-scoring.",
  },
  tags: ["Vue", "FastAPI", "LangChain", "OpenRouter"],
  codeUrl: "https://github.com/ymz-1/modarena",
  coverSrc: "/projects/llm-eval.png",
  accent: "from-violet-500/30 to-purple-600/15",
  featureTags: ["多模型对比", "Prompt Lab", "Battle 盲测", "批量评测", "成本监控"],
  intro: {
    zh: "LLM 评测中心（ModArena · 模竞技场）帮助开发者和团队在大模型选型时做数据驱动的决策。同一 Prompt 可并行对比 1–8 个模型，实时查看流式输出、Token 消耗与 USD 成本；Prompt Lab 支持 2–5 个提示词变体 A/B 测试；Battle 模式匿名盲测消除品牌偏见；批量测试按预设场景自动跑分，WebSocket 推送进度，可选 AI 多评委交叉评分。\n\n后端基于 FastAPI + LangChain，经 OpenRouter 统一调用数百模型；前端 Vue 3 + Ant Design Vue，SSE 流式对话、ECharts 可视化报告。",
    en: "LLM Eval Center (ModArena) helps teams pick models with data, not gut feel. Compare 1–8 models on one prompt with streaming output, token counts, and USD cost; run 2–5 prompt variants in Prompt Lab; blind A/B in Battle mode; automate scenario-based batch jobs with WebSocket progress and optional multi-judge AI scoring.\n\nFastAPI + LangChain backend via OpenRouter; Vue 3 + Ant Design Vue frontend with SSE streaming and ECharts reports.",
  },
  techStack: [
    { name: "FastAPI", role: { zh: "异步 API / SSE", en: "Async API & SSE" } },
    { name: "Vue 3", role: { zh: "SPA 前端", en: "SPA frontend" } },
    { name: "LangChain", role: { zh: "LLM 调用编排", en: "LLM orchestration" } },
    { name: "OpenRouter", role: { zh: "多模型网关", en: "Model gateway" } },
    { name: "MySQL + Redis", role: { zh: "持久化与会话", en: "Storage & sessions" } },
  ],
  architecture: {
    overview: {
      zh: "Vue 3 SPA 经 Nginx 访问 FastAPI；REST + SSE 负责对话流式输出，STOMP WebSocket 推送批量任务进度；Service 层聚合 MySQL、Redis 与 OpenRouter。",
      en: "Vue 3 SPA behind Nginx talks to FastAPI; REST + SSE for streaming chat, STOMP WebSocket for batch progress; services layer wraps MySQL, Redis, and OpenRouter.",
    },
    frontend: {
      zh: "Side-by-Side / Prompt Lab / Battle / 代码模式 / 批量任务与报告页；Pinia 管理登录态，Monaco 代码高亮，ECharts 雷达图与柱状图。",
      en: "Side-by-Side, Prompt Lab, Battle, code mode, batch jobs and reports; Pinia auth, Monaco editor, ECharts radar and bar charts.",
    },
    backend: {
      zh: "分层单体：API 薄控制器 → Service 业务层 → SQLAlchemy ORM；Celery 可选分布式批量；APScheduler 同步 OpenRouter 模型库与定价缓存。",
      en: "Layered monolith: thin API → services → SQLAlchemy ORM; optional Celery for batch; APScheduler syncs OpenRouter models and pricing cache.",
    },
  },
  media: [
    {
      src: "/projects/picture/modleArea_run.png",
      alt: { zh: "ModArena 运行截图", en: "ModArena runtime screenshot" },
      caption: {
        zh: "多模型并排对比与成本统计",
        en: "Side-by-side model comparison with cost stats",
      },
    },
  ],
  highlights: [
    {
      title: { zh: "多模型并排对比", en: "Side-by-side comparison" },
      content: {
        zh: "同一 Prompt 并行调用 1–8 个模型，SSE 多路流合并推送，实时展示 Token 与成本。",
        en: "Run 1–8 models on one prompt in parallel; merged SSE streams with live token and cost stats.",
      },
    },
    {
      title: { zh: "Battle 匿名盲测", en: "Blind Battle mode" },
      content: {
        zh: "双模型以「模型 A / B」匿名展示，用户评分后再揭晓，减少品牌偏见。",
        en: "Two models shown as A/B until you rate — reduces brand bias in subjective eval.",
      },
    },
    {
      title: { zh: "场景化批量评测", en: "Scenario batch testing" },
      content: {
        zh: "预设场景 + 多模型异步并发，STOMP WebSocket 实时进度，可选 AI 多评委交叉评分。",
        en: "Preset scenarios × multiple models with async concurrency; STOMP progress and optional multi-judge AI scoring.",
      },
    },
    {
      title: { zh: "成本与预算监控", en: "Cost & budget tracking" },
      content: {
        zh: "按对话统计 Token / USD，支持日/月预算限额与预警阈值。",
        en: "Per-conversation token and USD tracking with daily/monthly budget limits and alerts.",
      },
    },
  ],
  quickStart: {
    zh: `# 克隆仓库
git clone https://github.com/ymz-1/modarena.git
cd modarena

# 数据库
mysql -u root -p < sql/create_table.sql

# 后端 (:9090)
cd python-backend
pip install -r requirements.txt
cp .env.example .env   # 填入 OPENROUTER_API_KEY
python -m app.main

# 前端 (:5173)
cd frontend
npm install && npm run dev`,
    en: `# Clone
git clone https://github.com/ymz-1/modarena.git
cd modarena

# Database
mysql -u root -p < sql/create_table.sql

# Backend (:9090)
cd python-backend
pip install -r requirements.txt
cp .env.example .env   # set OPENROUTER_API_KEY
python -m app.main

# Frontend (:5173)
cd frontend
npm install && npm run dev`,
  },
};

export default aiDevCompanion;
