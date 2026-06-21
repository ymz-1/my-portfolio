import stories from "./stories";
import notes from "./notes";
import type { ArticleCategory, ArticleDetail } from "./types";

export const storiesArticles = stories;
export const notesArticles = notes;

export const allArticles: ArticleDetail[] = [...stories, ...notes];

export const articleCategories: ArticleCategory[] = ["stories", "notes"];

export function getArticlesByCategory(category: ArticleCategory): ArticleDetail[] {
  return category === "stories" ? stories : notes;
}

export function getArticle(category: ArticleCategory, slug: string): ArticleDetail | undefined {
  return getArticlesByCategory(category).find((a) => a.slug === slug);
}

export function getCategorySlugs(category: ArticleCategory): string[] {
  return getArticlesByCategory(category).map((a) => a.slug);
}

export function getPreviewArticles(category: ArticleCategory, limit = 3): ArticleDetail[] {
  return getArticlesByCategory(category).slice(0, limit);
}

export type { ArticleCategory, ArticleDetail, ArticlePreview } from "./types";
