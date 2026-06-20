"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { articles } from "@/content/data";
import { cn } from "@/lib/utils";

export function ArticleList() {
  const { t, pick } = useLanguage();

  return (
    <section id="articles" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span aria-hidden className="text-xl">
                🔥
              </span>
              {t.articles.title}
            </h2>
            <p className="text-sm text-muted">{t.articles.note}</p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => {
            const rankText = String(article.rank).padStart(2, "0");
            const content = (
              <>
                <span
                  className={cn(
                    "shrink-0 font-mono text-2xl font-bold tabular-nums sm:text-[1.65rem]",
                    article.highlight ? "text-amber-400" : "text-white/25",
                  )}
                >
                  {rankText}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground sm:text-base">
                    {pick(article.title)}
                  </h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs sm:text-[13px]">
                    <span>
                      {t.articles.readLabel}{" "}
                      <span className="font-medium text-sky-400">
                        {article.readCount}
                      </span>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-muted">
                      {pick(article.metricLabel)}{" "}
                      <span className="text-foreground/80">
                        {article.metricValue}
                      </span>
                    </span>
                  </p>
                </div>
              </>
            );

            const cardClass =
              "flex items-start gap-4 rounded-xl border border-white/10 bg-surface/50 p-4 transition-colors hover:border-white/20 hover:bg-surface/70";

            return (
              <StaggerItem key={article.rank}>
                {article.url ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
