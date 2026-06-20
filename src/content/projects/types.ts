import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ProjectMedia = {
  src: string;
  alt: Localized;
  caption?: Localized;
};

export type ProjectHighlight = {
  title: Localized;
  content: Localized;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  /** 卡片与详情页摘要 */
  description: Localized;
  tags: string[];
  accent: string;
  coverSrc?: string;
  featured?: boolean;
  /** 站内演示路径，如 /tools/ai-article */
  demoUrl?: string;
  /** 站外演示（无 demoUrl 时使用） */
  liveUrl?: string;
  codeUrl?: string;

  /** 详情页：完整介绍 */
  intro: Localized;
  techStack: { name: string; role?: Localized }[];
  architecture: {
    imageSrc?: string;
    overview: Localized;
    frontend: Localized;
    backend: Localized;
  };
  media: ProjectMedia[];
  highlights: ProjectHighlight[];
  /** 为 true 时详情页各区块显示占位文案 */
  placeholder?: boolean;
};

export type ProjectCard = Pick<
  ProjectDetail,
  | "slug"
  | "title"
  | "description"
  | "tags"
  | "accent"
  | "coverSrc"
  | "featured"
  | "demoUrl"
  | "liveUrl"
  | "codeUrl"
>;

export function toProjectCard(project: ProjectDetail): ProjectCard {
  const {
    slug,
    title,
    description,
    tags,
    accent,
    coverSrc,
    featured,
    demoUrl,
    liveUrl,
    codeUrl,
  } = project;
  return {
    slug,
    title,
    description,
    tags,
    accent,
    coverSrc,
    featured,
    demoUrl,
    liveUrl,
    codeUrl,
  };
}
