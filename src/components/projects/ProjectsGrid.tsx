"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { WrenchIcon } from "@/components/ui/icons";
import { ProjectCardView } from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects";

export function ProjectsGrid() {
  const { t } = useLanguage();

  return (
    <Stagger className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <StaggerItem key={project.slug} className="h-full">
          <ProjectCardView
            project={project}
            visitLabel={t.projects.visit}
            codeLabel={t.projects.code}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function ProjectsSectionHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-5 border-b border-white/10 pb-6 sm:mb-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
        <WrenchIcon className="h-7 w-7 shrink-0 text-brand" />
        {t.projects.title}
      </h2>
    </div>
  );
}
