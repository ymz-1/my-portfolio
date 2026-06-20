"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRightIcon, WrenchIcon } from "@/components/ui/icons";
import { gadgetItems } from "@/content/data";
import { cn } from "@/lib/utils";

function GadgetCard({
  item,
  pick,
  useLabel,
}: {
  item: (typeof gadgetItems)[number];
  pick: <T extends { zh: string; en: string }>(value: T) => string;
  useLabel: string;
}) {
  const router = useRouter();
  const href = item.siteUrl ?? item.liveUrl;

  const body = (
    <GlowCard
      tilt
      className={cn(
        "flex h-full flex-col transition-colors",
        href && "group-hover:border-brand/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">
          {pick(item.title)}
        </h3>
        <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted">
          {pick(item.badge)}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {pick(item.description)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={pick(tag)}
            className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] text-brand"
          >
            {pick(tag)}
          </span>
        ))}
      </div>
      {href && (
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
          {useLabel}
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </div>
      )}
    </GlowCard>
  );

  if (!href) {
    return body;
  }

  if (item.siteUrl) {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(item.siteUrl!)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(item.siteUrl!);
          }
        }}
        className="group h-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        {body}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      {body}
    </a>
  );
}

export function GadgetHub() {
  const { t, pick } = useLanguage();

  return (
    <section id="social" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <WrenchIcon className="h-7 w-7 shrink-0 text-brand" />
              {t.gadgets.title}
            </h2>
            <p className="text-sm text-muted">{t.gadgets.note}</p>
          </div>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gadgetItems.map((item) => (
            <StaggerItem key={pick(item.title)} className="h-full">
              <GadgetCard
                item={item}
                pick={pick}
                useLabel={t.projects.visit}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
