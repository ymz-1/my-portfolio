"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/ui/icons";
import type { ProjectCard } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  project: ProjectCard;
  visitLabel: string;
  codeLabel: string;
};

export function ProjectCardView({ project, visitLabel, codeLabel }: Props) {
  const router = useRouter();
  const { pick } = useLanguage();

  const cover = (
    <div
      className={cn(
        "relative mb-3 aspect-[2/1] w-full overflow-hidden rounded-lg bg-gradient-to-br sm:aspect-[5/2]",
        project.accent,
      )}
    >
      <div className="absolute inset-0 bg-dots opacity-40" />
      <div className="absolute inset-0 scanlines opacity-30" />
      <span className="absolute left-2 top-2 z-10 bg-background/60 px-1.5 py-0.5 font-pixel text-[7px] leading-none text-white/80 pixel-border">
        {project.featured ? "featured" : "tool"}
      </span>
      {project.coverSrc ? (
        <div className="absolute inset-0 flex items-center justify-center p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverSrc}
            alt={project.title}
            className={cn(
              "drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105",
              project.coverFit === "cover"
                ? "h-full w-full object-cover"
                : "max-h-full w-auto object-contain",
            )}
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-pixel text-lg text-white/20 sm:text-xl">
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
      <h3 className="line-clamp-1 text-base font-semibold">{project.title}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
        {pick(project.description)}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        {project.demoUrl && (
          <Link
            href={project.demoUrl}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-brand"
          >
            {visitLabel}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        )}
        {!project.demoUrl && project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
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

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/projects/${project.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.slug}`);
        }
      }}
      className="group flex h-full flex-col cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      <GlowCard tilt className="flex h-full flex-col !p-4 transition-colors group-hover:border-brand/30">
        {cover}
        {body}
      </GlowCard>
    </div>
  );
}
