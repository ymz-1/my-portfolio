"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { getPreviewArticles, type ArticleCategory } from "@/content/articles";

function ArticleCategoryBlock({
  category,
  showTopDivider = false,
}: {
  category: ArticleCategory;
  showTopDivider?: boolean;
}) {
  const { t, pick } = useLanguage();
  const label = category === "stories" ? t.articles.stories : t.articles.notes;
  const items = getPreviewArticles(category, 3);

  return (
    <div className={cn(showTopDivider && "border-t border-white/15")}>
      <div className="border-b border-white/15 px-5 py-3">
        <Link
          href={`/articles/${category}/`}
          className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-brand sm:text-lg"
        >
          {label}
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug} className="p-5">
            <Link
              href={`/articles/${category}/${item.slug}/`}
              className="group block space-y-2"
            >
              <h3 className="text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-brand sm:text-base">
                {pick(item.title)}
              </h3>
              {item.readCount ? (
                <p className="text-xs text-muted/80">
                  {t.articles.readLabel} {item.readCount}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArticleList() {
  const { t } = useLanguage();

  return (
    <section id="articles" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-4xl px-6">
        <Reveal className="mb-10 border-b border-white/10 pb-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span aria-hidden className="text-xl">
              📄
            </span>
            {t.articles.title}
          </h2>
        </Reveal>

        <Reveal className="overflow-hidden border border-white/15">
          <ArticleCategoryBlock category="stories" />
          <ArticleCategoryBlock category="notes" showTopDivider />
        </Reveal>
      </div>
    </section>
  );
}
