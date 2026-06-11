"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ArrowDownIcon } from "@/components/ui/icons";

export function BackToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label={t.common.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-surface/80 text-foreground backdrop-blur-xl transition-colors hover:border-brand/50 hover:text-brand"
        >
          <ArrowDownIcon className="h-5 w-5 rotate-180" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
