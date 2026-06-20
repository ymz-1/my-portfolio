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

export type Skill = {
  name: string;
  /** 0 - 100 */
  level: number;
};

export type SkillGroup = {
  title: Localized;
  skills: Skill[];
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

export type ArticleItem = {
  rank: number;
  title: Localized;
  readCount: string;
  metricLabel: Localized;
  metricValue: string;
  url?: string;
  highlight?: boolean;
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
  qrCaption: Localized;
  footer: Localized;
  /** 公众号二维码，暂缺时可留空 */
  qrSrc?: string;
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
  name: "麦吉",
  nameLocalized: { zh: "麦吉", en: "Maggie" } as Localized,
  avatarInitials: "MJ",
  avatarSrc: "/avatar.png",
  location: { zh: "中国 · 某城市", en: "Somewhere, China" } as Localized,
  email: "ymaizi2023@163.com",
  /** Hero 身份标签：C++ / 工具开发者 ｜ AI 工具 & 独立开发探索中 */
  headline: {
    zh: "C++ / 工具开发者 ｜ AI 工具 & 独立开发探索中",
    en: "C++ / Tooling Developer · Exploring AI tools & indie dev",
  } as Localized,
  /** Hero 问候语（显示在座右铭上方） */
  heroGreeting: {
    zh: "嗨，我是麦吉",
    en: "Hey, I'm Maggie",
  } as Localized,
  /** 一句话理念 / 座右铭 */
  quote: {
    zh: "做一些能解决实际问题的小工具，并记录过程。",
    en: "Build small tools that solve real problems — and document the journey.",
  } as Localized,
  /** 经验摘要一行 */
  experienceSummary: {
    zh: "2 年 C++ / MFC 开发 · 游戏 UGC 开发经验",
    en: "2 yrs of C++ / MFC development · game UGC experience",
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
    url: "https://github.com",
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
    handle: "@yourname",
    url: "https://github.com",
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
    handle: { zh: "@yourname", en: "@yourname" },
    url: "https://github.com",
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

export const skillGroups: SkillGroup[] = [
  {
    title: { zh: "桌面 / 客户端", en: "Desktop / Client" },
    skills: [
      { name: "C++", level: 88 },
      { name: "MFC / Win32", level: 82 },
      { name: "Windows 桌面工具", level: 80 },
      { name: "多线程 / 性能优化", level: 70 },
    ],
  },
  {
    title: { zh: "工具与自动化", en: "Tooling & Automation" },
    skills: [
      { name: "Python 脚本", level: 78 },
      { name: "Lua / UGC 脚本", level: 72 },
      { name: "Shell / 批处理", level: 68 },
      { name: "Git / CI", level: 70 },
    ],
  },
  {
    title: { zh: "探索中", en: "Exploring" },
    skills: [
      { name: "AI 辅助开发", level: 66 },
      { name: "TypeScript / Next.js", level: 58 },
      { name: "React", level: 52 },
      { name: "Three.js / R3F", level: 40 },
    ],
  },
];

export const articles: ArticleItem[] = [
  {
    rank: 1,
    highlight: true,
    title: {
      zh: "2026 年 AI 编程入门指南：从零到独立开发",
      en: "AI Coding in 2026: From Zero to Indie Dev",
    },
    readCount: "10W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "2.3K",
  },
  {
    rank: 2,
    highlight: true,
    title: {
      zh: "C++ 桌面工具开发：MFC 还没过时吗？",
      en: "C++ Desktop Tools: Is MFC Still Relevant?",
    },
    readCount: "8.5W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "1.8K",
  },
  {
    rank: 3,
    highlight: true,
    title: {
      zh: "我用 AI 做了一个爆款文章生成器",
      en: "How I Built an AI Viral Article Generator",
    },
    readCount: "6.2W+",
    metricLabel: { zh: "互动率", en: "Engagement" },
    metricValue: "12%",
  },
  {
    rank: 4,
    title: {
      zh: "游戏 UGC 节点式系统开发实战",
      en: "Building Node-Based UGC Systems in Games",
    },
    readCount: "4.1W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "980",
  },
  {
    rank: 5,
    title: {
      zh: "独立开发者的时间管理：少写代码多交付",
      en: "Time Management for Indie Devs: Ship More, Code Less",
    },
    readCount: "3.8W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "860",
  },
  {
    rank: 6,
    title: {
      zh: "Next.js + Three.js 搭建个人作品集",
      en: "Building a Portfolio with Next.js + Three.js",
    },
    readCount: "3.2W+",
    metricLabel: { zh: "互动率", en: "Engagement" },
    metricValue: "9%",
  },
  {
    rank: 7,
    title: {
      zh: "Python 自动化脚本：把重复工作交给机器",
      en: "Python Automation: Let Scripts Handle the Grind",
    },
    readCount: "2.9W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "720",
  },
  {
    rank: 8,
    title: {
      zh: "热点监控工具的技术架构拆解",
      en: "Inside a Hotspot Monitoring Tool",
    },
    readCount: "2.5W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "640",
  },
  {
    rank: 9,
    title: {
      zh: "从 0 到 1 做小工具：我的独立开发心得",
      en: "Zero to One: Lessons from Building Small Tools",
    },
    readCount: "2.1W+",
    metricLabel: { zh: "互动率", en: "Engagement" },
    metricValue: "7%",
  },
  {
    rank: 10,
    title: {
      zh: "2026 年值得关注的 5 个 AI 工具方向",
      en: "5 AI Tool Trends Worth Watching in 2026",
    },
    readCount: "1.8W+",
    metricLabel: { zh: "转发", en: "Shares" },
    metricValue: "520",
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
  },
  {
    title: { zh: "Ollama 管理器", en: "Ollama Manager" },
    description: {
      zh: "本地大模型管理工具，支持系统资源监控、智能模型推荐、局域网配置等功能。",
      en: "Local LLM manager with resource monitoring, model recommendations, and LAN setup.",
    },
    badge: { zh: "免费下载", en: "Free download" },
    tags: [
      { zh: "本地部署", en: "Local deploy" },
      { zh: "模型管理", en: "Model mgmt" },
    ],
  },
  {
    title: { zh: "AI 知识库助手", en: "AI Knowledge Base" },
    description: {
      zh: "基于 RAG 的个人知识库问答工具，支持文档导入与智能检索。",
      en: "RAG-powered personal knowledge base with document import and smart search.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "RAG", en: "RAG" },
      { zh: "知识管理", en: "Knowledge" },
    ],
  },
  {
    title: { zh: "代码片段管理器", en: "Snippet Manager" },
    description: {
      zh: "开发者常用代码片段收集与快速检索，支持多语言标签分类。",
      en: "Collect and search dev snippets with multi-language tag organization.",
    },
    badge: { zh: "免费下载", en: "Free download" },
    tags: [
      { zh: "效率工具", en: "Productivity" },
      { zh: "代码管理", en: "Snippets" },
    ],
  },
  {
    title: { zh: "Markdown 转公众号", en: "Markdown to WeChat" },
    description: {
      zh: "一键将 Markdown 文章转换为微信公众号排版格式，支持代码高亮。",
      en: "Convert Markdown to WeChat-ready formatting with syntax highlighting.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "写作工具", en: "Writing" },
      { zh: "排版转换", en: "Formatting" },
    ],
  },
  {
    title: { zh: "Git 提交规范检查", en: "Git Commit Linter" },
    description: {
      zh: "自动检查 Git 提交信息是否符合 Conventional Commits 规范。",
      en: "Lint commit messages against Conventional Commits conventions.",
    },
    badge: { zh: "参考工具", en: "Reference" },
    tags: [
      { zh: "Git", en: "Git" },
      { zh: "规范检查", en: "Linting" },
    ],
  },
  {
    title: { zh: "批量文件重命名", en: "Batch File Renamer" },
    description: {
      zh: "Windows 桌面小工具，支持正则表达式、序号前缀等多种批量改名模式。",
      en: "Windows desktop utility for batch rename with regex and numbering patterns.",
    },
    badge: { zh: "免费下载", en: "Free download" },
    tags: [
      { zh: "Windows", en: "Windows" },
      { zh: "文件工具", en: "File tools" },
    ],
  },
  {
    title: { zh: "API 调试面板", en: "API Debug Panel" },
    description: {
      zh: "轻量级 REST API 测试工具，支持环境变量管理与请求历史记录。",
      en: "Lightweight REST API tester with env vars and request history.",
    },
    badge: { zh: "在线使用", en: "Use online" },
    tags: [
      { zh: "API 测试", en: "API testing" },
      { zh: "开发调试", en: "Debugging" },
    ],
  },
  {
    title: { zh: "Devlog 写作助手", en: "Devlog Writing Helper" },
    description: {
      zh: "帮助独立开发者记录开发过程，自动生成周报和项目更新摘要。",
      en: "Help indie devs log progress and auto-generate weekly updates.",
    },
    badge: { zh: "立即报名", en: "Join waitlist" },
    tags: [
      { zh: "写作", en: "Writing" },
      { zh: "独立开发", en: "Indie dev" },
    ],
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
  greeting: { zh: "你好，我是 Ye Maizi。", en: "Hi, I'm Maggie." },
  intro: {
    zh: "我做一些解决日常问题的小工具。",
    en: "I build small tools to solve everyday problems.",
  },
  backgroundLabel: { zh: "背景：", en: "Background:" },
  backgroundItems: [
    {
      zh: "C++ / MFC 桌面开发（2 年）",
      en: "C++ / MFC desktop development (2 years)",
    },
    {
      zh: "游戏 UGC 内容创作（节点式系统）",
      en: "Game UGC content creation (node-based systems)",
    },
  ],
  nowLabel: { zh: "现在：", en: "Now:" },
  nowText: {
    zh: "我正在专注做小工具，并探索 AI 应用。",
    en: "I'm focusing on building small tools and exploring AI applications.",
  },
  qrCaption: { zh: "扫码关注公众号", en: "Scan to follow on WeChat" },
  footer: {
    zh: "一起学习，一起进步 ✨",
    en: "Let's learn and grow together ✨",
  },
};

export const contactLinks: ContactLink[] = [
  { label: "GitHub", url: "https://github.com", icon: "github" },
  { label: "WeChat", url: "https://example.com", icon: "wechat" },
  { label: "Email", url: `mailto:${profile.email}`, icon: "mail" },
];

export const navSections = [
  "home",
  "projects",
  "articles",
  "social",
  "stack",
  "contact",
] as const;
