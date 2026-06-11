import type { Localized } from "@/lib/i18n/LanguageProvider";

/**
 * 集中管理的占位内容。
 * 想替换为真实信息，只需要修改这个文件即可。
 * 带 zh / en 的字段会随语言切换自动显示对应文本。
 */

export type SocialStat = {
  platform: string;
  handle: string;
  url: string;
  metricLabel: Localized;
  metricValue: string;
  description: Localized;
};

export type SocialCard = {
  platform: string;
  handle: Localized;
  url: string;
  icon: "github" | "twitter" | "mail" | "linkedin" | "bilibili" | "link";
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
  liveUrl?: string;
  codeUrl?: string;
  /** Tailwind gradient classes used for the cover placeholder */
  accent: string;
  featured?: boolean;
};

export type ExperienceItem = {
  company: string;
  role: Localized;
  period: string;
  description: Localized;
  highlights: Localized[];
};

export type TimeSlice = {
  label: Localized;
  value: number;
  color: string;
};

export type InterestBar = {
  label: Localized;
  value: number;
};

export type ContactLink = {
  label: string;
  url: string;
  icon: "github" | "twitter" | "mail" | "linkedin" | "bilibili" | "link";
};

export const profile = {
  name: "Your Name",
  nameLocalized: { zh: "你的名字", en: "Your Name" } as Localized,
  avatarInitials: "YN",
  location: { zh: "中国 · 某城市", en: "Somewhere, Earth" } as Localized,
  email: "hello@example.com",
  roles: [
    { zh: "全栈开发者", en: "Full-Stack Developer" },
    { zh: "前端工程师", en: "Frontend Engineer" },
    { zh: "独立开发者", en: "Indie Hacker" },
    { zh: "开源爱好者", en: "Open Source Enthusiast" },
    { zh: "创意编程玩家", en: "Creative Coder" },
  ] as Localized[],
  about: [
    {
      zh: "我是一名热爱构建产品的开发者，专注于把复杂的问题拆解成优雅、可维护的解决方案。从像素到部署，我享受端到端打造产品的整个过程。",
      en: "I'm a developer who loves building products — turning complex problems into elegant, maintainable solutions. From pixels to deployment, I enjoy the entire end-to-end craft.",
    },
    {
      zh: "工作之外，我喜欢探索新技术、参与开源、写技术博客，也热衷于把有趣的想法做成小项目。",
      en: "Outside of work, I explore new tech, contribute to open source, write about what I learn, and turn fun ideas into side projects.",
    },
  ] as Localized[],
  now: {
    zh: "正在做一款独立小游戏 · 顺手写点 devlog",
    en: "Building a tiny indie game · writing devlogs along the way",
  } as Localized,
};

export const socials: SocialStat[] = [
  {
    platform: "GitHub",
    handle: "@yourname",
    url: "https://github.com",
    metricLabel: { zh: "仓库", en: "Repos" },
    metricValue: "48",
    description: {
      zh: "开源项目、实验与日常练习的代码都在这里。",
      en: "Open source projects, experiments and daily code live here.",
    },
  },
  {
    platform: "Twitter / X",
    handle: "@yourname",
    url: "https://x.com",
    metricLabel: { zh: "关注者", en: "Followers" },
    metricValue: "2.3K",
    description: {
      zh: "分享关于编程、设计与生活的碎碎念。",
      en: "Short thoughts on programming, design and life.",
    },
  },
  {
    platform: "Blog",
    handle: "blog.example.com",
    url: "https://example.com",
    metricLabel: { zh: "文章", en: "Articles" },
    metricValue: "36",
    description: {
      zh: "长篇技术文章与学习笔记的归档。",
      en: "Long-form technical writing and learning notes.",
    },
  },
];

