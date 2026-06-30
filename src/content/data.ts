import type { Localized } from "@/lib/i18n/LanguageProvider";
import type { IconName } from "@/components/ui/icons";

/**
 * 集中管理的占位内容。
 * 想替换为真实信息，只需要修改这个文件即可。
 * 带 zh / en 的字段会随语言切换自动显示对应文本。
 */

export type SocialStat = {
  platform: Localized;
  handle: string;
  url: string;
  metricLabel: Localized;
  metricValue: string;
  description: Localized;
};

export type SocialCard = {
  platform: Localized;
  handle: Localized;
  url: string;
  icon: IconName;
  stats: { value: string; label: Localized }[];
  description: Localized;
};

export type { ProjectCard as Project } from "@/content/projects";
export { projects } from "@/content/projects";

export type GadgetItem = {
  title: Localized;
  description: Localized;
  badge: Localized;
  tags: Localized[];
  siteUrl?: string;
  liveUrl?: string;
};

export type ContactLink = {
  label: string;
  url: string;
  icon: IconName;
};

export type ContactCardContent = {
  title: Localized;
  greeting: Localized;
  intro: Localized;
  backgroundLabel: Localized;
  backgroundItems: Localized[];
  nowLabel: Localized;
  nowText: Localized;
  footer: Localized;
};

/** Hero 卡片底部的主要入口（GitHub / 公众号 / Email） */
export type CtaLink = {
  label: Localized;
  url: string;
  icon: IconName;
  /** 外链在新标签页打开，mailto / 锚点则不需要 */
  external?: boolean;
};

export const profile = {
  name: "8bit游牧人",
  /** Hero 大标题（渐变字） */
  heroTitle: { zh: "8bit游牧人", en: "NoahXYZ" } as Localized,
  nameLocalized: { zh: "8bit游牧人", en: "NoahXYZ" } as Localized,
  avatarInitials: "NX",
  avatarSrc: "/avatar.png",
  location: { zh: "中国 · 某城市", en: "Somewhere, China" } as Localized,
  email: "ymaizi2023@163.com",
  headline: {
    zh: "独立开发探索中",
    en: "Exploring indie development",
  } as Localized,
  heroGreeting: {
    zh: "嗨，我是小叶",
    en: "Hey, I'm NoahXYZ",
  } as Localized,
  quote: {
    zh: "做一些能解决实际问题的小工具，并记录探索过程。",
    en: "Build small tools that solve real problems — and document the exploration.",
  } as Localized,
  experienceSummary: {
    zh: "曾从事C++软件开发，现专注AI应用与工具实践。",
    en: "Former C++ developer, now focused on AI apps and practical tooling.",
  } as Localized,
  about: [
    {
      zh: "我是一名以 C++ 为主的工具开发者，喜欢把重复、繁琐的工作做成顺手的小工具。日常和 MFC / Win32 桌面应用打交道，也做过游戏 UGC 相关的开发。",
      en: "I'm a C++-focused tooling developer who loves turning repetitive, tedious work into handy little tools. I work day-to-day with MFC / Win32 desktop apps and have built game UGC tooling.",
    },
    {
      zh: "最近在探索 AI 辅助开发和独立开发，尝试用更现代的方式做产品，并把折腾的过程写成 devlog 记录下来。",
      en: "Lately I've been exploring AI-assisted development and indie hacking — building products in a more modern way, and writing devlogs about the messy process.",
    },
  ] as Localized[],
  now: {
    zh: "在写一个提效小工具 · 顺手记点 devlog",
    en: "Building a productivity tool · jotting down devlogs",
  } as Localized,
};

/** Hero 卡片底部入口：GitHub / 公众号 / Email */
export const heroCtas: CtaLink[] = [
  {
    label: { zh: "GitHub", en: "GitHub" },
    url: "https://github.com/ymz-1",
    icon: "github",
    external: true,
  },
  {
    label: { zh: "公众号", en: "WeChat" },
    url: "#contact",
    icon: "wechat",
  },
  {
    label: { zh: "Email", en: "Email" },
    url: `mailto:${profile.email}`,
    icon: "mail",
  },
];

export const socials: SocialStat[] = [
  {
    platform: { zh: "GitHub", en: "GitHub" },
    handle: "@ymz-1",
    url: "https://github.com/ymz-1",
    metricLabel: { zh: "仓库", en: "Repos" },
    metricValue: "32",
    description: {
      zh: "C++ 小工具、脚本与各种实验性项目都在这里。",
      en: "C++ tools, scripts and assorted experiments live here.",
    },
  },
  {
    platform: { zh: "公众号", en: "WeChat" },
    handle: "你的公众号",
    url: "https://example.com",
    metricLabel: { zh: "文章", en: "Articles" },
    metricValue: "24",
    description: {
      zh: "记录 C++、工具开发与独立开发路上的思考与笔记。",
      en: "Notes on C++, tooling and the indie dev journey.",
    },
  },
  {
    platform: { zh: "博客", en: "Blog" },
    handle: "blog.example.com",
    url: "https://example.com",
    metricLabel: { zh: "devlog", en: "devlogs" },
    metricValue: "18",
    description: {
      zh: "长一点的技术文章与开发日志归档。",
      en: "Long-form technical writing and dev logs.",
    },
  },
];

