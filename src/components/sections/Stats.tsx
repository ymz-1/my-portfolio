"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { interests, timeAllocation } from "@/content/data";

function DonutChart() {
  const { pick } = useLanguage();
  const total = timeAllocation.reduce((acc, s) => acc + s.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const segments = timeAllocation.map((slice, i) => {
    const prior = timeAllocation
      .slice(0, i)
      .reduce((acc, s) => acc + s.value, 0);
    return {
      slice,
      dash: (slice.value / total) * circumference,
      offset: (prior / total) * circumference,
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="18"
          />
          {segments.map(({ slice, dash, offset }) => (
            <motion.circle
              key={pick(slice.label)}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-bold text-gradient">100%</span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-1">
        {timeAllocation.map((slice) => (
          <li key={pick(slice.label)} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-muted">{pick(slice.label)}</span>
            <span className="ml-auto font-mono text-xs text-foreground">
              {slice.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InterestBars() {
  const { pick } = useLanguage();
  return (
    <div className="space-y-4">
      {interests.map((item, i) => (
        <div key={pick(item.label)}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-muted">{pick(item.label)}</span>
            <span className="font-mono text-xs text-foreground">
              {item.value}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent via-brand to-brand-2"
              initial={{ width: 0 }}
              whileInView={{ width: `${item.value}%` }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 1,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Stats() {
  const { t } = useLanguage();

  return (
    <SectionWrapper
      id="stats"
      eyebrow="// logs"
      title={t.stats.title}
      subtitle={t.stats.subtitle}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <GlowCard className="h-full">
            <h3 className="mb-6 text-lg font-semibold">{t.stats.timeTitle}</h3>
            <DonutChart />
          </GlowCard>
        </Reveal>
        <Reveal delay={0.1}>
          <GlowCard className="h-full">
            <h3 className="mb-6 text-lg font-semibold">
              {t.stats.interestsTitle}
            </h3>
            <InterestBars />
          </GlowCard>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
