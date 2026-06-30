import type { ProjectDetail } from "./types";

export const roocode: ProjectDetail = {
  slug: "roocode",
  title: "RooCode",
  description: {
    zh: "从零实现的终端 AI 编程助手，五层 Agent 架构，支持多模型、MCP、权限沙箱与多 Agent 协作。",
    en: "A terminal AI coding assistant built from scratch with a five-layer agent architecture, multi-model support, MCP, permission sandbox, and multi-agent coordination.",
  },
  tags: ["Python", "Textual", "Agent", "MCP"],
  codeUrl: "https://github.com/ymz-1/roocode",
  coverSrc: "/projects/roocode.png",
  accent: "from-zinc-600/30 to-zinc-900/20",
  featured: true,
  featureTags: ["五层架构", "多模型", "MCP", "权限控制", "上下文压缩", "Skills"],
  intro: {
    zh: "RooCode 是我独立开发的终端 AI 编程助手。做这个项目，是为了真正理解 Agent 如何运行——从交互层到安全层，每一行代码都能解释为什么这么写。\n\n用户用自然语言下达任务，Agent 自主完成代码阅读、文件修改、命令执行等工作。底层采用五层架构：交互层（CLI / 配置 / 命令 / 技能）、引擎层（LLM 客户端 / Agent 循环 / 编排）、工具层（内置工具 / MCP / Hook）、记忆层（上下文压缩 / 会话管理 / 指令文件）、安全层（权限控制 / 路径沙箱 / 隔离）。",
    en: "RooCode is a terminal AI coding assistant I built from scratch. The goal was to understand how an agent actually runs — from the interaction layer down to security, with every line explainable.\n\nUsers describe tasks in natural language; the agent reads code, edits files, and runs commands autonomously. Under the hood: five layers — interaction (CLI, config, commands, skills), engine (LLM client, agent loop, orchestration), tools (built-ins, MCP, hooks), memory (compression, sessions, instruction files), and security (permissions, path sandbox, isolation).",
  },
  techStack: [
    { name: "Python", role: { zh: "运行时", en: "Runtime" } },
    { name: "Textual", role: { zh: "终端 TUI", en: "Terminal TUI" } },
    { name: "Anthropic / OpenAI", role: { zh: "多模型协议", en: "Multi-model APIs" } },
    { name: "MCP", role: { zh: "外部工具扩展", en: "External tools" } },
  ],
  architecture: {
    overview: {
      zh: "事件驱动的 Agent 循环，工具层统一内置与 MCP 能力，安全层拦截所有工具调用。",
      en: "Event-driven agent loop, unified built-in and MCP tools, security layer intercepting every tool call.",
    },
    frontend: {
      zh: "Textual TUI：流式输出、工具调用可视化、权限确认与 Slash 命令。",
      en: "Textual TUI with streaming output, tool-call visualization, permission prompts, and slash commands.",
    },
    backend: {
      zh: "Agent 引擎、LLM 流式归一化、上下文压缩、五层权限与 Skills 热加载。",
      en: "Agent engine, normalized LLM streaming, context compression, five-layer permissions, and hot-loaded skills.",
    },
  },
  media: [
    {
      src: "/projects/roocode.png",
      alt: { zh: "RooCode 终端界面", en: "RooCode terminal UI" },
      caption: {
        zh: "Textual TUI：流式输出与工具调用可视化",
        en: "Textual TUI with streaming output and tool-call visualization",
      },
    },
  ],
  highlights: [
    {
      title: { zh: "事件驱动解耦", en: "Event-driven decoupling" },
      content: {
        zh: "Agent 发事件、UI 与 Hook 各自消费，生产者与消费者互不知晓实现细节，便于扩展与测试。",
        en: "Agents emit events; UI and hooks consume them independently — producers and consumers stay decoupled for easier extension and testing.",
      },
    },
    {
      title: { zh: "工具即能力边界", en: "Tools define capability boundaries" },
      content: {
        zh: "Agent 能做什么完全由工具列表决定；换一套工具集就是另一个 Agent，Plan Mode 与 Skill allowlist 同源设计。",
        en: "What an agent can do is defined entirely by its tool set; swap tools and you get a different agent — same idea behind Plan Mode and skill allowlists.",
      },
    },
    {
      title: { zh: "LLM 决策，系统执行", en: "LLM decides, system executes" },
      content: {
        zh: "Agent Loop 不做业务判断；用什么工具、顺序与纠错策略全由 LLM 决定，系统忠实执行并回传结果。",
        en: "The agent loop makes no business calls; tool choice, order, and recovery are LLM-driven while the runtime executes faithfully.",
      },
    },
    {
      title: { zh: "流式协议归一化", en: "Streaming protocol normalization" },
      content: {
        zh: "Anthropic 与 OpenAI 兼容协议的流式差异在 LLM Client 层消化，上层只认统一的抽象事件流。",
        en: "Anthropic vs OpenAI streaming differences are absorbed in the LLM client; upper layers see one abstract event stream.",
      },
    },
    {
      title: { zh: "五层权限拦截", en: "Five-layer permission guard" },
      content: {
        zh: "危险命令检测、路径沙箱、规则引擎、权限模式与 HITL 确认层层短路，任一 deny 不可被覆盖。",
        en: "Dangerous-command checks, path sandbox, rule engine, permission modes, and HITL — any deny is final.",
      },
    },
  ],
  quickStart: {
    zh: `# 克隆仓库
git clone https://github.com/ymz-1/roocode.git
cd roocode

# 安装依赖
uv sync

# 创建配置并填入 API Key
mkdir -p .RooCode
cp config.example.yaml .RooCode/config.yaml

# 启动
uv run roocode`,
    en: `# Clone
git clone https://github.com/ymz-1/roocode.git
cd roocode

# Install
uv sync

# Configure API key
mkdir -p .RooCode
cp config.example.yaml .RooCode/config.yaml

# Run
uv run roocode`,
  },
};

export default roocode;
