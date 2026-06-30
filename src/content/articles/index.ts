import stories from "./stories";
import notes from "./notes";
import type { ArticleCategory, ArticleDetail, ArticleListItem } from "./types";

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

/** 首页文章卡片：stories 在前，notes 在后 */
export function getHomeArticleList(): ArticleListItem[] {
  return allArticles.map((article) => ({
    slug: article.slug,
    category: article.category,
    title: article.title,
    date: article.date,
    tags: article.tags,
    highlight: article.highlight,
  }));
}

export type { ArticleCategory, ArticleDetail, ArticlePreview, ArticleListItem } from "./types";
