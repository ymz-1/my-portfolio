"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { contactLinks, profile } from "@/content/data";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <Reveal>
          <span className="mb-4 inline-block font-pixel text-[10px] leading-none text-brand">
            {"// say-hi"}
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted sm:text-lg">
            {t.contact.subtitle}
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-8 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            <Icon name="mail" className="h-4 w-4" />
            {t.contact.cta}
          </a>

          <p className="mt-4 font-mono text-sm text-muted">{profile.email}</p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-muted transition-colors hover:border-brand/50 hover:text-brand"
              >
                <Icon name={link.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
