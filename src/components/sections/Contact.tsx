"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { contactCard } from "@/content/data";
import { cn } from "@/lib/utils";

export function Contact() {
  const { pick } = useLanguage();

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6">
        <Reveal>
          <GlowCard className="p-8 sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
              {/* 左侧：公众号二维码 */}
              <div className="flex shrink-0 flex-col items-center md:w-[11rem]">
                <div
                  className={cn(
                    "grid aspect-square w-36 place-items-center rounded-xl sm:w-40",
                    contactCard.qrSrc
                      ? "bg-white p-1 shadow-lg shadow-black/20"
                      : "border border-dashed border-white/15 bg-white/[0.04]",
                  )}
                >
                  {contactCard.qrSrc ? (
                    <Image
                      src={contactCard.qrSrc}
                      alt={pick(contactCard.qrCaption)}
                      width={160}
                      height={160}
                      className="h-full w-full rounded-[10px] object-cover"
                    />
                  ) : (
                    <span className="select-none font-mono text-xs text-white/20">
                      QR
                    </span>
                  )}
                </div>
                <p className="mt-3 text-center text-sm text-muted">
                  {pick(contactCard.qrCaption)}
                </p>
              </div>

              {/* 右侧：介绍文案 */}
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                  {pick(contactCard.title)}
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
                  <p className="text-foreground/90">{pick(contactCard.greeting)}</p>
                  <p>{pick(contactCard.intro)}</p>

                  <div>
                    <p className="font-medium text-foreground">
                      {pick(contactCard.backgroundLabel)}
                    </p>
                    <ul className="mt-1 list-none space-y-0.5 pl-0">
                      {contactCard.backgroundItems.map((item) => (
                        <li key={pick(item)} className="flex gap-2">
                          <span aria-hidden className="text-brand/60">
                            -
                          </span>
                          <span>{pick(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      {pick(contactCard.nowLabel)}
                    </p>
                    <p className="mt-1">{pick(contactCard.nowText)}</p>
                  </div>
                </div>

                <hr className="my-6 border-white/10" />

                <p className="text-[15px] font-medium text-brand">
                  {pick(contactCard.footer)}
                </p>
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
