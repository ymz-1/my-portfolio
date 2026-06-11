"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { contactLinks, profile } from "@/content/data";
import { Icon } from "@/components/ui/icons";

export function Footer() {
  const { t, pick } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{pick(profile.nameLocalized)}</p>
          <p className="mt-1 text-sm text-muted">
            © {year} {pick(profile.nameLocalized)}. {t.footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-muted transition-colors hover:border-brand/50 hover:text-brand"
            >
              <Icon name={link.icon} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted/70">
        {t.footer.builtWith}
      </p>
    </footer>
  );
}
