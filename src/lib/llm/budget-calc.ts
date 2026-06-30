import type { Localized } from "@/lib/i18n/LanguageProvider";
import {
  getOfficialQuote,
  getQuotesForModelId,
  type ProviderQuote,
} from "./providers";

export const USD_TO_CNY = 7.25;
export const DAYS_PER_MONTH = 30;

export type CostBreakdown = {
  perCallUsd: number;
  monthlyUsd: number;
  monthlyCny: number;
};

export type RankedQuote = {
  quote: ProviderQuote;
  costs: CostBreakdown;
  vsOfficialPct: number;
};

export type BudgetSummary = {
  modelName: Localized;
  lowestMonthlyUsd: number;
  maxDiscountPct: number;
  providerCount: number;
};

export function calcCosts(
  inputTokens: number,
  outputTokens: number,
  dailyCalls: number,
  quote: ProviderQuote,
): CostBreakdown {
  const perCallUsd =
    (inputTokens * quote.inputPriceUsd + outputTokens * quote.outputPriceUsd) /
    1_000_000;
  const monthlyUsd = perCallUsd * dailyCalls * DAYS_PER_MONTH;
  return {
    perCallUsd,
    monthlyUsd,
    monthlyCny: monthlyUsd * USD_TO_CNY,
  };
}

export function calcVsOfficial(
  monthlyUsd: number,
  officialMonthlyUsd: number,
): number {
  if (officialMonthlyUsd <= 0) return 0;
  return ((monthlyUsd - officialMonthlyUsd) / officialMonthlyUsd) * 100;
}

export function rankQuotesForModel(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  dailyCalls: number,
): RankedQuote[] {
  const quotes = getQuotesForModelId(modelId);
  const official = getOfficialQuote(modelId);
  const officialMonthly = official
    ? calcCosts(inputTokens, outputTokens, dailyCalls, official).monthlyUsd
    : 0;

  return quotes
    .map((quote) => {
      const costs = calcCosts(inputTokens, outputTokens, dailyCalls, quote);
      const vsOfficialPct = official
        ? calcVsOfficial(costs.monthlyUsd, officialMonthly)
        : 0;
      return { quote, costs, vsOfficialPct };
    })
    .sort((a, b) => a.costs.monthlyUsd - b.costs.monthlyUsd);
}

export function summarizeQuotes(
  modelName: Localized,
  ranked: RankedQuote[],
): BudgetSummary {
  if (ranked.length === 0) {
    return {
      modelName,
      lowestMonthlyUsd: 0,
      maxDiscountPct: 0,
      providerCount: 0,
    };
  }

  const lowest = ranked[0].costs.monthlyUsd;
  const maxDiscount = Math.min(...ranked.map((r) => r.vsOfficialPct));

  return {
    modelName,
    lowestMonthlyUsd: lowest,
    maxDiscountPct: maxDiscount,
    providerCount: ranked.length,
  };
}

/** Log-scale bar width 0–100 for chart rendering */
export function logBarWidth(value: number, maxValue: number): number {
  const floor = 0.01;
  const v = Math.max(value, floor);
  const max = Math.max(maxValue, floor);
  return (Math.log10(v) / Math.log10(max)) * 100;
}
