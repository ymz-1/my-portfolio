"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Reveal } from "@/components/ui/Reveal";
import { experiences } from "@/content/data";

export function Experience() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="experience"
      eyebrow="// timeline"
      title={t.experience.title}
      subtitle={t.experience.subtitle}
    >
      <div className="relative">
        {/* timeline line */}
        <div
          aria-hidden
          className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-brand via-white/15 to-transparent sm:left-[9px]"
        />

        <ol className="space-y-10">
          {experiences.map((item, i) => (
            <li key={item.company} className="relative pl-10 sm:pl-14">
              <Reveal delay={i * 0.08}>
                <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-brand sm:h-5 sm:w-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                </span>

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold">
                    {pick(item.role)}
                    <span className="text-muted"> @ {item.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-brand">
                    {item.period}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted">{pick(item.description)}</p>

                <ul className="mt-3 space-y-1.5">
                  {item.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
                      {pick(h)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}
