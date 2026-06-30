import type { Localized } from "@/lib/i18n/LanguageProvider";

export type ModelFamily =
  | "all"
  | "gpt"
  | "claude"
  | "deepseek"
  | "gemini"
  | "glm"
  | "qwen"
  | "minimax"
  | "kimi";

export type MatrixStatus = "supported" | "restricted" | "coming" | "none";

export type MatrixModel = {
  id: string;
  name: string;
  family: Exclude<ModelFamily, "all">;
  /** Input / output context hint shown under model name */
  contextLabel?: string;
};

export type MatrixProvider = {
  id: string;
  name: Localized;
  supportCount: number;
  /** model id → status */
  cells: Record<string, MatrixStatus>;
};

export const MATRIX_UPDATED: Localized = {
  zh: "2026 年 6 月 29 日",
  en: "June 29, 2026",
};

export const matrixModels: MatrixModel[] = [
  { id: "gpt-5-2", name: "GPT-5.2", family: "gpt", contextLabel: "128K / 16K" },
  { id: "gpt-5-mini", name: "GPT-5 mini", family: "gpt", contextLabel: "128K / 16K" },
  { id: "o3", name: "o3", family: "gpt", contextLabel: "200K / 100K" },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    family: "claude",
    contextLabel: "200K / 8K",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    family: "claude",
    contextLabel: "200K / 8K",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    family: "claude",
    contextLabel: "200K / 8K",
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek V3.2",
    family: "deepseek",
    contextLabel: "128K / 8K",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    family: "gemini",
    contextLabel: "1.0M / 8K",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    family: "gemini",
    contextLabel: "1.0M / 8K",
  },
  { id: "glm-5", name: "GLM-5", family: "glm", contextLabel: "128K / 8K" },
  { id: "qwen-max", name: "Qwen-Max", family: "qwen", contextLabel: "128K / 8K" },
  {
    id: "minimax-m2-5",
    name: "MiniMax M2.5",
    family: "minimax",
    contextLabel: "128K / 8K",
  },
  {
    id: "kimi-v1-128k",
    name: "Kimi v1-128k",
    family: "kimi",
    contextLabel: "128K / 8K",
  },
];

