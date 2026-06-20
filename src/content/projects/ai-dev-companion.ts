import type { ProjectDetail } from "./types";

export const aiDevCompanion: ProjectDetail = {
  slug: "ai-dev-companion",
  title: "AI Dev Companion",
  description: {
    zh: "一个实验性的 AI 辅助开发小助手，把常用的代码生成、注释与重构提示串成本地工作流。",
    en: "An experimental AI-assisted dev companion that wires common code generation, commenting and refactor prompts into a local workflow.",
  },
  tags: ["Python", "AI", "CLI"],
  codeUrl: "https://github.com",
  accent: "from-purple-500/30 to-zinc-500/15",
  placeholder: true,
  intro: {
    zh: "详情整理中，敬请期待。",
    en: "Details coming soon.",
  },
  techStack: [
    { name: "Python" },
    { name: "AI" },
    { name: "CLI" },
  ],
  architecture: {
    overview: { zh: "详情整理中。", en: "Details coming soon." },
    frontend: { zh: "—", en: "—" },
    backend: { zh: "—", en: "—" },
  },
  media: [],
  highlights: [],
};

export default aiDevCompanion;
