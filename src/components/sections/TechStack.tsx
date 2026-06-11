"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlowCard } from "@/components/ui/GlowCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { skillGroups } from "@/content/data";

const techPills = [
  "indie dev",
  "devlog",
  "game jam",
  "TypeScript",
  "React",
  "Three.js",
  "pixel art",
  "Godot",
  "shaders",
  "lo-fi",
  "Rust",
  "creative coding",
  "Figma",
  "side projects",
];

export function TechStack() {
  const { t, pick } = useLanguage();

  return (
    <SectionWrapper
      id="stack"
      eyebrow="// toolbox"
      title={t.stack.title}
      subtitle={t.stack.subtitle}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal key={pick(group.title)} delay={gi * 0.1}>
            <GlowCard className="h-full">
              <h3 className="mb-6 text-lg font-semibold">{pick(group.title)}</h3>
              <div className="space-y-5">
                {group.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={si * 0.08}
                  />
                ))}
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee>
          {techPills.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-muted"
            >
              {tech}
            </span>
          ))}
        </Marquee>
      </div>
    </SectionWrapper>
  );
}
