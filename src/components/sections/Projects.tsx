"use client";

import { ProjectsGrid, ProjectsSectionHeader } from "@/components/projects/ProjectsGrid";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-20 flex-col justify-center py-10 sm:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <ProjectsSectionHeader />
        <ProjectsGrid />
      </div>
    </section>
  );
}
