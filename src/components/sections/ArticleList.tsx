"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { getHomeArticleList } from "@/content/articles";

export function ArticleList() {
  const { t, pick } = useLanguage();
  const items = getHomeArticleList();

  return (
    <section id="articles" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl px-6">
        <Reveal className="mb-10 border-b border-white/10 pb-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span aria-hidden className="text-xl">
              📄
            </span>
            {t.articles.title}
          </h2>
        </Reveal>

        <Reveal>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {items.map((item) => (
              <li key={`${item.category}-${item.slug}`} className="h-full">
                <Link
                  href={`/articles/${item.category}/${item.slug}/`}
                  className="group flex h-full flex-col rounded-xl border border-white/12 bg-surface/40 p-5 transition-colors hover:border-brand/30 hover:bg-surface/60"
                >
                  <h3 className="line-clamp-2 shrink-0 text-[15px] font-semibold leading-normal text-foreground transition-colors group-hover:text-brand sm:text-base">
                    {pick(item.title)}
                  </h3>

                  <div className="mt-auto pt-2">
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {item.date ? (
                      <time
                        dateTime={item.date}
                        className="mt-2 block text-xs text-muted"
                      >
                        {item.date}
                      </time>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
