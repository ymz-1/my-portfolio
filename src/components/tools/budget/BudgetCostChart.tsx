"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { RankedQuote } from "@/lib/llm/budget-calc";
import { logBarWidth } from "@/lib/llm/budget-calc";
import { formatUsd, formatVsOfficial } from "@/lib/llm/tokenEstimate";
import { cn } from "@/lib/utils";

type Props = {
  ranked: RankedQuote[];
  modelName: string;
  dailyCalls: number;
};

const AXIS_LABELS = [1, 10, 100];

export function BudgetCostChart({ ranked, modelName, dailyCalls }: Props) {
  const { pick } = useLanguage();

  if (ranked.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6">
        <p className="text-sm text-muted">
          {pick({ zh: "暂无报价数据", en: "No pricing data available" })}
        </p>
      </section>
    );
  }

  const maxMonthly = Math.max(...ranked.map((r) => r.costs.monthlyUsd), 1);

  return (
    <section className="rounded-2xl border border-white/10 bg-surface/40 overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-6">
        <h2 className="text-sm font-semibold">
          {pick({ zh: "费用对比", en: "Cost comparison" })}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {pick({
            zh: `各服务商月费排名（${modelName}，${dailyCalls} 次/天）`,
            en: `Monthly cost ranking (${modelName}, ${dailyCalls}/day)`,
          })}
        </p>
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-6 sm:py-5">
        {ranked.map((row, index) => {
          const width = logBarWidth(row.costs.monthlyUsd, maxMonthly);
          const isTopThree = index < 3 && row.vsOfficialPct < -0.05;
          const label = `${formatUsd(row.costs.monthlyUsd)} (${formatVsOfficial(row.vsOfficialPct)})`;

          return (
            <div key={row.quote.id} className="grid grid-cols-[7rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
              <span className="truncate text-xs text-muted sm:text-sm">
                {pick(row.quote.providerName)}
              </span>
              <div className="relative h-7 min-w-0">
                <div
                  className={cn(
                    "flex h-full min-w-[2rem] items-center rounded-md px-2 text-[10px] font-medium text-white sm:text-xs",
                    isTopThree ? "bg-emerald-600/80" : "bg-brand/70",
                  )}
                  style={{ width: `${Math.max(width, 8)}%` }}
                >
                  <span className="truncate whitespace-nowrap">{label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-4 pb-4 pt-2 sm:px-6">
        <div className="ml-[7rem] flex justify-between text-[10px] text-muted sm:ml-[9rem]">
          {AXIS_LABELS.map((v) => (
            <span key={v}>{formatUsd(v)}</span>
          ))}
        </div>
        <p className="mt-1 text-center text-[10px] text-muted/70">
          {pick({ zh: "对数刻度", en: "Log scale" })}
        </p>
      </div>
    </section>
  );
}
