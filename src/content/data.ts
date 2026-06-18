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

export type Project = {
  title: string;
  description: Localized;
  tags: string[];
  /** 站内工具路径，如 /tools/ai-article */
  siteUrl?: string;
  liveUrl?: string;
  codeUrl?: string;
  /** Tailwind gradient classes used for the cover placeholder */
  accent: string;
  /** 封面图片（可选，优先于渐变占位） */
  coverSrc?: string;
  featured?: boolean;
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
  name: "Your Name",
  nameLocalized: { zh: "你的名字", en: "Your Name" } as Localized,
  avatarInitials: "YN",
  avatarSrc: "/avatar.png",
  location: { zh: "中国 · 某城市", en: "Somewhere, China" } as Localized,
  email: "ymaizi2023@163.com",
  /** Hero 身份标签：C++ / 工具开发者 ｜ AI 工具 & 独立开发探索中 */
  headline: {
    zh: "C++ / 工具开发者 ｜ AI 工具 & 独立开发探索中",
    en: "C++ / Tooling Developer · Exploring AI tools & indie dev",
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

export const projects: Project[] = [
  {
    title: "AI 爆款文章生成",
    description: {
      zh: "基于多智能体编排的 AI 文章创作平台，从选题、大纲到成稿一站式完成，支持实时进度与图文混排。",
      en: "Multi-agent AI writing platform — topic to outline to finished draft in one flow, with live progress and rich media.",
    },
    tags: ["Python", "FastAPI", "Vue", "AI"],
    siteUrl: "/tools/ai-article",
    coverSrc: "/projects/ai-article.png",
    codeUrl: "https://github.com",
    accent: "from-emerald-500/25 to-lime-400/10",
    featured: true,
  },
  {
    title: "UGC Script Helper",
    description: {
      zh: "面向游戏 UGC 创作者的脚本辅助工具，提供语法提示、模板与一键打包，降低上手门槛。",
      en: "A scripting helper for game UGC creators with syntax hints, templates and one-click packaging to lower the entry barrier.",
    },
    tags: ["C++", "Lua", "UGC", "Editor"],
    codeUrl: "https://github.com",
    accent: "from-indigo-500/30 to-violet-500/15",
  },
  {
    title: "AI Dev Companion",
    description: {
      zh: "一个实验性的 AI 辅助开发小助手，把常用的代码生成、注释与重构提示串成本地工作流。",
      en: "An experimental AI-assisted dev companion that wires common code generation, commenting and refactor prompts into a local workflow.",
    },
    tags: ["Python", "AI", "CLI"],
    codeUrl: "https://github.com",
    accent: "from-purple-500/30 to-zinc-500/15",
  },
  {
    title: "This Portfolio",
    description: {
      zh: "你正在看的这个个人站，用 Next.js + Tailwind + Three.js 搭建，顺便练手现代前端与 3D。",
      en: "The personal site you're looking at — built with Next.js + Tailwind + Three.js as a hands-on dive into modern frontend and 3D.",
    },
    tags: ["Next.js", "Tailwind", "Three.js"],
    liveUrl: "https://example.com",
    codeUrl: "https://github.com",
    accent: "from-violet-400/30 to-slate-500/15",
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
  greeting: { zh: "你好，我是 Ye Maizi。", en: "Hi, I'm Ye Maizi." },
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
  "about",
  "stack",
  "social",
  "contact",
] as const;
