import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ScenarioPreset = {
  id: string;
  label: Localized;
  description: Localized;
  inputTokens: number;
  outputTokens: number;
  dailyCalls: number;
};

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "light-chat",
    label: { zh: "轻量聊天", en: "Light chat" },
    description: { zh: "短对话、客服", en: "Short Q&A, support" },
    inputTokens: 2_000,
    outputTokens: 500,
    dailyCalls: 50,
  },
  {
    id: "code-complete",
    label: { zh: "代码补全", en: "Code completion" },
    description: { zh: "IDE 补全场景", en: "IDE inline completion" },
    inputTokens: 4_000,
    outputTokens: 1_000,
    dailyCalls: 200,
  },
  {
    id: "long-summary",
    label: { zh: "长文总结", en: "Long summary" },
    description: { zh: "文档/RAG 总结", en: "Doc / RAG summarization" },
    inputTokens: 8_000,
    outputTokens: 2_000,
    dailyCalls: 10,
  },
  {
    id: "batch",
    label: { zh: "批量处理", en: "Batch processing" },
    description: { zh: "大批量离线任务", en: "High-volume offline jobs" },
    inputTokens: 16_000,
    outputTokens: 4_000,
    dailyCalls: 5,
  },
];
