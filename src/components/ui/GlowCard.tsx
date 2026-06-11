"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "a";
  href?: string;
  target?: string;
  rel?: string;
  /** Enable subtle cursor-driven 3D tilt */
  tilt?: boolean;
};

/**
 * Card that renders a soft radial glow following the cursor, with an optional
 * subtle 3D tilt. Inspired by Aceternity / cult-ui hover cards.
 */
export function GlowCard({
  children,
  className,
  as = "div",
  href,
  target,
  rel,
  tilt = false,
}: GlowCardProps) {
  const ref = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    if (tilt) {
      const rx = (0.5 - y / rect.height) * 8;
      const ry = (x / rect.width - 0.5) * 8;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (el && tilt) {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    }
  }

  const classes = cn(
    "group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-6 transition-colors duration-300 hover:border-white/20",
    tilt && "transition-transform duration-200 ease-out will-change-transform",
    className,
  );

  const glow = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(420px circle at var(--mx) var(--my), rgba(167,139,250,0.14), transparent 45%)",
      }}
    />
  );

  if (as === "a") {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={classes}
      >
        {glow}
        {children}
      </a>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={classes}
    >
      {glow}
      {children}
    </div>
  );
}
