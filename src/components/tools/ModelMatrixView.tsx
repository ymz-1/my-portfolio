"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  countByFamily,
  familyLabels,
  getCellStatus,
  matrixModels,
  matrixProviders,
  MATRIX_UPDATED,
  type MatrixStatus,
  type ModelFamily,
} from "@/lib/llm/model-matrix";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  MatrixStatus,
  { icon: string; label: { zh: string; en: string }; className: string }
> = {
  supported: {
    icon: "✓",
    label: { zh: "已支持", en: "Supported" },
    className: "bg-emerald-500/15 text-emerald-300",
  },
  restricted: {
    icon: "⚠",
    label: { zh: "受限", en: "Restricted" },
    className: "bg-amber-500/15 text-amber-200",
  },
  coming: {
    icon: "◷",
    label: { zh: "即将上线", en: "Coming soon" },
    className: "bg-sky-500/15 text-sky-200",
  },
  none: {
    icon: "—",
    label: { zh: "不支持", en: "Not supported" },
    className: "bg-red-500/10 text-red-300/70",
  },
};

const FAMILIES: ModelFamily[] = [
  "all",
  "gpt",
  "claude",
  "deepseek",
  "gemini",
  "glm",
  "qwen",
  "minimax",
  "kimi",
];

function MatrixCell({ status }: { status: MatrixStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <td
      className={cn(
        "min-w-[5.5rem] border border-white/10 px-1.5 py-2 text-center text-sm",
        cfg.className,
      )}
    >
      <span className="font-medium">{cfg.icon}</span>
    </td>
  );
}

export function ModelMatrixView() {
  const { pick } = useLanguage();
  const [family, setFamily] = useState<ModelFamily>("all");
  const [providerQuery, setProviderQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");

  const visibleModels = useMemo(() => {
    let models =
      family === "all"
        ? matrixModels
        : matrixModels.filter((m) => m.family === family);
    const q = modelQuery.trim().toLowerCase();
    if (q) models = models.filter((m) => m.name.toLowerCase().includes(q));
    return models;
  }, [family, modelQuery]);

  const visibleProviders = useMemo(() => {
    const q = providerQuery.trim().toLowerCase();
    if (!q) return matrixProviders;
    return matrixProviders.filter((p) =>
      pick(p.name).toLowerCase().includes(q),
    );
  }, [providerQuery, pick]);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/15 via-surface/80 to-surface/40 px-6 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "Pricing Intelligence", en: "Pricing Intelligence" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "模型矩阵", en: "Model Matrix" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "一览各服务商对主流模型的支持状态。数据来源于模型能力矩阵导出表。",
            en: "Overview of provider support for mainstream models. Data from the model capability matrix export.",
          })}
        </p>
      </header>

      <section className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map((f) => {
              const count =
                f === "all" ? matrixModels.length : countByFamily(f);
              const label =
                f === "all"
                  ? pick({ zh: "全部", en: "All" })
                  : pick(familyLabels[f]);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFamily(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    family === f
                      ? "bg-brand/20 text-brand"
                      : "bg-white/5 text-muted hover:text-foreground",
                  )}
                >
                  {label} {count}
                </button>
              );
            })}
          </div>
          <input
            type="search"
            value={modelQuery}
            onChange={(e) => setModelQuery(e.target.value)}
            placeholder={pick({ zh: "搜索模型", en: "Search models" })}
            className="w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none ring-brand/40 focus:ring-2 lg:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            {(Object.keys(STATUS_CONFIG) as MatrixStatus[]).map((key) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                    STATUS_CONFIG[key].className,
                  )}
                >
                  {STATUS_CONFIG[key].icon}
                </span>
                {pick(STATUS_CONFIG[key].label)}
              </span>
            ))}
          </div>
          <input
            type="search"
            value={providerQuery}
            onChange={(e) => setProviderQuery(e.target.value)}
            placeholder={pick({
              zh: "搜索服务商…",
              en: "Search providers…",
            })}
            className="w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none ring-brand/40 focus:ring-2 sm:max-w-xs"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
          <h2 className="text-base font-semibold">
            {pick({ zh: "模型能力矩阵", en: "Model capability matrix" })}
          </h2>
          <span className="text-xs text-muted">
            {pick({ zh: "更新于", en: "Updated" })} {pick(MATRIX_UPDATED)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-xs text-muted">
                <th className="sticky left-0 z-10 min-w-[8rem] border border-white/10 bg-surface px-3 py-2 text-left font-medium">
                  {pick({ zh: "服务商", en: "Provider" })}
                </th>
                {visibleModels.map((model) => (
                  <th
                    key={model.id}
                    className="min-w-[5.5rem] border border-white/10 px-2 py-2 text-center font-medium"
                  >
                    <div>{model.name}</div>
                    {model.contextLabel && (
                      <div className="mt-0.5 text-[10px] font-normal text-muted/80">
                        {model.contextLabel}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-white/[0.02]">
                  <td className="sticky left-0 z-10 border border-white/10 bg-surface/95 px-3 py-2">
                    <div className="font-medium">{pick(provider.name)}</div>
                    <div className="text-[10px] text-muted">
                      {provider.supportCount}{" "}
                      {pick({ zh: "个模型", en: "models" })}
                    </div>
                  </td>
                  {visibleModels.map((model) => (
                    <MatrixCell
                      key={model.id}
                      status={getCellStatus(provider, model.id)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleProviders.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-muted">
            {pick({ zh: "无匹配服务商", en: "No matching providers" })}
          </p>
        )}
      </section>

      <p className="mt-6 text-center text-[11px] text-muted">
        {pick({
          zh: "支持状态仅供参考，以各服务商官方文档为准。更新数据请修改 src/lib/llm/model-matrix.ts。",
          en: "Support status is indicative — check official provider docs. Update src/lib/llm/model-matrix.ts to refresh data.",
        })}
      </p>
    </div>
  );
}
