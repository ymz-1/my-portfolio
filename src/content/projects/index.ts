import aiArticle from "./ai-article";
import insightRadar from "./insight-radar";
import aiDevCompanion from "./ai-dev-companion";
import thisPortfolio from "./this-portfolio";
import type { ProjectDetail } from "./types";
import { toProjectCard, type ProjectCard } from "./types";

export const projectDetails: ProjectDetail[] = [
  aiArticle,
  insightRadar,
  aiDevCompanion,
  thisPortfolio,
];

export const projects: ProjectCard[] = projectDetails.map(toProjectCard);

export const projectSlugs = projectDetails.map((p) => p.slug);

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug);
}

export type { ProjectDetail, ProjectCard, ProjectMedia, ProjectHighlight } from "./types";