export const socialCards: SocialCard[] = [
  {
    platform: { zh: "GitHub", en: "GitHub" },
    handle: { zh: "@ymz-1", en: "@ymz-1" },
    url: "https://github.com/ymz-1",
    icon: "github",
    stats: [
      { value: "32", label: { zh: "仓库", en: "repos" } },
      { value: "1.2K", label: { zh: "提交", en: "commits" } },
      { value: "8", label: { zh: "工具", en: "tools" } },
    ],
    description: {
      zh: "我开源的 C++ 小工具、脚本与练手项目。",
      en: "My open-source C++ tools, scripts and side projects.",
    },
  },
  {
    platform: { zh: "公众号", en: "WeChat" },
    handle: { zh: "你的公众号", en: "WeChat Official" },
    url: "https://example.com",
    icon: "wechat",
    stats: [
      { value: "24", label: { zh: "文章", en: "articles" } },
      { value: "3.6K", label: { zh: "关注", en: "followers" } },
    ],
    description: {
      zh: "分享 C++、工具开发和独立开发路上的实战经验。",
      en: "Hands-on notes on C++, tooling and the indie dev path.",
    },
  },
  {
    platform: { zh: "Bilibili", en: "Bilibili" },
    handle: { zh: "工具人日常", en: "Tooling Daily" },
    url: "https://space.bilibili.com",
    icon: "bilibili",
    stats: [
      { value: "5.2K", label: { zh: "粉丝", en: "followers" } },
      { value: "320K", label: { zh: "播放", en: "views" } },
    ],
    description: {
      zh: "偶尔录点开发过程、工具演示和踩坑记录。",
      en: "Occasional dev process, tool demos and debugging logs.",
    },
  },
  {
    platform: { zh: "掘金", en: "Juejin" },
    handle: { zh: "稀土掘金", en: "Juejin" },
    url: "https://juejin.cn",
    icon: "link",
    stats: [
      { value: "40", label: { zh: "文章", en: "articles" } },
      { value: "2.1K", label: { zh: "点赞", en: "likes" } },
    ],
    description: {
      zh: "技术文章与学习笔记的中文社区归档。",
      en: "Chinese tech community archive of articles and notes.",
    },
  },
  {
    platform: { zh: "知乎", en: "Zhihu" },
    handle: { zh: "知乎", en: "Zhihu" },
    url: "https://www.zhihu.com",
    icon: "link",
    stats: [{ value: "1.8K", label: { zh: "关注", en: "followers" } }],
    description: {
      zh: "回答一些 C++、Windows 开发与职业相关的问题。",
      en: "Answering questions on C++, Windows dev and careers.",
    },
  },
  {
    platform: { zh: "邮箱", en: "Email" },
    handle: { zh: profile.email, en: profile.email },
    url: `mailto:${profile.email}`,
    icon: "mail",
    stats: [{ value: "24h", label: { zh: "回复", en: "reply" } }],
    description: {
      zh: "合作、交流或只是想聊聊，都欢迎发邮件。",
      en: "Collaborations, chats, or just saying hi — email me.",
    },
  },
];

