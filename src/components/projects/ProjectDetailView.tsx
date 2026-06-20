"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { ArrowUpRightIcon, GitHubIcon, WrenchIcon } from "@/components/ui/icons";
import type { ProjectDetail } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  project: ProjectDetail;
};

export function ProjectDetailView({ project }: Props) {
  const { t, pick } = useLanguage();
  const demoHref = project.demoUrl ?? project.liveUrl;
  const isExternalDemo = !project.demoUrl && !!project.liveUrl;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {t.projectDetail.back}
      </Link>

      {/* Hero */}
      <header className="mb-10">
        <div
          className={cn(
            "relative mb-6 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br sm:aspect-[5/2]",
            project.accent,
          )}
        >
          <div className="absolute inset-0 bg-dots opacity-40" />
          {project.coverSrc ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverSrc}
                alt={project.title}
                className="max-h-full w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              />
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-pixel text-3xl text-white/25 sm:text-4xl">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {pick(project.description)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.placeholder && (
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200/90">
            {t.projectDetail.placeholder}
          </p>
        )}
      </header>

      {/* Intro */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <WrenchIcon className="h-5 w-5 text-brand" />
          {t.projectDetail.intro}
        </h2>
        <p className="leading-relaxed text-muted">{pick(project.intro)}</p>
      </section>

      {/* Tech stack */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t.projectDetail.techStack}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {project.techStack.map((item) => (
            <GlowCard key={item.name} className="!p-4">
              <p className="font-mono text-sm font-medium">{item.name}</p>
              {item.role && (
                <p className="mt-1 text-xs text-muted">{pick(item.role)}</p>
              )}
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t.projectDetail.architecture}</h2>
        <p className="mb-6 leading-relaxed text-muted">
          {pick(project.architecture.overview)}
        </p>
        {project.architecture.imageSrc && (
          <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.architecture.imageSrc}
              alt={t.projectDetail.architecture}
              className="w-full"
            />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <GlowCard className="!p-4">
            <h3 className="mb-2 text-sm font-semibold text-brand">
              {t.projectDetail.frontend}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {pick(project.architecture.frontend)}
            </p>
          </GlowCard>
          <GlowCard className="!p-4">
            <h3 className="mb-2 text-sm font-semibold text-brand">
              {t.projectDetail.backend}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {pick(project.architecture.backend)}
            </p>
          </GlowCard>
        </div>
      </section>

      {/* Gallery */}
      {project.media.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{t.projectDetail.gallery}</h2>
          <div className="grid gap-4">
            {project.media.map((item) => (
              <figure
                key={item.src}
                className="overflow-hidden rounded-xl border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={pick(item.alt)}
                  className="w-full object-cover"
                />
                {item.caption && (
                  <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-muted">
                    {pick(item.caption)}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">{t.projectDetail.highlights}</h2>
          <div className="space-y-4">
            {project.highlights.map((item) => (
              <GlowCard key={pick(item.title)} className="!p-5">
                <h3 className="font-semibold">{pick(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pick(item.content)}
                </p>
              </GlowCard>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row">
        {demoHref &&
          (isExternalDemo ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {t.projectDetail.liveDemo}
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href={project.demoUrl!}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {t.projectDetail.liveDemo}
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          ))}
        {project.codeUrl && (
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand/40 hover:bg-white/10"
          >
            <GitHubIcon className="h-4 w-4" />
            {t.projectDetail.viewSource}
          </a>
        )}
      </div>
    </article>
  );
}