export const socialCards: SocialCard[] = [
  {
    platform: "Bilibili",
    handle: { zh: "数字游牧人", en: "Digital Nomad" },
    url: "https://space.bilibili.com",
    icon: "bilibili",
    stats: [
      { value: "366K", label: { zh: "粉丝", en: "followers" } },
      { value: "14M", label: { zh: "播放", en: "views" } },
      { value: "78", label: { zh: "视频", en: "videos" } },
    ],
    description: {
      zh: "在这里我分享对软件工程的思考，也带新手入门编程。",
      en: "I share my thoughts on software engineering and help beginners learn to code.",
    },
  },
  {
    platform: "Bilibili",
    handle: { zh: "游戏游牧人", en: "Game Nomad" },
    url: "https://space.bilibili.com",
    icon: "bilibili",
    stats: [
      { value: "15K", label: { zh: "粉丝", en: "followers" } },
      { value: "2.8M", label: { zh: "播放", en: "views" } },
      { value: "12", label: { zh: "视频", en: "videos" } },
    ],
    description: {
      zh: "我把游戏当成实验，通过它研究行为心理、产品设计与美学。",
      en: "I treat games as experiments to study behavior, product design and aesthetics.",
    },
  },
  {
    platform: "Twitter / X",
    handle: { zh: "@yourname", en: "@yourname" },
    url: "https://x.com",
    icon: "twitter",
    stats: [{ value: "15.5K", label: { zh: "粉丝", en: "followers" } }],
    description: {
      zh: "分享我最近在折腾什么，以及一些零碎的想法。",
      en: "Brief thoughts and updates about my latest adventures.",
    },
  },
  {
    platform: "TikTok",
    handle: { zh: "数字游牧人", en: "Digital Nomad" },
    url: "https://www.tiktok.com",
    icon: "link",
    stats: [
      { value: "252K", label: { zh: "粉丝", en: "followers" } },
      { value: "1.2M", label: { zh: "点赞", en: "likes" } },
    ],
    description: {
      zh: "用短视频记录技术、生活与一些小实验。",
      en: "Short videos about tech, life and little experiments.",
    },
  },
  {
    platform: "Xiaohongshu",
    handle: { zh: "数字游牧人", en: "Digital Nomad" },
    url: "https://www.xiaohongshu.com",
    icon: "link",
    stats: [
      { value: "30K", label: { zh: "粉丝", en: "followers" } },
      { value: "40K", label: { zh: "点赞", en: "likes" } },
    ],
    description: {
      zh: "图文笔记，记录学习与日常的灵感。",
      en: "Notes and photos capturing what I learn and daily inspiration.",
    },
  },
  {
    platform: "Douban",
    handle: { zh: "DNSamuel", en: "DNSamuel" },
    url: "https://www.douban.com",
    icon: "link",
    stats: [
      { value: "714", label: { zh: "电影", en: "movies" } },
      { value: "174", label: { zh: "书籍", en: "books" } },
      { value: "251", label: { zh: "游戏", en: "games" } },
    ],
    description: {
      zh: "我读过的书、看过的电影、玩过的游戏，都记录在这里。",
      en: "A log of the books I've read, movies I've watched and games I've played.",
    },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: { zh: "前端", en: "Frontend" },
    skills: [
      { name: "TypeScript / JavaScript", level: 92 },
      { name: "React / Next.js", level: 90 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Three.js / R3F", level: 70 },
    ],
  },
  {
    title: { zh: "后端", en: "Backend" },
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Python", level: 78 },
      { name: "PostgreSQL / SQL", level: 75 },
      { name: "Go", level: 55 },
    ],
  },
  {
    title: { zh: "工具与其它", en: "Tools & More" },
    skills: [
      { name: "Git / CI/CD", level: 86 },
      { name: "Docker", level: 72 },
      { name: "Figma", level: 68 },
      { name: "Rust", level: 40 },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Project Aurora",
    description: {
      zh: "一个实时协作的白板应用，支持多人光标、离线同步与无限画布。",
      en: "A real-time collaborative whiteboard with multiplayer cursors, offline sync and an infinite canvas.",
    },
    tags: ["Next.js", "WebSocket", "CRDT", "Canvas"],
    liveUrl: "https://example.com",
    codeUrl: "https://github.com",
    accent: "from-violet-500/30 to-fuchsia-500/15",
    featured: true,
  },
  {
    title: "DevPulse",
    description: {
      zh: "面向开发者的指标看板，把 GitHub、CI 与监控数据聚合到一个漂亮的仪表盘。",
      en: "A developer metrics dashboard aggregating GitHub, CI and monitoring data into one beautiful view.",
    },
    tags: ["React", "D3", "Node.js"],
    liveUrl: "https://example.com",
    codeUrl: "https://github.com",
    accent: "from-indigo-500/30 to-violet-500/15",
  },
  {
    title: "Pixel Forge",
    description: {
      zh: "浏览器里的像素艺术编辑器，支持图层、动画导出与调色板分享。",
      en: "A browser-based pixel art editor with layers, animation export and palette sharing.",
    },
    tags: ["Canvas", "TypeScript", "PWA"],
    codeUrl: "https://github.com",
    accent: "from-purple-500/30 to-zinc-500/15",
  },
  {
    title: "Lumen CLI",
    description: {
      zh: "一个让终端输出更易读的命令行工具，内置主题与结构化日志。",
      en: "A CLI tool that makes terminal output readable with built-in themes and structured logs.",
    },
    tags: ["Rust", "CLI"],
    codeUrl: "https://github.com",
    accent: "from-violet-400/30 to-slate-500/15",
  },
];

export const experiences: ExperienceItem[] = [
  {
    company: "Tech Company",
    role: { zh: "高级前端工程师", en: "Senior Frontend Engineer" },
    period: "2023 — Now",
    description: {
      zh: "负责核心产品的前端架构与体验，带领小团队推动设计系统落地。",
      en: "Owned the frontend architecture and experience of the core product, leading a small team to ship a design system.",
    },
    highlights: [
      {
        zh: "重构组件库，构建时间下降 40%。",
        en: "Rebuilt the component library, cutting build time by 40%.",
      },
      {
        zh: "推动可访问性改进，达到 WCAG AA 标准。",
        en: "Drove accessibility improvements to meet WCAG AA.",
      },
    ],
  },
  {
    company: "Startup Inc.",
    role: { zh: "全栈开发者", en: "Full-Stack Developer" },
    period: "2021 — 2023",
    description: {
      zh: "作为早期成员，从 0 到 1 搭建产品，覆盖前端、后端与基础设施。",
      en: "As an early member, built the product from 0 to 1 across frontend, backend and infrastructure.",
    },
    highlights: [
      {
        zh: "独立交付支付与订阅模块。",
        en: "Shipped the payments and subscription module solo.",
      },
      {
        zh: "搭建 CI/CD 流水线，部署频率提升 5 倍。",
        en: "Set up CI/CD pipelines, increasing deploy frequency 5x.",
      },
    ],
  },
  {
    company: "Freelance",
    role: { zh: "独立开发者", en: "Independent Developer" },
    period: "2019 — 2021",
    description: {
      zh: "为不同客户构建网站与小型应用，积累了从沟通到交付的完整经验。",
      en: "Built websites and small apps for various clients, gaining end-to-end experience from communication to delivery.",
    },
    highlights: [
      {
        zh: "完成 20+ 个客户项目。",
        en: "Delivered 20+ client projects.",
      },
    ],
  },
];

export const timeAllocation: TimeSlice[] = [
  { label: { zh: "编程", en: "Coding" }, value: 40, color: "#a78bfa" },
  { label: { zh: "学习", en: "Learning" }, value: 25, color: "#8b5cf6" },
  { label: { zh: "设计", en: "Design" }, value: 15, color: "#c4b5fd" },
  { label: { zh: "生活", en: "Life" }, value: 20, color: "#7c7a90" },
];

export const interests: InterestBar[] = [
  { label: { zh: "开源", en: "Open Source" }, value: 90 },
  { label: { zh: "游戏", en: "Gaming" }, value: 75 },
  { label: { zh: "音乐", en: "Music" }, value: 60 },
  { label: { zh: "摄影", en: "Photography" }, value: 50 },
  { label: { zh: "旅行", en: "Travel" }, value: 70 },
];

export const counters: { label: Localized; value: number; suffix?: string }[] = [
  { label: { zh: "项目", en: "Projects" }, value: 48, suffix: "+" },
  { label: { zh: "提交", en: "Commits" }, value: 12, suffix: "K+" },
  { label: { zh: "文章", en: "Articles" }, value: 36 },
  { label: { zh: "咖啡", en: "Cups of Coffee" }, value: 999, suffix: "+" },
];

export const contactLinks: ContactLink[] = [
  { label: "GitHub", url: "https://github.com", icon: "github" },
  { label: "Twitter", url: "https://x.com", icon: "twitter" },
  { label: "Email", url: "mailto:hello@example.com", icon: "mail" },
  { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
];

export const navSections = [
  "home",
  "about",
  "stack",
  "projects",
  "experience",
  "stats",
  "contact",
] as const;
