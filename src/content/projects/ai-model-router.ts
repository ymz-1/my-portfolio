import type { ProjectDetail } from "./types";

export const aiModelRouter: ProjectDetail = {
  slug: "ai-model-router",
  title: "AI 模型路由器",
  description: {
    zh: "企业级 AI 模型统一接入与调度平台 — OpenAI 兼容 API，多 Provider 智能路由、Fallback、计费与 Python SDK。",
    en: "Enterprise AI model gateway — OpenAI-compatible API, multi-provider routing, fallback, billing, and Python SDK.",
  },
  tags: ["FastAPI", "Vue 3", "Redis", "Docker"],
  codeUrl: "https://github.com/ymz-1/model_bridge",
  coverSrc: "/projects/ai-model-router.png",
  accent: "from-indigo-500/30 to-violet-600/15",
  featureTags: ["OpenAI 兼容", "智能路由", "Fallback", "BYOK", "Python SDK"],
  intro: {
    zh: "AI 模型路由器（Model Bridge）是企业级 AI 模型统一接入与调度平台。随着大语言模型快速普及，企业在接入 AI 能力时面临厂商 API 格式不一致、单 Provider 故障导致业务中断、Token 消耗与费用难以统一管控等问题。本平台提供 OpenAI 兼容的统一 API，对接通义千问、智谱 AI、DeepSeek 等主流模型，内置智能路由、自动 Fallback、API Key 管理、按量计费与 Python SDK，帮助团队以一套接口访问多模型并保障高可用与成本可控。",
    en: "AI Model Router (Model Bridge) is an enterprise gateway for unified AI model access and scheduling. Teams integrating LLMs face inconsistent vendor APIs, single-provider outages, and opaque token spend. The platform exposes an OpenAI-compatible API to Qwen, Zhipu, DeepSeek, and more — with smart routing, automatic fallback, API key management, usage-based billing, and a Python SDK so one integration covers many models with reliability and cost control.",
  },
  techStack: [
    { name: "FastAPI", role: { zh: "异步 API 网关", en: "Async API gateway" } },
    { name: "Vue 3", role: { zh: "Web 管理台", en: "Web admin UI" } },
    { name: "MySQL", role: { zh: "业务持久化", en: "Business data" } },
    { name: "Redis", role: { zh: "Session / 限流 / 缓存", en: "Session, rate limit, cache" } },
    { name: "Docker Compose", role: { zh: "一键部署", en: "One-click deploy" } },
    { name: "model-bridge-sdk", role: { zh: "Python 客户端", en: "Python client" } },
  ],
  architecture: {
    overview: {
      zh: "前后端分离 + Nginx 统一网关：Web / SDK / 第三方系统经 Nginx 访问 FastAPI，后端负责鉴权、路由、计费，通过适配器层调用各 AI Provider 上游 API。",
      en: "Decoupled frontend/backend behind Nginx: Web, SDK, and third-party clients hit FastAPI for auth, routing, and billing; adapter layer calls upstream AI providers.",
    },
    frontend: {
      zh: "Vue 3 + Vite SPA，Pinia 状态管理，Ant Design Vue 组件库；提供对话、文生图、API Key 管理、充值与管理端模型/用户/黑名单配置。",
      en: "Vue 3 + Vite SPA with Pinia and Ant Design Vue — chat, image generation, API key management, recharge, and admin pages for models, users, and IP blacklist.",
    },
    backend: {
      zh: "FastAPI 分层：API → Middleware（鉴权、IP 黑名单）→ Service（Chat、Routing、Billing、Plugin）→ Strategy / Adapter / Plugin；MySQL 存业务数据，Redis 负责 Session、限流与响应缓存。",
      en: "Layered FastAPI: API → middleware (auth, IP blacklist) → services (chat, routing, billing, plugins) → strategy / adapter / plugin modules; MySQL for data, Redis for sessions, rate limits, and response cache.",
    },
  },
  media: [
    {
      src: "/projects/ai-model-router.png",
      alt: { zh: "AI 模型路由器", en: "Model Bridge gateway" },
      caption: {
        zh: "统一 OpenAI 兼容 API 与多 Provider 管理",
        en: "Unified OpenAI-compatible API and multi-provider admin",
      },
    },
  ],
  highlights: [
    {
      title: { zh: "智能路由与 Fallback", en: "Smart routing & fallback" },
      content: {
        zh: "支持 fixed / auto / cost_first / latency_first 四种策略；主模型失败时按备用链自动切换，最多重试 3 次，降低单 Provider 故障风险。",
        en: "Fixed, auto, cost-first, and latency-first strategies; on primary failure, fallback chain retries up to 3 times to reduce single-provider outage risk.",
      },
    },
    {
      title: { zh: "OpenAI 兼容 API + Python SDK", en: "OpenAI-compatible API & Python SDK" },
      content: {
        zh: "`POST /api/v1/chat/completions` 兼容 OpenAI 调用习惯；`model-bridge-sdk` 支持同步与流式对话，便于第三方系统集成。",
        en: "`POST /api/v1/chat/completions` matches OpenAI conventions; `model-bridge-sdk` supports sync and streaming chat for easy third-party integration.",
      },
    },
    {
      title: { zh: "计费与治理", en: "Billing & governance" },
      content: {
        zh: "用户级 Token 配额与余额扣费，每次调用写入 request_log；API Key 限流、IP 黑名单与 X-Trace-Id 全链路追踪，支持 BYOK 跳过平台扣费。",
        en: "Per-user token quotas and balance billing with request logs; API key rate limits, IP blacklist, X-Trace-Id tracing, and BYOK to skip platform charges.",
      },
    },
    {
      title: { zh: "插件扩展", en: "Plugin extensions" },
      content: {
        zh: "插件系统在对话前注入上下文，支持 Web 搜索、PDF 解析、图片识别等增强能力，管理员可启用/禁用插件。",
        en: "Plugin system injects context before chat — web search, PDF parsing, image recognition — with admin enable/disable controls.",
      },
    },
  ],
  quickStart: {
    zh: `# 克隆仓库
git clone https://github.com/ymz-1/model_bridge.git
cd model_bridge

# Docker 一键部署
chmod +x start.sh && ./start.sh
# 前端 http://localhost  后端 http://localhost:8123/api

# Python SDK
cd sdk && pip install -e .
from model_bridge_sdk import ModelBridgeClient
client = ModelBridgeClient.builder().api_key("sk-xxx").base_url("http://localhost:8123/api").build()
print(client.chat("你好").content)`,
    en: `# Clone
git clone https://github.com/ymz-1/model_bridge.git
cd model_bridge

# Docker one-click deploy
chmod +x start.sh && ./start.sh
# Frontend http://localhost  API http://localhost:8123/api

# Python SDK
cd sdk && pip install -e .
from model_bridge_sdk import ModelBridgeClient
client = ModelBridgeClient.builder().api_key("sk-xxx").base_url("http://localhost:8123/api").build()
print(client.chat("Hello").content)`,
  },
};

export default aiModelRouter;
