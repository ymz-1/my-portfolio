import matter from "gray-matter";
import type { Localized } from "@/lib/i18n/LanguageProvider";
import type { ArticleCategory, ArticleDetail } from "./types";

const EN_DELIMITER = "\n---en---\n";

type ArticleFrontmatter = {
  slug: string;
  category: ArticleCategory;
  title: Localized;
  date?: string;
  readCount?: string;
};

export function parseArticleMarkdown(raw: string): ArticleDetail {
  const { data, content } = matter(raw);
  const meta = data as ArticleFrontmatter;
  const trimmed = content.trim();
  const [zhPart, enPart] = trimmed.split(EN_DELIMITER);

  return {
    slug: meta.slug,
    category: meta.category,
    title: meta.title,
    date: meta.date,
    readCount: meta.readCount,
    body: {
      zh: zhPart.trim(),
      en: (enPart ?? zhPart).trim(),
    },
  };
}
