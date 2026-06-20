import type { ProjectDetail } from "./types";

export const insightRadar: ProjectDetail = {
  slug: "insight-radar",
  title: "Insight Radar",
  description: {
    zh: "AI 热点监控工具 — 多源聚合抓取、AI 相关性分析，WebSocket 实时推送热点通知。",
    en: "AI hotspot monitor — multi-source aggregation, AI relevance analysis, and real-time WebSocket alerts.",
  },
  tags: ["Express", "React", "Socket.io", "AI"],
  demoUrl: "/tools/insight-radar",
  coverSrc: undefined,
  accent: "from-orange-500/25 to-amber-400/10",
  intro: {
    zh: "Insight Radar 帮助创作者追踪多平台热点。后端定时抓取关键词相关资讯，经 AI 评估相关性后，通过 WebSocket 将高价值热点实时推送到前端仪表盘。我负责 Express 服务、抓取调度、Socket.io 通道与 React 看板。",
    en: "Insight Radar helps creators track trends across platforms. The backend crawls keyword-related feeds on a schedule, scores relevance with AI, and pushes high-value hits to a React dashboard via WebSocket. I built the Express service, crawl scheduler, Socket.io layer, and React UI.",
  },
  techStack: [
    { name: "Express", role: { zh: "API 服务", en: "API server" } },
    { name: "React", role: { zh: "仪表盘前端", en: "Dashboard UI" } },
    { name: "Socket.io", role: { zh: "实时通知", en: "Real-time alerts" } },
    { name: "Node.js", role: { zh: "运行时", en: "Runtime" } },
    { name: "OpenAI API", role: { zh: "相关性分析", en: "Relevance scoring" } },
  ],
  architecture: {
    overview: {
      zh: "React 客户端通过 REST 管理关键词与设置，Socket.io 订阅热点通知；Express 后端负责抓取、分析与推送。",
      en: "The React client manages keywords and settings over REST and subscribes to alerts via Socket.io. Express handles crawling, analysis, and push.",
    },
    frontend: {
      zh: "React + Vite 构建，TanStack Query 管理 API 状态，Socket.io 客户端接收实时热点卡片与通知。",
      en: "React + Vite with TanStack Query for API state and a Socket.io client for live hotspot cards and notifications.",
    },
    backend: {
      zh: "Express 提供 REST API；定时任务拉取多源数据；AI 模块过滤低相关条目；Socket.io 广播新热点给在线用户。",
      en: "Express REST API, scheduled multi-source fetch jobs, AI filtering for low-relevance items, and Socket.io broadcast to online clients.",
    },
  },
  media: [],
  highlights: [
    {
      title: { zh: "WebSocket 实时推送", en: "WebSocket real-time push" },
      content: {
        zh: "热点时效性强，采用 Socket.io 房间机制按用户关键词推送，避免轮询带来的延迟与服务器压力。",
        en: "Trends are time-sensitive. Socket.io rooms push by user keywords, avoiding polling delay and server load.",
      },
    },
    {
      title: { zh: "多源聚合与 AI 过滤", en: "Multi-source aggregation & AI filter" },
      content: {
        zh: "统一抓取管道接入多个资讯源，AI 相关性打分后再入库，减少噪音通知。",
        en: "A unified crawl pipeline ingests multiple feeds; AI relevance scoring runs before storage to cut noise.",
      },
    },
  ],
};

export default insightRadar;
