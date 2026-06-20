import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type SectionWrapperProps = {
  id: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  titleIcon?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
};

export function SectionWrapper({
  id,
  title,
  subtitle,
  eyebrow,
  eyebrowIcon,
  titleIcon,
  children,
  className,
  containerClassName,
  headerClassName,
  titleClassName,
}: SectionWrapperProps) {
  const showHeader = title || subtitle || eyebrow;

  return (
    <section
      id={id}
      className={cn("relative scroll-mt-20 py-24 sm:py-32", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6", containerClassName)}>
        {showHeader && (
          <Reveal className={cn("mb-14 max-w-2xl", headerClassName)}>
            {eyebrow && (
              <span className="mb-4 inline-flex items-center gap-2 font-pixel text-[10px] leading-none text-brand">
                {eyebrowIcon}
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                className={cn(
                  "flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl",
                  titleClassName,
                )}
              >
                {titleIcon}
                <span>{title}</span>
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
