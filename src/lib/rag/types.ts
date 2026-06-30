export type PageText = {
  page: number;
  text: string;
};

export type TextChunk = {
  id: string;
  page: number;
  text: string;
  startChar: number;
};

export type IndexedChunk = TextChunk & {
  embedding: number[];
};

export type SearchResult = {
  chunk: TextChunk;
  score: number;
};

export type RagIndex = {
  fileName: string;
  pageCount: number;
  chunks: IndexedChunk[];
};

export type PdfLimits = {
  maxBytes: number;
  maxPages: number;
};

export const PDF_LIMITS: PdfLimits = {
  maxBytes: 10 * 1024 * 1024,
  maxPages: 30,
};

export const WEBLLM_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export type LoadProgress = {
  phase: "download" | "load" | "ready";
  progress: number;
  text?: string;
};
