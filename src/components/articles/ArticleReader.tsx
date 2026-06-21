"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  getArticlesByCategory,
  type ArticleCategory,
  type ArticleDetail,
} from "@/content/articles";
import { cn } from "@/lib/utils";
import { ArticleMarkdown } from "./ArticleMarkdown";

type Props = {
  category: ArticleCategory;
  article: ArticleDetail;
};

export function ArticleReader({ category, article }: Props) {
  const { t, pick } = useLanguage();
  const items = getArticlesByCategory(category);
  const categoryLabel =
    category === "stories" ? t.articles.stories : t.articles.notes;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-0 px-4 py-8 sm:px-6 lg:flex-row lg:gap-0 lg:py-10">
      {/* Sidebar */}
      <aside className="mb-6 shrink-0 lg:mb-0 lg:w-64 lg:border-r lg:border-white/10 lg:pr-6 xl:w-72">
        <Link
          href="/#articles"
          className="mb-4 inline-flex text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {t.articles.backHome}
        </Link>

        <Link
          href={`/articles/${category}/`}
          className="block text-lg font-bold tracking-tight text-foreground transition-colors hover:text-brand"
        >
          {categoryLabel}
        </Link>

        <nav className="mt-4 border-t border-white/10 pt-4">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const active = item.slug === article.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/articles/${category}/${item.slug}/`}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm leading-snug transition-colors",
                      active
                        ? "bg-brand/15 font-medium text-brand"
                        : "text-muted hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {pick(item.title)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <article className="min-w-0 flex-1 lg:pl-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="font-mono text-xs text-muted">
            {categoryLabel}
            {article.date ? ` · ${article.date}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {pick(article.title)}
          </h1>
        </header>

        <ArticleMarkdown content={pick(article.body)} />
      </article>
    </div>
  );
}
