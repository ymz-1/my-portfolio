"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { contactCard } from "@/content/data";
import { cn } from "@/lib/utils";

type SubscribeStatus =
  | "idle"
  | "loading"
  | "success"
  | "pending"
  | "duplicate"
  | "invalid"
  | "rate_limit"
  | "not_configured"
  | "error";

type SubscribeResponse =
  | { ok: true; status: "subscribed" | "pending_confirmation" }
  | { error: string };

export function Contact() {
  const { t, pick } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const data = (await res.json()) as SubscribeResponse;

      if (res.ok && "ok" in data && data.ok) {
        setStatus(data.status === "pending_confirmation" ? "pending" : "success");
        setEmail("");
        return;
      }

      const err = "error" in data ? data.error : "upstream_error";
      switch (err) {
        case "invalid_email":
          setStatus("invalid");
          break;
        case "duplicate":
          setStatus("duplicate");
          break;
        case "rate_limit":
          setStatus("rate_limit");
          break;
        case "not_configured":
          setStatus("not_configured");
          break;
        default:
          setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const feedback =
    status === "success"
      ? t.contact.subscribeSuccess
      : status === "pending"
        ? t.contact.subscribePending
        : status === "duplicate"
          ? t.contact.subscribeDuplicate
          : status === "invalid"
            ? t.contact.subscribeInvalid
            : status === "rate_limit"
              ? t.contact.subscribeRateLimit
              : status === "not_configured"
                ? t.contact.subscribeNotConfigured
                : status === "error"
                  ? t.contact.subscribeError
                  : null;

  const feedbackIsError =
    status === "invalid" ||
    status === "duplicate" ||
    status === "rate_limit" ||
    status === "not_configured" ||
    status === "error";

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6">
        <Reveal>
          <GlowCard className="p-8 sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
              <div className="mx-auto w-full max-w-xs shrink-0 md:mx-0 md:w-52">
                <p className="text-sm font-medium text-foreground">
                  {t.contact.subscribeLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {t.contact.subscribeHint}
                </p>

                <form onSubmit={handleSubscribe} className="mt-4 space-y-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== "idle" && status !== "loading") setStatus("idle");
                    }}
                    placeholder={t.contact.subscribePlaceholder}
                    autoComplete="email"
                    disabled={status === "loading"}
                    className={cn(
                      "w-full rounded-lg border bg-white/[0.04] px-3 py-2.5 text-sm text-foreground outline-none transition-colors",
                      "placeholder:text-muted/70",
                      "focus:border-brand/40 focus:ring-2 focus:ring-brand/20",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      status === "invalid"
                        ? "border-red-400/50"
                        : "border-white/12",
                    )}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading"
                      ? t.contact.subscribing
                      : t.contact.subscribeButton}
                  </button>
                </form>

                {feedback ? (
                  <p
                    className={cn(
                      "mt-3 text-xs leading-relaxed",
                      feedbackIsError ? "text-red-400/90" : "text-brand",
                    )}
                    role="status"
                  >
                    {feedback}
                  </p>
                ) : null}
              </div>

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
                    <p className="mt-1 whitespace-pre-line">{pick(contactCard.nowText)}</p>
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
