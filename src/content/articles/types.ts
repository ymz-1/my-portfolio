import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ArticleCategory = "stories" | "notes";

export type ArticleDetail = {
  slug: string;
  category: ArticleCategory;
  title: Localized;
  body: Localized;
  date?: string;
  readCount?: string;
};

export type ArticlePreview = Pick<
  ArticleDetail,
  "slug" | "category" | "title" | "readCount"
>;
