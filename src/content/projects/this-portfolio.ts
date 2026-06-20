import type { ProjectDetail } from "./types";

export const thisPortfolio: ProjectDetail = {
  slug: "this-portfolio",
  title: "This Portfolio",
  description: {
    zh: "你正在看的这个个人站，用 Next.js + Tailwind + Three.js 搭建，顺便练手现代前端与 3D。",
    en: "The personal site you're looking at — built with Next.js + Tailwind + Three.js as a hands-on dive into modern frontend and 3D.",
  },
  tags: ["Next.js", "Tailwind", "Three.js"],
  liveUrl: "https://example.com",
  codeUrl: "https://github.com",
  accent: "from-violet-400/30 to-slate-500/15",
  placeholder: true,
  intro: {
    zh: "详情整理中，敬请期待。",
    en: "Details coming soon.",
  },
  techStack: [
    { name: "Next.js" },
    { name: "Tailwind CSS" },
    { name: "Three.js" },
  ],
  architecture: {
    overview: { zh: "详情整理中。", en: "Details coming soon." },
    frontend: { zh: "—", en: "—" },
    backend: { zh: "—", en: "—" },
  },
  media: [],
  highlights: [],
};

export default thisPortfolio;
