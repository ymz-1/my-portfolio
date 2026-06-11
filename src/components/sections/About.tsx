"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { counters, profile, socials } from "@/content/data";

export function About() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="about"
      eyebrow="// whoami"
      title={t.about.title}
      subtitle={t.about.subtitle}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="pixel-border relative grid h-16 w-16 shrink-0 place-items-center bg-gradient-to-br from-brand to-brand-2 font-pixel text-sm text-background">
              {profile.avatarInitials}
            </div>
            <div>
              <p className="text-xl font-semibold">
                {pick(profile.nameLocalized)}
              </p>
              <p className="text-sm text-muted">{pick(profile.location)}</p>
            </div>
          </div>

          {profile.about.map((para, i) => (
            <p key={i} className="text-pretty leading-relaxed text-muted">
              {pick(para)}
            </p>
          ))}

          <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            {counters.map((c) => (
              <div key={pick(c.label)}>
                <div className="font-pixel text-base text-gradient sm:text-lg">
                  <NumberTicker value={c.value} suffix={c.suffix} />
                </div>
                <div className="mt-2 text-xs text-muted">{pick(c.label)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {socials.map((s) => (
            <StaggerItem key={s.platform}>
              <GlowCard
                as="a"
                tilt
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{s.platform}</p>
                    <p className="text-xs text-muted">{s.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-brand">
                      {s.metricValue}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      {pick(s.metricLabel)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{pick(s.description)}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionWrapper>
  );
}
