import type { Localized } from "@/lib/i18n/LanguageProvider";

export type TokenCounterModel = {
  id: string;
  name: Localized;
  family: Localized;
  /** Approximate characters per token for badge display */
  charsPerToken: number;
  /** Uses tighter GPT-style heuristic when true */
  precise: boolean;
  chineseTokenRatio: number;
  englishWordRatio: number;
  otherCharRatio: number;
};

export const tokenCounterModels: TokenCounterModel[] = [
  {
    id: "claude-opus-4-8",
    name: { zh: "Claude Opus 4.8", en: "Claude Opus 4.8" },
    family: { zh: "Anthropic", en: "Anthropic" },
    charsPerToken: 3,
    precise: false,
    chineseTokenRatio: 1 / 3,
    englishWordRatio: 1.3,
    otherCharRatio: 0.5,
  },
  {
    id: "claude-sonnet-4-6",
    name: { zh: "Claude Sonnet 4.6", en: "Claude Sonnet 4.6" },
    family: { zh: "Anthropic", en: "Anthropic" },
    charsPerToken: 3,
    precise: false,
    chineseTokenRatio: 1 / 3,
    englishWordRatio: 1.3,
    otherCharRatio: 0.5,
  },
  {
    id: "gpt-4o",
    name: { zh: "GPT-4o", en: "GPT-4o" },
    family: { zh: "OpenAI", en: "OpenAI" },
    charsPerToken: 4,
    precise: true,
    chineseTokenRatio: 1 / 1.5,
    englishWordRatio: 1.0,
    otherCharRatio: 0.25,
  },
  {
    id: "gpt-4o-mini",
    name: { zh: "GPT-4o mini", en: "GPT-4o mini" },
    family: { zh: "OpenAI", en: "OpenAI" },
    charsPerToken: 4,
    precise: true,
    chineseTokenRatio: 1 / 1.5,
    englishWordRatio: 1.0,
    otherCharRatio: 0.25,
  },
  {
    id: "gemini-2-5-pro",
    name: { zh: "Gemini 2.5 Pro", en: "Gemini 2.5 Pro" },
    family: { zh: "Google", en: "Google" },
    charsPerToken: 3.5,
    precise: false,
    chineseTokenRatio: 1 / 3.5,
    englishWordRatio: 1.25,
    otherCharRatio: 0.45,
  },
  {
    id: "deepseek-v3",
    name: { zh: "DeepSeek V3", en: "DeepSeek V3" },
    family: { zh: "DeepSeek", en: "DeepSeek" },
    charsPerToken: 2.5,
    precise: false,
    chineseTokenRatio: 1 / 2.5,
    englishWordRatio: 1.2,
    otherCharRatio: 0.4,
  },
  {
    id: "qwen3-5",
    name: { zh: "Qwen3.5", en: "Qwen3.5" },
    family: { zh: "阿里通义", en: "Alibaba Qwen" },
    charsPerToken: 2.5,
    precise: false,
    chineseTokenRatio: 1 / 2.5,
    englishWordRatio: 1.2,
    otherCharRatio: 0.4,
  },
  {
    id: "llama-3-3",
    name: { zh: "Llama 3.3", en: "Llama 3.3" },
    family: { zh: "Meta", en: "Meta" },
    charsPerToken: 4,
    precise: false,
    chineseTokenRatio: 1 / 4,
    englishWordRatio: 1.1,
    otherCharRatio: 0.35,
  },
];

export type TokenStats = {
  tokens: number;
  characters: number;
  words: number;
  tokensPerWord: number;
};

export type TokenSegment = {
  text: string;
  tokenId: number;
};

function countWords(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) ?? []).length;
  const cjkWords = Math.ceil(chineseChars / 1.5);
  return englishWords + cjkWords;
}

