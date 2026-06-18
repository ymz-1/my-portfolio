"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRightIcon, GitHubIcon, WrenchIcon } from "@/components/ui/icons";
import { projects } from "@/content/data";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  visitLabel,
  codeLabel,
  pick,
}: {
  project: (typeof projects)[number];
  visitLabel: string;
  codeLabel: string;
  pick: <T extends { zh: string; en: string }>(value: T) => string;
}) {
  const router = useRouter();

  const cover = (
    <div
      className={cn(
        "relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br",
        project.accent,
      )}
    >
      <div className="absolute inset-0 bg-dots opacity-40" />
      <div className="absolute inset-0 scanlines opacity-30" />
      <span className="absolute left-3 top-3 z-10 bg-background/60 px-2 py-1 font-pixel text-[8px] leading-none text-white/80 pixel-border">
        {project.featured ? "featured" : "tool"}
      </span>
      {project.coverSrc ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverSrc}
            alt={project.title}
            className="max-h-full w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-pixel text-2xl text-white/20">
            {project.title
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
        </div>
      )}
    </div>
  );

  const body = (
    <>
      <h3 className="line-clamp-1 text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
        {pick(project.description)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 text-sm">
        {project.siteUrl && (
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors group-hover:text-brand">
            {visitLabel}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {!project.siteUrl && project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-brand"
          >
            {visitLabel}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        )}
        {project.codeUrl && (
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-foreground"
          >
            <GitHubIcon className="h-4 w-4" />
            {codeLabel}
          </a>
        )}
      </div>
    </>
  );

  if (project.siteUrl) {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(project.siteUrl!)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(project.siteUrl!);
          }
        }}
        className="group flex h-full flex-col cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        <GlowCard tilt className="flex h-full flex-col transition-colors group-hover:border-brand/30">
          {cover}
          {body}
        </GlowCard>
      </div>
    );
  }

  return (
    <GlowCard tilt className="flex h-full flex-col">
      {cover}
      {body}
    </GlowCard>
  );
}

export function Projects() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="projects"
      eyebrow="builds"
      eyebrowIcon={
        <WrenchIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
      }
      title={t.projects.title}
      titleIcon={
        <WrenchIcon className="h-8 w-8 shrink-0 text-brand sm:h-9 sm:w-9" />
      }
    >
      <Stagger className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem key={project.title} className="h-full">
            <ProjectCard
              project={project}
              visitLabel={t.projects.visit}
              codeLabel={t.projects.code}
              pick={pick}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </SectionWrapper>
  );
}
