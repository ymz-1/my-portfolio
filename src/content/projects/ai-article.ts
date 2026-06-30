import type { ProjectDetail } from "./types";

export const aiArticle: ProjectDetail = {
  slug: "ai-article",
  title: "图文创作平台",
  description: {
    zh: "基于多智能体编排的 AI 文章创作平台，从选题、大纲到成稿一站式完成，支持实时进度与图文混排。",
    en: "Multi-agent AI writing platform — topic to outline to finished draft in one flow, with live progress and rich media.",
  },
  tags: ["Python", "FastAPI", "Vue", "AI"],
  codeUrl: "https://github.com/ymz-1/inkflow",
  coverSrc: "/projects/ai-article.png",
  accent: "from-emerald-500/25 to-lime-400/10",
  featured: true,
  featureTags: ["多 Agent", "SSE 流式", "Vue 3", "FastAPI", "SQLite"],
  intro: {
    zh: "这是一个面向内容创作者的 AI 写作工作台。用户输入主题后，系统通过多智能体流水线自动完成选题分析、大纲生成、分段撰写与润色，全程以 SSE 推送进度，前端实时展示每个阶段的输出。我负责整体架构设计、后端编排逻辑与 Vue 前端交互实现。",
    en: "An AI writing workspace for content creators. Given a topic, a multi-agent pipeline handles ideation, outlining, drafting, and polishing — with SSE streaming progress to a Vue frontend that renders each stage in real time. I owned the architecture, backend orchestration, and frontend UX.",
  },
  techStack: [
    { name: "Python", role: { zh: "后端运行时", en: "Backend runtime" } },
    { name: "FastAPI", role: { zh: "API 与 SSE", en: "API & SSE" } },
    { name: "Vue 3", role: { zh: "SPA 前端", en: "SPA frontend" } },
    { name: "Vite", role: { zh: "构建工具", en: "Build tool" } },
    { name: "OpenAI API", role: { zh: "大模型调用", en: "LLM integration" } },
  ],
  architecture: {
    overview: {
      zh: "浏览器访问 Vue SPA，通过 REST + SSE 与 FastAPI 通信；后端按阶段调度多个 Agent，每步结果增量推送到前端。",
      en: "The Vue SPA talks to FastAPI over REST + SSE. The backend schedules multiple agents per stage and streams incremental results to the client.",
    },
    frontend: {
      zh: "Vue 3 单页应用，Hash 路由，Axios 调用 API，EventSource 订阅生成进度；Markdown 渲染与图文混排预览。",
      en: "Vue 3 SPA with hash routing, Axios for API calls, EventSource for generation progress, plus Markdown preview with rich media.",
    },
    backend: {
      zh: "FastAPI 提供 REST 与 SSE 端点；Agent 模块负责选题、大纲、正文、润色；SQLite 持久化会话与草稿。",
      en: "FastAPI exposes REST and SSE endpoints. Agent modules handle topic, outline, body, and polish stages. SQLite stores sessions and drafts.",
    },
  },
  media: [
    {
      src: "/projects/picture/ai-article_run.png",
      alt: { zh: "AI 文章生成运行截图", en: "AI article generator runtime screenshot" },
      caption: {
        zh: "主界面：输入主题后实时展示各 Agent 阶段输出",
        en: "Main UI: live output from each agent stage after entering a topic",
      },
    },
  ],
  highlights: [
    {
      title: { zh: "SSE 流式进度", en: "SSE streaming progress" },
      content: {
        zh: "长文本生成可能耗时数分钟，采用 Server-Sent Events 按阶段推送，避免前端长时间无反馈；断线后可从最近 checkpoint 恢复。",
        en: "Long-form generation can take minutes. SSE pushes stage-by-stage updates so the UI never feels stuck; clients can resume from the last checkpoint after disconnect.",
      },
    },
    {
      title: { zh: "多 Agent 编排", en: "Multi-agent orchestration" },
      content: {
        zh: "各 Agent 职责单一、可独立替换模型；编排层控制调用顺序与上下文传递，便于后续扩展新写作步骤。",
        en: "Each agent has a single responsibility and swappable model. The orchestrator controls order and context handoff, making new writing steps easy to add.",
      },
    },
    {
      title: { zh: "SQLite 会话持久化", en: "SQLite session persistence" },
      content: {
        zh: "任务、大纲与草稿写入 SQLite，刷新页面或中断后可从最近阶段恢复，避免长流程重复生成。",
        en: "Tasks, outlines, and drafts persist in SQLite so users can resume from the last stage after refresh or interruption.",
      },
    },
  ],
  quickStart: {
    zh: `# 克隆仓库
git clone https://github.com/ymz-1/inkflow.git
cd inkflow

# 后端
cd backend
pip install -r requirements.txt
cp .env.example .env   # 填入 OPENAI_API_KEY
uvicorn main:app --reload --port 8000

# 前端（新终端）
cd frontend
npm install && npm run dev`,
    en: `# Clone
git clone https://github.com/ymz-1/inkflow.git
cd inkflow

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # set OPENAI_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install && npm run dev`,
  },
};

export default aiArticle;
