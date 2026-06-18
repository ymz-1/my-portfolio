"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Icon, ArrowUpRightIcon } from "@/components/ui/icons";
import { socialCards } from "@/content/data";

export function SocialCards() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="social"
      eyebrow="// channels"
      title={t.social.title}
      subtitle={t.social.subtitle}
    >
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {socialCards.map((card, i) => (
          <StaggerItem key={i}>
            <GlowCard
              as="a"
              tilt
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="pixel-border grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-brand">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight">
                    {pick(card.handle)}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {pick(card.platform)}
                  </p>
                </div>
                <ArrowUpRightIcon className="ml-auto h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-brand" />
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {card.stats.map((s) => (
                  <div key={pick(s.label)}>
                    <div className="font-pixel text-sm text-gradient">
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted">
                      {pick(s.label)}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                {pick(card.description)}
              </p>
            </GlowCard>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionWrapper>
  );
}
