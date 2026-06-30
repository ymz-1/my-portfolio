"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { RankedQuote } from "@/lib/llm/budget-calc";
import {
  formatCny,
  formatPricePerM,
  formatUsd,
  formatVsOfficial,
} from "@/lib/llm/tokenEstimate";
import { cn } from "@/lib/utils";

type Props = {
  ranked: RankedQuote[];
};

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function BudgetComparisonTable({ ranked }: Props) {
  const { pick } = useLanguage();

  return (
    <section className="rounded-2xl border border-white/10 bg-surface/40 overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-6">
        <h2 className="text-sm font-semibold">
          {pick({ zh: "详细费用对比", en: "Detailed comparison" })}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs text-muted">
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "排名", en: "Rank" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "服务商", en: "Provider" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "Input 单价", en: "Input price" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "Output 单价", en: "Output price" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "单次费用", en: "Per call" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "月费 (USD)", en: "Monthly (USD)" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "月费 (CNY)", en: "Monthly (CNY)" })}
              </th>
              <th className="border border-white/10 px-3 py-2.5 font-medium">
                {pick({ zh: "VS 官方", en: "VS official" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row, index) => {
              const isSaving = row.vsOfficialPct < -0.05;
              const isOfficial = row.quote.isOfficial;

              return (
                <tr
                  key={row.quote.id}
                  className={cn(
                    "hover:bg-white/[0.02]",
                    index === 0 && "bg-brand/5",
                  )}
                >
                  <td className="border border-white/10 px-3 py-2.5 text-center">
                    {index < 3 ? RANK_MEDALS[index] : index + 1}
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-medium">
                    {pick(row.quote.providerName)}
                    {isOfficial && (
                      <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted">
                        {pick({ zh: "官方", en: "Official" })}
                      </span>
                    )}
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-mono text-xs">
                    {formatPricePerM(row.quote.inputPriceUsd)}
                    /1M
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-mono text-xs">
                    {formatPricePerM(row.quote.outputPriceUsd)}
                    /1M
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-mono text-xs">
                    {formatUsd(row.costs.perCallUsd)}
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-mono text-xs font-medium">
                    {formatUsd(row.costs.monthlyUsd)}
                  </td>
                  <td className="border border-white/10 px-3 py-2.5 font-mono text-xs">
                    {formatCny(row.costs.monthlyCny)}
                  </td>
                  <td
                    className={cn(
                      "border border-white/10 px-3 py-2.5 font-mono text-xs",
                      isSaving && "text-emerald-400",
                      isOfficial && "text-muted",
                    )}
                  >
                    {formatVsOfficial(row.vsOfficialPct)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
