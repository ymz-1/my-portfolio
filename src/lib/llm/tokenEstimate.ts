export type TokenBreakdown = {
  chineseChars: number;
  englishWords: number;
  otherChars: number;
  estimatedTokens: number;
};

export type InputUnit = "tokens" | "words" | "chars";

/** Approximate tokens per word (English) */
const TOKENS_PER_WORD = 1.3;
/** Approximate tokens per character (mixed/CJK average) */
const TOKENS_PER_CHAR = 1.5;

export function estimateTokensFromText(text: string): TokenBreakdown {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) ?? []).length;
  const stripped = text.replace(/[\u4e00-\u9fff]/g, "").replace(/[a-zA-Z\s]/g, "");
  const otherChars = stripped.length;

  const estimatedTokens = Math.round(
    chineseChars * 1.5 + englishWords * 1.3 + otherChars * 0.5,
  );

  return {
    chineseChars,
    englishWords,
    otherChars,
    estimatedTokens: Math.max(estimatedTokens, text.trim() ? 1 : 0),
  };
}

export function unitToTokens(value: number, unit: InputUnit): number {
  switch (unit) {
    case "tokens":
      return Math.round(value);
    case "words":
      return Math.round(value * TOKENS_PER_WORD);
    case "chars":
      return Math.round(value * TOKENS_PER_CHAR);
  }
}

export function tokensToUnit(tokens: number, unit: InputUnit): number {
  switch (unit) {
    case "tokens":
      return tokens;
    case "words":
      return Math.round(tokens / TOKENS_PER_WORD);
    case "chars":
      return Math.round(tokens / TOKENS_PER_CHAR);
  }
}

export function getInputSliderRange(unit: InputUnit): {
  min: number;
  max: number;
  step: number;
} {
  switch (unit) {
    case "tokens":
      return { min: 500, max: 32_000, step: 500 };
    case "words":
      return { min: 100, max: 8_000, step: 100 };
    case "chars":
      return { min: 200, max: 16_000, step: 200 };
  }
}

export function formatCurrency(value: number): string {
  if (value < 0.01) return `¥${value.toFixed(4)}`;
  if (value < 1) return `¥${value.toFixed(3)}`;
  return `¥${value.toFixed(2)}`;
}

export function formatUsd(value: number): string {
  if (value < 0.01) return `$${value.toFixed(4)}`;
  if (value < 1) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
}

export function formatCny(value: number): string {
  return formatCurrency(value);
}

export function formatPricePerM(value: number): string {
  if (value < 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(2)}`;
}

export function formatVsOfficial(pct: number): string {
  if (Math.abs(pct) < 0.05) return "0%";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
