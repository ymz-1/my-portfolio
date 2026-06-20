"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { skillGroups } from "@/content/data";

const techPills = [
  "C++",
  "MFC",
  "Win32",
  "STL",
  "multithreading",
  "Lua",
  "UGC tooling",
  "Python",
  "automation",
  "Git",
  "AI-assisted dev",
  "Next.js",
  "Three.js",
  "devlog",
];

export function TechStack() {
  const { t, pick } = useLanguage();

  return (
    <section id="stack" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span aria-hidden className="text-xl">
              ⚙️
            </span>
            {t.stack.title}
          </h2>
        </div>

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
      </div>
    </section>
  );
}
