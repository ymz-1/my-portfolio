"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/ui/icons";
import { projects } from "@/content/data";
import { cn } from "@/lib/utils";

export function Projects() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="projects"
      eyebrow="// builds"
      title={t.projects.title}
      subtitle={t.projects.subtitle}
    >
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem
            key={project.title}
            className={cn(project.featured && "sm:col-span-2 lg:row-span-1")}
          >
            <GlowCard tilt className="flex h-full flex-col">
              <div
                className={cn(
                  "relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br",
                  project.accent,
                )}
              >
                <div className="absolute inset-0 bg-dots opacity-40" />
                <div className="absolute inset-0 scanlines opacity-30" />
                <span className="absolute left-3 top-3 bg-background/60 px-2 py-1 font-pixel text-[8px] leading-none text-white/80 pixel-border">
                  {project.featured ? "featured" : "build"}
                </span>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-pixel text-2xl text-white/20">
                    {project.title
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">
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
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-brand"
                  >
                    {t.projects.visit}
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <GitHubIcon className="h-4 w-4" />
                    {t.projects.code}
                  </a>
                )}
              </div>
            </GlowCard>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionWrapper>
  );
}
