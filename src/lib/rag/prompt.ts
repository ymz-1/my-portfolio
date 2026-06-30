import type { Locale } from "@/lib/i18n/LanguageProvider";
import type { SearchResult } from "./types";

export function buildRagPrompt(
  query: string,
  results: SearchResult[],
  lang: Locale,
): string {
  const context = results
    .map((r) => {
      const label =
        lang === "zh" ? `[第${r.chunk.page}页]` : `[Page ${r.chunk.page}]`;
      return `${label}\n${r.chunk.text}`;
    })
    .join("\n\n");

  if (lang === "zh") {
    return `你是文档问答助手。仅根据以下资料回答问题，不要编造。若资料不足以回答，请明确说明。

【资料】
${context}

【问题】
${query}`;
  }

  return `You are a document Q&A assistant. Answer ONLY from the provided excerpts. Do not invent facts. If the excerpts are insufficient, say so clearly.

【Context】
${context}

【Question】
${query}`;
}