export const gadgetItems: GadgetItem[] = [
  {
    title: { zh: "LLM 预算计算器", en: "LLM Budget Calculator" },
    description: {
      zh: "快速估算大模型 API 调用成本，支持多种模型定价对比与月度预算规划。",
      en: "Estimate LLM API costs quickly with model pricing comparison and monthly budget planning.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "Token 分析", en: "Token analysis" },
      { zh: "成本管理", en: "Cost control" },
    ],
    siteUrl: "/llm/",
  },
  {
    title: { zh: "LLM Token 计数器", en: "LLM Token Counter" },
    description: {
      zh: "统计并可视化 GPT、Claude、Gemini 和 Llama 的 Token，支持多模型切换与本地切分预览。",
      en: "Count and visualize tokens for GPT, Claude, Gemini, and Llama with local segmentation preview.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "Token 分析", en: "Token analysis" },
      { zh: "Prompt 优化", en: "Prompt tuning" },
    ],
    siteUrl: "/llm/token-counter/",
  },
  {
    title: { zh: "上下文窗口检查器", en: "Context Window Checker" },
    description: {
      zh: "检查你的提示词是否能放入某个模型的上下文窗口，实时显示用量与剩余空间。",
      en: "Check if your prompt fits a model's context window with live usage and remaining space.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "上下文", en: "Context" },
      { zh: "Prompt 优化", en: "Prompt tuning" },
    ],
    siteUrl: "/llm/context-window/",
  },
  {
    title: { zh: "AI 知识库助手", en: "AI Knowledge Base" },
    description: {
      zh: "上传 PDF，在浏览器本地完成语义检索与大模型问答，纯前端 RAG 演示。",
      en: "Upload a PDF for local semantic search and LLM Q&A — a client-side RAG demo.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "RAG", en: "RAG" },
      { zh: "本地演示", en: "Local demo" },
    ],
    siteUrl: "/llm/knowledge-base/",
  },
  {
    title: { zh: "工具调用构建器", en: "Function Calling Builder" },
    description: {
      zh: "可视化设计 AI 工具接口，自动生成 OpenAI、Claude、LangChain 可用的 JSON Schema。",
      en: "Visually design AI tool interfaces and export OpenAI, Claude, and LangChain schemas.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "Function Calling", en: "Function Calling" },
      { zh: "Agent 开发", en: "Agent dev" },
    ],
    siteUrl: "/llm/function-calling/",
  },
  {
    title: { zh: "API Key 批量测试", en: "API Key Batch Tester" },
    description: {
      zh: "批量验证 OpenAI / Anthropic API Key 是否可用，统计有效、无效、限流与请求延迟。",
      en: "Batch-check OpenAI / Anthropic API keys — valid, invalid, rate-limited, and latency stats.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "API Key", en: "API Key" },
      { zh: "批量检测", en: "Batch test" },
    ],
    siteUrl: "/llm/api-key-tester/",
  },
  {
    title: { zh: "模型矩阵", en: "Model Matrix" },
    description: {
      zh: "一览各服务商对 GPT、Claude、Gemini 等主流模型的支持状态。",
      en: "See which providers support GPT, Claude, Gemini, and other mainstream models.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "模型对比", en: "Model compare" },
      { zh: "服务商", en: "Providers" },
    ],
    siteUrl: "/llm/model-matrix/",
  },
  {
    title: { zh: "Prompt 模板生成器", en: "Prompt Template Generator" },
    description: {
      zh: "选择写作、编程或分析用途，自动生成含角色、目标、输出格式的结构化 Prompt 模板。",
      en: "Pick writing, coding, or analysis — auto-generate structured prompts with role, goal, and output format.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "Prompt 工程", en: "Prompting" },
      { zh: "本地演示", en: "Local demo" },
    ],
    siteUrl: "/llm/prompt-generator/",
  },
  {
    title: { zh: "显存需求说明", en: "VRAM Requirements Guide" },
    description: {
      zh: "显存与 LLM 模型配置对照表，帮助你选择合适的显卡运行 AI 模型。",
      en: "VRAM vs LLM model size reference to help you pick the right GPU for local inference.",
    },
    badge: { zh: "参考工具", en: "Reference" },
    tags: [
      { zh: "显卡选购", en: "GPU buying" },
      { zh: "模型配置", en: "Model sizing" },
    ],
    siteUrl: "/llm/vram/",
  },
];

export const counters: { label: Localized; value: number; suffix?: string }[] = [
  { label: { zh: "工具", en: "Tools" }, value: 12, suffix: "+" },
  { label: { zh: "提交", en: "Commits" }, value: 3, suffix: "K+" },
  { label: { zh: "文章", en: "Articles" }, value: 24 },
  { label: { zh: "经验", en: "Years" }, value: 2, suffix: "y" },
];

export const contactCard: ContactCardContent = {
  title: { zh: "认识一下", en: "Get to know me" },
  greeting: { zh: "你好，我是8bit游牧人。", en: "Hi, I'm NoahXYZ." },
  intro: {
    zh: "我做一些解决日常问题的小工具。",
    en: "I build small tools to solve everyday problems.",
  },
  backgroundLabel: { zh: "过去：", en: "Past:" },
  backgroundItems: [
    {
      zh: "做过桌面软件开发",
      en: "Desktop software development",
    },
    {
      zh: "参与过游戏内容创作开发",
      en: "Game content creation & tooling",
    },
  ],
  nowLabel: { zh: "现在：", en: "Now:" },
  nowText: {
    zh: "正在探索 AI 应用与独立开发，\n希望做出一些真正被使用的小工具。",
    en: "Exploring AI applications and indie development,\nhoping to build small tools that people actually use.",
  },
  footer: {
    zh: "持续构建，持续学习",
    en: "Keep building. Keep learning.",
  },
};

export const contactLinks: ContactLink[] = [
  { label: "GitHub", url: "https://github.com/ymz-1", icon: "github" },
  { label: "WeChat", url: "#contact", icon: "wechat" },
  { label: "Email", url: `mailto:${profile.email}`, icon: "mail" },
];

export const navSections = [
  "home",
  "projects",
  "articles",
  "social",
  "contact",
] as const;
