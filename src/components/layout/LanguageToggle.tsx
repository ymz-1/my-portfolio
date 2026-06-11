"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Language switcher"
    >
      {(["zh", "en"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 rounded-full px-3 py-1 transition-colors",
              active ? "text-background" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand to-brand-2" />
            )}
            {code === "zh" ? "中" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