export function countTokensForModel(
  text: string,
  model: TokenCounterModel,
): TokenStats {
  const trimmed = text;
  const characters = trimmed.length;
  const chineseChars = (trimmed.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const englishWords = (trimmed.match(/[a-zA-Z]+/g) ?? []).length;
  const stripped = trimmed
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[a-zA-Z\s]/g, "");
  const otherChars = stripped.length;

  const tokens = Math.round(
    chineseChars * model.chineseTokenRatio +
      englishWords * model.englishWordRatio +
      otherChars * model.otherCharRatio,
  );

  const safeTokens = Math.max(tokens, trimmed.trim() ? 1 : 0);
  const words = countWords(trimmed);
  const tokensPerWord = words > 0 ? safeTokens / words : 0;

  return {
    tokens: safeTokens,
    characters,
    words,
    tokensPerWord,
  };
}

export function segmentText(
  text: string,
  model: TokenCounterModel,
): TokenSegment[] {
  if (!text) return [];

  const segments: TokenSegment[] = [];
  let i = 0;
  let tokenId = 0;
  const cjkChunk = Math.max(1, Math.round(model.charsPerToken));
  const subwordLen = model.precise ? 3 : 4;

  while (i < text.length) {
    const char = text[i];

    if (/[\u4e00-\u9fff]/.test(char)) {
      let chunk = "";
      while (
        i < text.length &&
        /[\u4e00-\u9fff]/.test(text[i]) &&
        chunk.length < cjkChunk
      ) {
        chunk += text[i];
        i++;
      }
      segments.push({ text: chunk, tokenId: tokenId++ });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (i < text.length && /[a-zA-Z]/.test(text[i])) {
        word += text[i];
        i++;
      }
      if (word.length <= subwordLen + 1) {
        segments.push({ text: word, tokenId: tokenId++ });
      } else {
        for (let j = 0; j < word.length; j += subwordLen) {
          segments.push({ text: word.slice(j, j + subwordLen), tokenId: tokenId++ });
        }
      }
      continue;
    }

    if (/\s/.test(char)) {
      let ws = "";
      while (i < text.length && /\s/.test(text[i])) {
        ws += text[i];
        i++;
      }
      segments.push({ text: ws, tokenId: tokenId++ });
      continue;
    }

    segments.push({ text: char, tokenId: tokenId++ });
    i++;
  }

  return segments;
}

export function getModelById(id: string): TokenCounterModel {
  return tokenCounterModels.find((m) => m.id === id) ?? tokenCounterModels[0];
}

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
};

export const tokenCounterFaqs: FaqItem[] = [
  {
    id: "what-is-token",
    question: { zh: "什么是 token？", en: "What is a token?" },
    answer: {
      zh: "Token 是大模型处理文本的最小单位。一段文字会被切分成 token 序列后再送入模型。中文通常 1 字 ≈ 1–2 token，英文 1 词 ≈ 1–2 token，具体取决于模型与分词器。",
      en: "Tokens are the smallest units models process. Text is split into token sequences before inference. Chinese often uses ~1–2 tokens per character and English ~1–2 per word, depending on the tokenizer.",
    },
  },
  {
    id: "why-different",
    question: {
      zh: "为什么不同模型 token 数不同？",
      en: "Why do token counts differ across models?",
    },
    answer: {
      zh: "各厂商使用不同的分词器（tokenizer）。同一句话在 GPT、Claude、Llama 下的 token 数可能相差 10%–30%。本工具对 OpenAI 模型使用较精确的启发式，其它模型为估算。",
      en: "Each vendor uses a different tokenizer. The same sentence can differ by 10%–30% across GPT, Claude, and Llama. OpenAI models use a tighter heuristic here; others are estimates.",
    },
  },
  {
    id: "privacy",
    question: { zh: "我的文本会被上传吗？", en: "Is my text uploaded?" },
    answer: {
      zh: "不会。所有计数与切分均在浏览器本地完成，不会发送到任何服务器。",
      en: "No. All counting and segmentation runs locally in your browser — nothing is sent to a server.",
    },
  },
  {
    id: "use-case",
    question: {
      zh: "token 计数有什么用？",
      en: "What is token counting useful for?",
    },
    answer: {
      zh: "可用于估算 API 费用、检查是否超出上下文窗口、优化 Prompt 长度，以及在 RAG 场景中控制检索片段大小。",
      en: "Use it to estimate API costs, check context window limits, optimize prompt length, and control chunk sizes in RAG pipelines.",
    },
  },
];
