"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { ArticleCategory, ArticleDetail } from "@/content/articles";
import { extractHeadings } from "@/lib/articles/headings";
import { recordArticleView } from "@/lib/articles/views";
import { cn } from "@/lib/utils";
import { ArticleMarkdown } from "./ArticleMarkdown";

type Props = {
  category: ArticleCategory;
  article: ArticleDetail;
};

const SCROLL_OFFSET = 80;
const SCROLL_SPY_MARKER = SCROLL_OFFSET + 8;
const NAVIGATION_UNLOCK_MS = 600;

function scrollToElement(el: HTMLElement) {
  const top = window.scrollY + el.getBoundingClientRect().top - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function formatArticleDate(date?: string): string {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toISOString().slice(0, 10);
}

function TableOfContents({
  headings,
  activeId,
  onNavigate,
}: {
  headings: ReturnType<typeof extractHeadings>;
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  if (headings.length === 0) return null;

  return (
    <nav className="mt-4 border-t border-white/10 pt-4">
      <ul className="flex max-h-[calc(100svh-12rem)] flex-col gap-0.5 overflow-y-auto pr-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(heading.id);
              }}
              className={cn(
                "block rounded-lg py-2 text-sm leading-snug transition-colors",
                heading.level === 1 && "pl-0",
                heading.level === 2 && "pl-3",
                heading.level === 3 && "pl-6",
                activeId === heading.id
                  ? "bg-brand/15 font-medium text-brand"
                  : "text-muted hover:bg-white/5 hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ArticleReader({ category, article }: Props) {
  const { t, pick } = useLanguage();
  const body = pick(article.body);
  const headings = useMemo(() => extractHeadings(body), [body]);
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const isNavigatingRef = useRef(false);
  const navigationUnlockTimerRef = useRef<number | null>(null);

  const categoryLabel =
    category === "stories" ? t.articles.stories : t.articles.notes;

  function unlockNavigation() {
    isNavigatingRef.current = false;
    if (navigationUnlockTimerRef.current !== null) {
      window.clearTimeout(navigationUnlockTimerRef.current);
      navigationUnlockTimerRef.current = null;
    }
  }

  function lockNavigation() {
    isNavigatingRef.current = true;
    if (navigationUnlockTimerRef.current !== null) {
      window.clearTimeout(navigationUnlockTimerRef.current);
    }

    const unlock = () => {
      unlockNavigation();
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", unlock, { once: true });
    }
    navigationUnlockTimerRef.current = window.setTimeout(unlock, NAVIGATION_UNLOCK_MS);
  }

  useEffect(() => {
    const sessionKey = `article-view:${category}/${article.slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    void recordArticleView(category, article.slug).then(() => {
      sessionStorage.setItem(sessionKey, "1");
    });
  }, [category, article.slug]);

  useEffect(() => {
    if (headings.length === 0) return;

    function syncActiveHeading() {
      if (isNavigatingRef.current) return;

      let current = headings[0]?.id ?? null;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= SCROLL_SPY_MARKER) {
          current = heading.id;
        }
      }
      setActiveId(current);
    }

    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      lockNavigation();
      setActiveId(hash);
      requestAnimationFrame(() => {
        const target = document.getElementById(hash);
        if (target) scrollToElement(target);
      });
    } else {
      syncActiveHeading();
    }

    window.addEventListener("scroll", syncActiveHeading, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncActiveHeading);
      unlockNavigation();
    };
  }, [headings]);

  function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    lockNavigation();
    setActiveId(id);
    scrollToElement(el);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-0 px-4 py-8 sm:px-6 lg:flex-row lg:gap-0 lg:py-10">
      <aside className="mb-6 shrink-0 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[calc(100svh-6rem)] lg:w-64 lg:self-start lg:border-r lg:border-white/10 lg:pr-6 xl:w-72">
        <Link
          href="/#articles"
          className="mb-4 inline-flex text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {t.articles.backHome}
        </Link>

        <p className="text-sm font-semibold text-foreground">{pick(article.title)}</p>

        <TableOfContents
          headings={headings}
          activeId={activeId}
          onNavigate={scrollToHeading}
        />
      </aside>

      <article className="min-w-0 flex-1 lg:pl-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="font-mono text-xs text-muted">
            {categoryLabel}
            {article.date ? ` · ${formatArticleDate(article.date)}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {pick(article.title)}
          </h1>
        </header>

        <ArticleMarkdown content={body} />
      </article>
    </div>
  );
}
