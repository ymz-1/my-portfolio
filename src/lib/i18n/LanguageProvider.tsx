"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type Dictionary } from "./dictionaries/en";
import { zh } from "./dictionaries/zh";

export type Locale = "zh" | "en";

export type Localized = { zh: string; en: string };

const dictionaries: Record<Locale, Dictionary> = { en, zh };

type LanguageContextValue = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggle: () => void;
  t: Dictionary;
  pick: (value: Localized) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "preferred-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>("zh");

  useEffect(() => {
    // Read persisted / browser preference after mount to avoid hydration
    // mismatch. Runs once on mount by design.
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    const next: Locale =
      stored === "zh" || stored === "en"
        ? stored
        : navigator.language.toLowerCase().startsWith("zh")
          ? "zh"
          : "en";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: dictionaries[lang],
      pick: (v: Localized) => v[lang],
    }),
    [lang, setLang, toggle],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
