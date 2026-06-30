"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  GitHubIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import type { ProjectDetail } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  project: ProjectDetail;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 3l14 9-14 9V3Z" />
    </svg>
  );
}

export function ProjectDetailView({ project }: Props) {
  const { t, pick } = useLanguage();
  const featureTags = project.featureTags ?? project.tags;
  const hasArchitecture =
    pick(project.architecture.overview) !== "—" &&
    pick(project.architecture.overview) !== "Details coming soon." &&
    pick(project.architecture.overview) !== "详情整理中。";

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
      {/* Header */}
      <header className="mb-8">
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
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted"
            >
              {tag}
            </span>
          ))}
          {project.license && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted">
              {project.license}
            </span>
          )}
          {project.author && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              {pick(project.author)}
            </span>
          )}
        </div>

        {project.placeholder && (
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200/90">
            {t.projectDetail.placeholder}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              <GitHubIcon className="h-4 w-4" />
              {t.projectDetail.viewSource}
            </a>
          )}
          <Link
            href="/projects"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand/40 hover:bg-white/10"
          >
            {t.projectDetail.viewProjects}
          </Link>
        </div>
      </header>

      {/* Overview */}
      <GlowCard className="mb-6 !p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <WrenchIcon className="h-5 w-5 text-brand" />
            {t.projectDetail.intro}
          </h2>
        </div>
        <div className="px-5 py-5">
          <p className="whitespace-pre-line leading-relaxed text-muted">
            {pick(project.intro)}
          </p>
          {featureTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {featureTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </GlowCard>

      {project.techStack.length > 0 && (
        <GlowCard className="mb-6 !p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-semibold">{t.projectDetail.techStack}</h2>
          </div>
          <ul className="divide-y divide-white/10">
            {project.techStack.map((item) => (
              <li
                key={item.name}
                className="flex items-start justify-between gap-4 px-5 py-4"
              >
                <span className="font-medium">{item.name}</span>
                {item.role ? (
                  <span className="text-right text-sm text-muted">{pick(item.role)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </GlowCard>
      )}

      {hasArchitecture && (
        <GlowCard className="mb-6 !p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-semibold">{t.projectDetail.architecture}</h2>
          </div>
          <div className="space-y-5 px-5 py-5">
            {project.architecture.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.architecture.imageSrc}
                alt=""
                className="w-full rounded-xl border border-white/10"
              />
            ) : null}
            <p className="leading-relaxed text-muted">{pick(project.architecture.overview)}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-brand">{t.projectDetail.frontend}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pick(project.architecture.frontend)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-brand">{t.projectDetail.backend}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pick(project.architecture.backend)}
                </p>
              </div>
            </div>
          </div>
        </GlowCard>
      )}

      {project.media.length > 0 && (
        <GlowCard className="mb-6 !p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-semibold">{t.projectDetail.gallery}</h2>
          </div>
          <div className="space-y-6 p-5">
            {project.media.map((item) => (
              <figure key={item.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={pick(item.alt)}
                  className="w-full rounded-xl border border-white/10"
                />
                {item.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-muted">
                    {pick(item.caption)}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </GlowCard>
      )}

      {/* Performance & challenges */}
      {project.highlights.length > 0 && (
        <GlowCard className="mb-6 !p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <StarIcon className="h-5 w-5 text-brand" />
              {t.projectDetail.highlights}
            </h2>
          </div>
          <ul>
            {project.highlights.map((item, index) => (
              <li
                key={pick(item.title)}
                className={cn(
                  "flex gap-4 px-5 py-5",
                  index < project.highlights.length - 1 &&
                    "border-b border-white/10",
                )}
              >
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <h3 className="font-semibold">{pick(item.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {pick(item.content)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </GlowCard>
      )}

      {/* Quick start */}
      {project.quickStart && (
        <GlowCard className="!p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <PlayIcon className="h-5 w-5 text-brand" />
              {t.projectDetail.quickStart}
            </h2>
          </div>
          <div className="p-5">
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-sm leading-7 text-foreground/90 whitespace-pre-wrap">
              {pick(project.quickStart)}
            </pre>
          </div>
        </GlowCard>
      )}
    </article>
  );
}
