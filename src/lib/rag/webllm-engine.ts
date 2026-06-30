import type { LoadProgress } from "./types";
import { WEBLLM_MODEL } from "./types";

type CacheBackend = "cache" | "indexeddb" | "cross-origin" | "opfs";

type MlcEngine = {
  chat: {
    completions: {
      create: (options: {
        messages: { role: string; content: string }[];
        stream?: boolean;
        temperature?: number;
        max_tokens?: number;
      }) => AsyncIterable<{ choices: { delta: { content?: string } }[] }>;
    };
  };
};

let enginePromise: Promise<MlcEngine> | null = null;
let loadAbort = false;
let activeCacheBackend: CacheBackend = "indexeddb";

const CACHE_BACKENDS: CacheBackend[] = ["indexeddb", "opfs", "cache"];

export function abortWebLlmLoad(): void {
  loadAbort = true;
  enginePromise = null;
}

export function checkWebGpuSupport(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

function isNetworkOrCacheError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /Cache\.add|network error|fetch|Failed to fetch|Load model|download/i.test(
      msg,
    ) || msg.includes("Cache")
  );
}

async function createEngine(
  cacheBackend: CacheBackend,
  onProgress?: (progress: LoadProgress) => void,
): Promise<MlcEngine> {
  const { CreateMLCEngine, prebuiltAppConfig } = await import("@mlc-ai/web-llm");

  const engine = await CreateMLCEngine(WEBLLM_MODEL, {
    appConfig: {
      ...prebuiltAppConfig,
      cacheBackend,
    },
    initProgressCallback: (report) => {
      if (loadAbort) return;
      onProgress?.({
        phase: report.text.includes("Finish") ? "ready" : "download",
        progress: Math.round(report.progress * 100),
        text: report.text,
      });
    },
  });

  onProgress?.({ phase: "ready", progress: 100, text: "Ready" });
  activeCacheBackend = cacheBackend;
  return engine as unknown as MlcEngine;
}

export async function getWebLlmEngine(
  onProgress?: (progress: LoadProgress) => void,
): Promise<MlcEngine> {
  if (!checkWebGpuSupport()) {
    throw new Error("WebGPU is not available in this browser.");
  }

  loadAbort = false;

  if (!enginePromise) {
    enginePromise = (async () => {
      let lastError: unknown;
      for (const backend of CACHE_BACKENDS) {
        try {
          return await createEngine(backend, onProgress);
        } catch (err) {
          lastError = err;
          if (!isNetworkOrCacheError(err)) throw err;
        }
      }
      throw lastError;
    })();
  }

  try {
    return await enginePromise;
  } catch (err) {
    enginePromise = null;
    throw err;
  }
}

export async function* streamAnswer(
  prompt: string,
  onProgress?: (progress: LoadProgress) => void,
): AsyncGenerator<string> {
  yield* streamChat([{ role: "user", content: prompt }], onProgress);
}

export async function* streamChat(
  messages: { role: string; content: string }[],
  onProgress?: (progress: LoadProgress) => void,
  maxTokens = 512,
): AsyncGenerator<string> {
  const engine = await getWebLlmEngine(onProgress);

  const stream = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.4,
    max_tokens: maxTokens,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

export function resetWebLlmEngine(): void {
  enginePromise = null;
  loadAbort = false;
}

export function getActiveCacheBackend(): CacheBackend {
  return activeCacheBackend;
}

export { isNetworkOrCacheError };
