export type ArticleViewsMap = Record<string, number>;

const viewsApiEnabled =
  process.env.NEXT_PUBLIC_ARTICLE_VIEWS_API === "true";

export function isArticleViewsEnabled(): boolean {
  return viewsApiEnabled;
}

function articleKey(category: string, slug: string) {
  return `${category}/${slug}`;
}

export function formatViewCount(count: number): string {
  if (count >= 10_000) {
    const value = count / 10_000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}W`;
  }
  if (count >= 1_000) {
    const value = count / 1_000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(count);
}

export async function fetchArticleViews(): Promise<ArticleViewsMap> {
  if (!viewsApiEnabled) return {};
  try {
    const res = await fetch("/api/articles/views/", { cache: "no-store" });
    if (!res.ok) return {};
    const data = (await res.json()) as { views?: ArticleViewsMap };
    return data.views ?? {};
  } catch {
    return {};
  }
}

export async function recordArticleView(
  category: string,
  slug: string,
): Promise<number | null> {
  if (!viewsApiEnabled) return null;
  try {
    const res = await fetch(`/api/articles/${category}/${slug}/view/`, {
      method: "POST",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export function getViewCount(
  views: ArticleViewsMap,
  category: string,
  slug: string,
): number {
  return views[articleKey(category, slug)] ?? 0;
}

export { articleKey };