export const matrixProviders: MatrixProvider[] = [
  {
    id: "laozhang",
    name: { zh: "老张AI", en: "LaoZhang AI" },
    supportCount: 13,
    cells: allSupported(),
  },
  {
    id: "openrouter",
    name: { zh: "OpenRouter", en: "OpenRouter" },
    supportCount: 11,
    cells: {
      ...allSupported(),
      "glm-5": "none",
      "minimax-m2-5": "none",
    },
  },
  {
    id: "apiyi",
    name: { zh: "API易", en: "APIyi" },
    supportCount: 9,
    cells: {
      ...pick([
        "gpt-5-2",
        "gpt-5-mini",
        "o3",
        "claude-sonnet-4-6",
        "claude-opus-4-6",
        "claude-haiku-4-5",
        "deepseek-v3-2",
        "gemini-2-5-pro",
        "gemini-2-5-flash",
      ]),
    },
  },
  {
    id: "closeai",
    name: { zh: "CloseAI", en: "CloseAI" },
    supportCount: 9,
    cells: pick([
      "gpt-5-2",
      "gpt-5-mini",
      "o3",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
      "deepseek-v3-2",
      "gemini-2-5-pro",
      "gemini-2-5-flash",
    ]),
  },
  {
    id: "aihubmix",
    name: { zh: "AIHubMix", en: "AIHubMix" },
    supportCount: 9,
    cells: pick([
      "gpt-5-2",
      "gpt-5-mini",
      "o3",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
      "deepseek-v3-2",
      "gemini-2-5-pro",
      "gemini-2-5-flash",
    ]),
  },
  {
    id: "88code",
    name: { zh: "88Code", en: "88Code" },
    supportCount: 7,
    cells: {
      ...pick([
        "gpt-5-2",
        "gpt-5-mini",
        "claude-sonnet-4-6",
        "claude-opus-4-6",
        "claude-haiku-4-5",
        "deepseek-v3-2",
      ]),
      o3: "restricted",
      "gemini-2-5-pro": "coming",
      "gemini-2-5-flash": "coming",
    },
  },
  {
    id: "privnode",
    name: { zh: "Privnode", en: "Privnode" },
    supportCount: 4,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
      "gemini-2-5-pro",
    ]),
  },
  {
    id: "sssaicode",
    name: { zh: "SSSAiCode", en: "SSSAiCode" },
    supportCount: 4,
    cells: {
      ...pick(["gpt-5-2", "gpt-5-mini", "claude-sonnet-4-6", "deepseek-v3-2"]),
      "gemini-2-5-pro": "coming",
      "gemini-2-5-flash": "coming",
    },
  },
  {
    id: "ikuncode",
    name: { zh: "iKunCode", en: "iKunCode" },
    supportCount: 4,
    cells: pick([
      "gpt-5-2",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "yescode",
    name: { zh: "YesCode", en: "YesCode" },
    supportCount: 4,
    cells: pick([
      "gpt-5-2",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "minicod",
    name: { zh: "minicod", en: "minicod" },
    supportCount: 4,
    cells: pick([
      "gpt-5-2",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "siliconflow",
    name: { zh: "硅基流动", en: "SiliconFlow" },
    supportCount: 3,
    cells: pick(["deepseek-v3-2", "glm-5", "qwen-max"]),
  },
  {
    id: "weelinking",
    name: { zh: "Weelinking", en: "Weelinking" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "anyrouter",
    name: { zh: "Anyrouter", en: "Anyrouter" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "haozhen",
    name: { zh: "皓臻云AI", en: "HaoZhen Cloud AI" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "duckcoding",
    name: { zh: "DuckCoding", en: "DuckCoding" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "qinzhi",
    name: { zh: "勤智AI", en: "QinZhi AI" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "tansgui",
    name: { zh: "碳硅生命体", en: "Carbon-Silicon Life" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "cubence",
    name: { zh: "Cubence", en: "Cubence" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "packycode",
    name: { zh: "PackyCode", en: "PackyCode" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "openai",
    name: { zh: "OpenAI", en: "OpenAI" },
    supportCount: 3,
    cells: pick(["gpt-5-2", "gpt-5-mini", "o3"]),
  },
  {
    id: "anthropic",
    name: { zh: "Anthropic", en: "Anthropic" },
    supportCount: 3,
    cells: pick([
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-haiku-4-5",
    ]),
  },
  {
    id: "flapcode",
    name: { zh: "Flapcode", en: "Flapcode" },
    supportCount: 2,
    cells: pick(["claude-sonnet-4-6", "claude-opus-4-6"]),
  },
  {
    id: "google",
    name: { zh: "Google Gemini", en: "Google Gemini" },
    supportCount: 2,
    cells: pick(["gemini-2-5-pro", "gemini-2-5-flash"]),
  },
  {
    id: "superxiaoai",
    name: { zh: "SuperXiaoAi", en: "SuperXiaoAi" },
    supportCount: 1,
    cells: pick(["claude-sonnet-4-6"]),
  },
  {
    id: "deepseek",
    name: { zh: "DeepSeek", en: "DeepSeek" },
    supportCount: 1,
    cells: pick(["deepseek-v3-2"]),
  },
  {
    id: "zhipu",
    name: { zh: "智谱GLM", en: "Zhipu GLM" },
    supportCount: 1,
    cells: pick(["glm-5"]),
  },
  {
    id: "minimax",
    name: { zh: "MiniMax", en: "MiniMax" },
    supportCount: 1,
    cells: pick(["minimax-m2-5"]),
  },
  {
    id: "aliyun-qwen",
    name: { zh: "阿里云Qwen", en: "Alibaba Qwen" },
    supportCount: 1,
    cells: pick(["qwen-max"]),
  },
  {
    id: "moonshot",
    name: { zh: "月之暗面Kimi", en: "Moonshot Kimi" },
    supportCount: 1,
    cells: pick(["kimi-v1-128k"]),
  },
  {
    id: "yinhe",
    name: { zh: "银河Code", en: "YinHe Code" },
    supportCount: 0,
    cells: {},
  },
];

function emptyCells(): Record<string, MatrixStatus> {
  return Object.fromEntries(matrixModels.map((m) => [m.id, "none" as const]));
}

function allSupported(): Record<string, MatrixStatus> {
  return Object.fromEntries(matrixModels.map((m) => [m.id, "supported" as const]));
}

function pick(ids: string[]): Record<string, MatrixStatus> {
  const cells = emptyCells();
  for (const id of ids) cells[id] = "supported";
  return cells;
}

export function getCellStatus(
  provider: MatrixProvider,
  modelId: string,
): MatrixStatus {
  return provider.cells[modelId] ?? "none";
}

export const familyLabels: Record<
  Exclude<ModelFamily, "all">,
  Localized
> = {
  gpt: { zh: "GPT", en: "GPT" },
  claude: { zh: "Claude", en: "Claude" },
  deepseek: { zh: "DeepSeek", en: "DeepSeek" },
  gemini: { zh: "Gemini", en: "Gemini" },
  glm: { zh: "GLM", en: "GLM" },
  qwen: { zh: "Qwen", en: "Qwen" },
  minimax: { zh: "MiniMax", en: "MiniMax" },
  kimi: { zh: "Kimi", en: "Kimi" },
};

export function countByFamily(family: Exclude<ModelFamily, "all">): number {
  return matrixModels.filter((m) => m.family === family).length;
}
