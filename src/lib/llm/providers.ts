import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ModelCatalogEntry = {
  id: string;
  name: Localized;
  vendor: Localized;
};

export type ProviderQuote = {
  id: string;
  modelId: string;
  providerName: Localized;
  /** USD per million input tokens */
  inputPriceUsd: number;
  /** USD per million output tokens */
  outputPriceUsd: number;
  isOfficial?: boolean;
  tags?: ("cn" | "global")[];
};

export const modelCatalog: ModelCatalogEntry[] = [
  {
    id: "claude-sonnet-4-6",
    name: { zh: "Claude Sonnet 4.6", en: "Claude Sonnet 4.6" },
    vendor: { zh: "Anthropic", en: "Anthropic" },
  },
  {
    id: "gpt-4o-mini",
    name: { zh: "GPT-4o mini", en: "GPT-4o mini" },
    vendor: { zh: "OpenAI", en: "OpenAI" },
  },
];

export const providerQuotes: ProviderQuote[] = [
  // Claude Sonnet 4.6 — official $3 / $15 per 1M (approx)
  {
    id: "sonnet-anthropic",
    modelId: "claude-sonnet-4-6",
    providerName: { zh: "Anthropic 官方", en: "Anthropic Official" },
    inputPriceUsd: 3.0,
    outputPriceUsd: 15.0,
    isOfficial: true,
    tags: ["global"],
  },
  {
    id: "sonnet-reseller-a",
    modelId: "claude-sonnet-4-6",
    providerName: { zh: "Reseller A（示例）", en: "Reseller A (sample)" },
    inputPriceUsd: 0.6,
    outputPriceUsd: 3.0,
    tags: ["cn"],
  },
  {
    id: "sonnet-reseller-b",
    modelId: "claude-sonnet-4-6",
    providerName: { zh: "Reseller B（示例）", en: "Reseller B (sample)" },
    inputPriceUsd: 0.75,
    outputPriceUsd: 3.75,
    tags: ["global"],
  },
  // GPT-4o mini — official $0.15 / $0.60 per 1M
  {
    id: "mini-openai",
    modelId: "gpt-4o-mini",
    providerName: { zh: "OpenAI 官方", en: "OpenAI Official" },
    inputPriceUsd: 0.15,
    outputPriceUsd: 0.6,
    isOfficial: true,
    tags: ["global"],
  },
  {
    id: "mini-reseller-a",
    modelId: "gpt-4o-mini",
    providerName: { zh: "Reseller A（示例）", en: "Reseller A (sample)" },
    inputPriceUsd: 0.12,
    outputPriceUsd: 0.48,
    tags: ["cn"],
  },
];

export function getModelById(id: string): ModelCatalogEntry | undefined {
  return modelCatalog.find((m) => m.id === id);
}

export function getQuotesForModelId(modelId: string): ProviderQuote[] {
  return providerQuotes.filter((q) => q.modelId === modelId);
}

export function getOfficialQuote(modelId: string): ProviderQuote | undefined {
  return providerQuotes.find((q) => q.modelId === modelId && q.isOfficial);
}
