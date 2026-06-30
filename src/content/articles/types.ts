import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ArticleCategory = "stories" | "notes";

export type ArticleDetail = {
  slug: string;
  category: ArticleCategory;
  title: Localized;
  body: Localized;
  date?: string;
  tags?: string[];
  /** 首页卡片序号高亮（橙色） */
  highlight?: boolean;
};

export type ArticlePreview = Pick<
  ArticleDetail,
  "slug" | "category" | "title" | "date" | "tags" | "highlight"
>;

export type ArticleListItem = ArticlePreview;
