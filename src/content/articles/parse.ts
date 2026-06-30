import matter from "gray-matter";
import type { Localized } from "@/lib/i18n/LanguageProvider";
import type { ArticleCategory, ArticleDetail } from "./types";

const EN_DELIMITER = "\n---en---\n";

type ArticleFrontmatter = {
  slug: string;
  category: ArticleCategory;
  title: Localized;
  date?: string | Date;
  tags?: string[];
  highlight?: boolean;
};

/** gray-matter 会把 YAML date 解析为 Date，统一成 YYYY-MM-DD 避免 hydration 不一致 */
function normalizeArticleDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return normalizeArticleDate(parsed);
    return value;
  }
  return undefined;
}

export function parseArticleMarkdown(raw: string): ArticleDetail {
  const { data, content } = matter(raw);
  const meta = data as ArticleFrontmatter;
  const trimmed = content.trim();
  const [zhPart, enPart] = trimmed.split(EN_DELIMITER);

  return {
    slug: meta.slug,
    category: meta.category,
    title: meta.title,
    date: normalizeArticleDate(meta.date),
    tags: meta.tags,
    highlight: meta.highlight,
    body: {
      zh: zhPart.trim(),
      en: (enPart ?? zhPart).trim(),
    },
  };
}
