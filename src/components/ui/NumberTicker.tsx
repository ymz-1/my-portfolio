"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type NumberTickerProps = {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
};

export function NumberTicker({
  value,
  duration = 1.6,
  className,
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / ms, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
