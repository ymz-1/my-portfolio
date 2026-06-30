import type { Localized } from "@/lib/i18n/LanguageProvider";
import {
  countTokensForModel,
  type TokenCounterModel,
} from "@/lib/llm/token-counter";

export type ContextWindowModel = TokenCounterModel & {
  provider: Localized;
  contextWindowTokens: number;
  contextWindowLabel: Localized;
  helperNote?: Localized;
};

/** Models available in the checker dropdown */
export const contextWindowModels: ContextWindowModel[] = [
  {
    id: "claude-opus-4-8",
    name: { zh: "Claude Opus 4.8", en: "Claude Opus 4.8" },
    family: { zh: "Anthropic", en: "Anthropic" },
    provider: { zh: "Anthropic", en: "Anthropic" },
    charsPerToken: 3,
    precise: false,
    chineseTokenRatio: 1 / 3,
    englishWordRatio: 1.3,
    otherCharRatio: 0.5,
    contextWindowTokens: 200_000,
    contextWindowLabel: { zh: "200,000 tokens", en: "200,000 tokens" },
    helperNote: {
      zh: "Claude 系列估算约 3 字符/token。长上下文场景请预留输出 token 空间。",
      en: "Claude models estimate ~3 chars/token. Leave headroom for output tokens in long-context use.",
    },
  },
  {
    id: "claude-sonnet-4-6",
    name: { zh: "Claude Sonnet 4.6", en: "Claude Sonnet 4.6" },
    family: { zh: "Anthropic", en: "Anthropic" },
    provider: { zh: "Anthropic", en: "Anthropic" },
    charsPerToken: 3,
    precise: false,
    chineseTokenRatio: 1 / 3,
    englishWordRatio: 1.3,
    otherCharRatio: 0.5,
    contextWindowTokens: 200_000,
    contextWindowLabel: { zh: "200,000 tokens", en: "200,000 tokens" },
  },
  {
    id: "gpt-4o",
    name: { zh: "GPT-4o", en: "GPT-4o" },
    family: { zh: "OpenAI", en: "OpenAI" },
    provider: { zh: "OpenAI", en: "OpenAI" },
    charsPerToken: 4,
    precise: true,
    chineseTokenRatio: 1 / 1.5,
    englishWordRatio: 1.0,
    otherCharRatio: 0.25,
    contextWindowTokens: 128_000,
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
    helperNote: {
      zh: "OpenAI 模型使用较精确启发式。128K 上下文含输入与输出总量。",
      en: "OpenAI uses a tighter estimate. 128K context includes input and output combined.",
    },
  },
  {
    id: "gpt-4o-mini",
    name: { zh: "GPT-4o mini", en: "GPT-4o mini" },
    family: { zh: "OpenAI", en: "OpenAI" },
    provider: { zh: "OpenAI", en: "OpenAI" },
    charsPerToken: 4,
    precise: true,
    chineseTokenRatio: 1 / 1.5,
    englishWordRatio: 1.0,
    otherCharRatio: 0.25,
    contextWindowTokens: 128_000,
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "gemini-2-5-pro",
    name: { zh: "Gemini 2.5 Pro", en: "Gemini 2.5 Pro" },
    family: { zh: "Google", en: "Google" },
    provider: { zh: "Google", en: "Google" },
    charsPerToken: 3.5,
    precise: false,
    chineseTokenRatio: 1 / 3.5,
    englishWordRatio: 1.25,
    otherCharRatio: 0.45,
    contextWindowTokens: 1_000_000,
    contextWindowLabel: { zh: "~1M tokens", en: "~1M tokens" },
    helperNote: {
      zh: "Gemini 2.5 Pro 支持超长上下文。估算约 3.5 字符/token。",
      en: "Gemini 2.5 Pro supports very long context. Estimate ~3.5 chars/token.",
    },
  },
  {
    id: "deepseek-v3",
    name: { zh: "DeepSeek V3", en: "DeepSeek V3" },
    family: { zh: "DeepSeek", en: "DeepSeek" },
    provider: { zh: "DeepSeek", en: "DeepSeek" },
    charsPerToken: 2.5,
    precise: false,
    chineseTokenRatio: 1 / 2.5,
    englishWordRatio: 1.2,
    otherCharRatio: 0.4,
    contextWindowTokens: 128_000,
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "qwen3-5",
    name: { zh: "Qwen3.5", en: "Qwen3.5" },
    family: { zh: "阿里通义", en: "Alibaba Qwen" },
    provider: { zh: "Alibaba", en: "Alibaba" },
    charsPerToken: 2.5,
    precise: false,
    chineseTokenRatio: 1 / 2.5,
    englishWordRatio: 1.2,
    otherCharRatio: 0.4,
    contextWindowTokens: 128_000,
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "llama-3-3",
    name: { zh: "Llama 3.3", en: "Llama 3.3" },
    family: { zh: "Meta", en: "Meta" },
    provider: { zh: "Meta", en: "Meta" },
    charsPerToken: 4,
    precise: false,
    chineseTokenRatio: 1 / 4,
    englishWordRatio: 1.1,
    otherCharRatio: 0.35,
    contextWindowTokens: 128_000,
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
];

/** Extended reference rows for the table (may include models not in dropdown) */
export type ContextWindowReference = {
  id: string;
  name: Localized;
  provider: Localized;
  contextWindowLabel: Localized;
};

export const contextWindowReference: ContextWindowReference[] = [
  {
    id: "gpt-5",
    name: { zh: "GPT-5", en: "GPT-5" },
    provider: { zh: "OpenAI", en: "OpenAI" },
    contextWindowLabel: { zh: "~1.1M tokens", en: "~1.1M tokens" },
  },
  {
    id: "gemini-flash",
    name: { zh: "Gemini 2.5 Flash", en: "Gemini 2.5 Flash" },
    provider: { zh: "Google", en: "Google" },
    contextWindowLabel: { zh: "1,000,000 tokens", en: "1,000,000 tokens" },
  },
  {
    id: "claude-opus-ref",
    name: { zh: "Claude Opus 4.8", en: "Claude Opus 4.8" },
    provider: { zh: "Anthropic", en: "Anthropic" },
    contextWindowLabel: { zh: "200,000 tokens", en: "200,000 tokens" },
  },
  {
    id: "claude-sonnet-ref",
    name: { zh: "Claude Sonnet 4.6", en: "Claude Sonnet 4.6" },
    provider: { zh: "Anthropic", en: "Anthropic" },
    contextWindowLabel: { zh: "200,000 tokens", en: "200,000 tokens" },
  },
  {
    id: "deepseek-ref",
    name: { zh: "DeepSeek V3", en: "DeepSeek V3" },
    provider: { zh: "DeepSeek", en: "DeepSeek" },
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "qwen-ref",
    name: { zh: "Qwen3.5", en: "Qwen3.5" },
    provider: { zh: "Alibaba", en: "Alibaba" },
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "glm-4",
    name: { zh: "GLM-4", en: "GLM-4" },
    provider: { zh: "Zhipu AI", en: "Zhipu AI" },
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "kimi",
    name: { zh: "Kimi K2", en: "Kimi K2" },
    provider: { zh: "Moonshot AI", en: "Moonshot AI" },
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
  {
    id: "llama-ref",
    name: { zh: "Llama 3.3", en: "Llama 3.3" },
    provider: { zh: "Meta", en: "Meta" },
    contextWindowLabel: { zh: "128,000 tokens", en: "128,000 tokens" },
  },
];

export const REFERENCE_UPDATED = { zh: "2025 年 6 月", en: "June 2025" };

export function getContextModelById(id: string): ContextWindowModel {
  return contextWindowModels.find((m) => m.id === id) ?? contextWindowModels[0];
}

export type WindowUsage = {
  promptTokens: number;
  loadedPreview: number;
  totalUsed: number;
  remaining: number;
  limit: number;
  usedPct: number;
  overLimit: boolean;
};

export function calcWindowUsage(
  promptText: string,
  model: ContextWindowModel,
  loadedPreview: number,
): WindowUsage {
  const promptTokens = countTokensForModel(promptText, model).tokens;
  const safeLoaded = Math.max(0, loadedPreview);
  const totalUsed = promptTokens + safeLoaded;
  const limit = model.contextWindowTokens;
  const remaining = Math.max(0, limit - totalUsed);
  const usedPct = limit > 0 ? Math.min(100, (totalUsed / limit) * 100) : 0;

  return {
    promptTokens,
    loadedPreview: safeLoaded,
    totalUsed,
    remaining,
    limit,
    usedPct,
    overLimit: totalUsed > limit,
  };
}

export function formatTokenCount(n: number): string {
  return n.toLocaleString();
}
