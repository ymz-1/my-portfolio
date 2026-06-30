"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  calcWindowUsage,
  contextWindowModels,
  contextWindowReference,
  formatTokenCount,
  getContextModelById,
  REFERENCE_UPDATED,
} from "@/lib/llm/context-window";
import { cn } from "@/lib/utils";

export function ContextWindowCheckerView() {
  const { pick } = useLanguage();
  const [modelId, setModelId] = useState(contextWindowModels[0].id);
  const [text, setText] = useState("");
  const [loadedPreview, setLoadedPreview] = useState(0);
  const [autoClear, setAutoClear] = useState(false);

  const model = useMemo(() => getContextModelById(modelId), [modelId]);

  const usage = useMemo(
    () => calcWindowUsage(text, model, loadedPreview),
    [text, model, loadedPreview],
  );

  useEffect(() => {
    if (autoClear && usage.overLimit && text.trim()) {
      setText("");
    }
  }, [autoClear, usage.overLimit, text]);

  const progressColor = usage.overLimit
    ? "bg-red-500"
    : usage.usedPct > 85
      ? "bg-amber-500"
      : "bg-brand";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/15 via-surface/80 to-surface/40 px-6 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "在线工具", en: "Online tool" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "上下文窗口检查器", en: "Context Window Checker" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "检查你的 Prompt 是否能放入目标模型的上下文窗口。粘贴文本、选择模型，实时查看已用 token、剩余空间与超限比例。",
            en: "Check whether your prompt fits a model's context window. Paste text, pick a model, and see used tokens, remaining space, and limit usage in real time.",
          })}
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "模型", en: "Model" })}
            </label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
            >
              {contextWindowModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {pick(m.name)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:min-w-[14rem]">
            <label className="text-sm font-medium">
              {pick({
                zh: "已加载预览（可选 token 数）",
                en: "Loaded context preview (optional tokens)",
              })}
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={loadedPreview}
              onChange={(e) =>
                setLoadedPreview(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 font-mono text-sm outline-none ring-brand/40 focus:ring-2"
            />
          </div>
        </div>

        {model.helperNote && (
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {pick(model.helperNote)}
          </p>
        )}

        <div className="relative mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm font-medium">
              {pick({ zh: "您的 Prompt", en: "Your prompt" })}
            </label>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs text-amber-200">
              {pick({ zh: "估算", en: "Estimate" })} · ~
              {model.charsPerToken}{" "}
              {pick({ zh: "字符/token", en: "chars/token" })}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={pick({
              zh: "在此粘贴或输入 Prompt — 输入时 token 数会实时更新…",
              en: "Paste or type your prompt — token count updates as you type…",
            })}
            className="w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm leading-7 text-foreground outline-none ring-brand/40 focus:ring-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setText("")}
            className="rounded-lg border border-white/15 px-4 py-1.5 text-sm transition-colors hover:bg-white/5"
          >
            {pick({ zh: "清除", en: "Clear" })}
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={autoClear}
              onChange={(e) => setAutoClear(e.target.checked)}
              className="accent-brand"
            />
            {pick({ zh: "超限时自动清除", en: "Auto-clear when over limit" })}
          </label>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-xl font-semibold sm:text-2xl">
              {formatTokenCount(usage.totalUsed)} /{" "}
              {formatTokenCount(usage.limit)}{" "}
              <span className="text-base font-normal text-muted">tokens</span>
            </p>
            <p
              className={cn(
                "text-sm font-medium",
                usage.overLimit ? "text-red-400" : "text-muted",
              )}
            >
              {pick({
                zh: `已使用窗口的 ${usage.usedPct.toFixed(1)}%`,
                en: `${usage.usedPct.toFixed(1)}% of window used`,
              })}
            </p>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn("h-full rounded-full transition-all duration-300", progressColor)}
              style={{ width: `${Math.min(100, usage.usedPct)}%` }}
            />
          </div>

          {usage.overLimit && (
            <p className="mt-2 text-xs text-red-400">
              {pick({
                zh: `超出上下文窗口 ${formatTokenCount(usage.totalUsed - usage.limit)} tokens`,
                en: `Over limit by ${formatTokenCount(usage.totalUsed - usage.limit)} tokens`,
              })}
            </p>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-center">
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {formatTokenCount(usage.promptTokens)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {pick({ zh: "已用 token", en: "Prompt tokens" })}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-center">
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {formatTokenCount(usage.loadedPreview)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {pick({ zh: "已加载预览", en: "Loaded preview" })}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-center">
              <p
                className={cn(
                  "font-mono text-2xl font-semibold tabular-nums",
                  usage.overLimit && "text-red-400",
                )}
              >
                {formatTokenCount(usage.remaining)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {pick({ zh: "剩余 token", en: "Remaining" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
          <h2 className="text-base font-semibold">
            {pick({ zh: "上下文窗口参考", en: "Context window reference" })}
          </h2>
          <span className="text-xs text-muted">
            {pick({ zh: "更新于", en: "Updated" })} {pick(REFERENCE_UPDATED)}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs text-muted">
                <th className="border border-white/10 px-4 py-2.5 font-medium">
                  {pick({ zh: "模型", en: "Model" })}
                </th>
                <th className="border border-white/10 px-4 py-2.5 font-medium">
                  {pick({ zh: "提供方", en: "Provider" })}
                </th>
                <th className="border border-white/10 px-4 py-2.5 font-medium">
                  {pick({ zh: "上下文窗口", en: "Context window" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {contextWindowReference.map((row) => {
                const isSelected = pick(row.name) === pick(model.name);

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "hover:bg-white/[0.02]",
                      isSelected && "bg-brand/10",
                    )}
                  >
                    <td className="border border-white/10 px-4 py-2.5 font-medium">
                      {pick(row.name)}
                    </td>
                    <td className="border border-white/10 px-4 py-2.5 text-muted">
                      {pick(row.provider)}
                    </td>
                    <td className="border border-white/10 px-4 py-2.5 font-mono text-xs">
                      {pick(row.contextWindowLabel)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-center text-[11px] text-muted">
        {pick({
          zh: "Token 数为本地估算，实际上下文限制以厂商文档为准。",
          en: "Token counts are local estimates — check vendor docs for official limits.",
        })}
      </p>
    </div>
  );
}
