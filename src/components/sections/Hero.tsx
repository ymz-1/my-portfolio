"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { heroCtas, profile } from "@/content/data";
import { ArrowDownIcon, Icon } from "@/components/ui/icons";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

type FloatItemProps = {
  className: string;
  delay?: number;
  children: React.ReactNode;
};

function FloatItem({ className, delay = 0, children }: FloatItemProps) {
  return (
    <div
      className={`absolute animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function Hero() {
  const { t, pick } = useLanguage();

  return (
    <section
      id="home"
      className="relative grid min-h-screen grid-cols-1 grid-rows-1 overflow-hidden pt-16"
    >
      {/* Background layer (same grid cell, behind content) */}
      <div
        aria-hidden
        className="pointer-events-none col-start-1 row-start-1 min-h-[calc(100svh-4rem)] self-stretch"
      >
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-0 scanlines opacity-40" />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-2/20 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

        {/* 3D scene — client-only decorative background */}
        <div className="absolute inset-0 opacity-35 sm:opacity-50 md:opacity-60">
          <ErrorBoundary>
            <HeroScene />
          </ErrorBoundary>
        </div>
      </div>

      <div className="relative z-10 col-start-1 row-start-1 mx-auto flex w-full max-w-xl flex-col items-center justify-center px-6 py-10">
        {/* Orbit rings + floating items (desktop) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <div className="relative h-[600px] w-[600px]">
            <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-spin-slow" />
            <div className="absolute inset-[70px] rounded-full border border-dashed border-white/[0.09]" />
            <div className="absolute inset-[150px] rounded-full border border-dashed border-white/[0.06]" />

            <FloatItem className="left-[6%] top-[40%]" delay={0}>
              <span className="pixel-border grid h-10 w-10 place-items-center bg-surface/80 text-brand">
                <Icon name="github" className="h-5 w-5" />
              </span>
            </FloatItem>
            <FloatItem className="right-[8%] top-[30%]" delay={1.2}>
              <span className="pixel-border grid h-10 w-10 place-items-center bg-surface/80 text-accent">
                <Icon name="wechat" className="h-5 w-5" />
              </span>
            </FloatItem>
            <FloatItem className="right-[16%] bottom-[16%]" delay={0.6}>
              <span className="block h-5 w-5 rotate-12 bg-gradient-to-br from-brand to-brand-2 pixel-border" />
            </FloatItem>
            <FloatItem className="left-[16%] bottom-[14%]" delay={1.8}>
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
              </span>
            </FloatItem>
            <FloatItem className="left-[34%] top-[4%]" delay={0.9}>
              <span className="block h-3 w-3 rounded-full bg-brand" />
            </FloatItem>
          </div>
        </div>

        {/* Name card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative z-10 w-full max-w-md rounded-2xl p-8 text-center shadow-2xl shadow-black/40 sm:p-10"
        >
          {/* Avatar overlapping the corner */}
          <div className="pixel-border absolute -left-5 -top-6 h-16 w-16 overflow-hidden bg-gradient-to-br from-brand to-brand-2">
            <Image
              src={profile.avatarSrc}
              alt={pick(profile.nameLocalized)}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <h1 className="text-balance text-2xl font-bold tracking-[0.06em] sm:text-3xl">
            <span className="text-gradient">{pick(profile.heroTitle)}</span>
          </h1>

          {/* Identity / headline */}
          <p className="mt-4 text-pretty text-base font-medium text-foreground/90 sm:text-lg">
            {pick(profile.headline)}
          </p>

          <p className="mt-5 text-pretty text-sm text-muted">
            {pick(profile.heroGreeting)}
          </p>

          {/* Quote */}
          <p className="mx-auto mt-3 max-w-sm text-pretty text-sm italic leading-relaxed text-muted">
            “{pick(profile.quote)}”
          </p>

          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Experience summary */}
          <p className="font-mono text-xs text-muted sm:text-sm">
            {pick(profile.experienceSummary)}
          </p>

          {/* CTAs: GitHub / 公众号 / Email */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {heroCtas.map((cta, i) => {
              const isPrimary = i === 0;
              return (
                <a
                  key={pick(cta.label)}
                  href={cta.url}
                  {...(cta.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={
                    isPrimary
                      ? "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.04]"
                      : "group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand/50 hover:bg-white/10"
                  }
                >
                  <Icon name={cta.icon} className="h-4 w-4" />
                  {pick(cta.label)}
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Scroll hint (mobile) */}
        <motion.a
          href="#projects"
          aria-label={t.hero.scroll}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 mt-3 flex flex-col items-center gap-2 text-xs text-muted sm:hidden"
        >
          {t.hero.scroll}
          <ArrowDownIcon className="h-4 w-4 animate-bounce" />
        </motion.a>
      </div>

      {/* Scroll hint (desktop) */}
      <motion.a
        href="#projects"
        aria-label={t.hero.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted sm:flex"
      >
        {t.hero.scroll}
        <ArrowDownIcon className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}
