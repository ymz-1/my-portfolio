import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type SectionWrapperProps = {
  id: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function SectionWrapper({
  id,
  title,
  subtitle,
  eyebrow,
  children,
  className,
  containerClassName,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-20 py-24 sm:py-32", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6", containerClassName)}>
        {(title || subtitle) && (
          <Reveal className="mb-14 max-w-2xl">
            {eyebrow && (
              <span className="mb-4 inline-block font-pixel text-[10px] leading-none text-brand">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base text-muted sm:text-lg">{subtitle}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
