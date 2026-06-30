"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { BudgetSummary } from "@/lib/llm/budget-calc";
import { formatUsd, formatVsOfficial } from "@/lib/llm/tokenEstimate";
import { cn } from "@/lib/utils";

type Props = {
  summary: BudgetSummary;
};

function KpiCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 truncate text-lg font-semibold sm:text-xl",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function BudgetSummaryCards({ summary }: Props) {
  const { pick } = useLanguage();
  const modelLabel = pick(summary.modelName);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <KpiCard
        label={pick({ zh: "当前模型", en: "Current model" })}
        value={modelLabel}
      />
      <KpiCard
        label={pick({ zh: "最低月费", en: "Lowest monthly" })}
        value={formatUsd(summary.lowestMonthlyUsd)}
        valueClassName="text-brand"
      />
      <KpiCard
        label={pick({ zh: "最大折扣", en: "Max discount" })}
        value={formatVsOfficial(summary.maxDiscountPct)}
        valueClassName={
          summary.maxDiscountPct < 0 ? "text-emerald-400" : "text-muted"
        }
      />
      <KpiCard
        label={pick({ zh: "服务商数", en: "Providers" })}
        value={summary.providerCount}
      />
    </div>
  );
}
