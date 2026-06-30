export type ApiProvider = "openai" | "anthropic";

export type KeyStatus = "valid" | "invalid" | "rate_limited" | "error" | "pending";

export type KeyTestResult = {
  id: string;
  keyMasked: string;
  provider: ApiProvider;
  status: KeyStatus;
  httpStatus?: number;
  latencyMs?: number;
  message?: string;
};

export const REQUEST_TIMEOUT_MS = 10_000;
export const DEFAULT_CONCURRENCY = 5;
export const MAX_KEYS = 1000;

export function maskApiKey(key: string): string {
  if (key.length <= 10) return "***";
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

export function parseKeys(input: string): string[] {
  return input
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .map((line) => {
      if (line.includes(",")) {
        const first = line.split(",")[0]?.trim();
        return first ?? line;
      }
      return line;
    })
    .filter(Boolean)
    .slice(0, MAX_KEYS);
}

export function detectProvider(key: string): ApiProvider {
  if (key.startsWith("sk-ant-") || key.startsWith("sk-ant_")) {
    return "anthropic";
  }
  return "openai";
}

function mapHttpStatus(status: number): KeyStatus {
  if (status >= 200 && status < 300) return "valid";
  if (status === 429) return "rate_limited";
  if (status === 401 || status === 403) return "invalid";
  return "invalid";
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function testOpenAiKey(key: string): Promise<KeyTestResult> {
  const start = performance.now();
  const id = crypto.randomUUID();

  try {
    const res = await fetchWithTimeout(
      "https://api.openai.com/v1/models",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${key}` },
      },
      REQUEST_TIMEOUT_MS,
    );

    return {
      id,
      keyMasked: maskApiKey(key),
      provider: "openai",
      status: mapHttpStatus(res.status),
      httpStatus: res.status,
      latencyMs: Math.round(performance.now() - start),
      message: res.ok ? undefined : res.statusText,
    };
  } catch (e) {
    return {
      id,
      keyMasked: maskApiKey(key),
      provider: "openai",
      status: "error",
      latencyMs: Math.round(performance.now() - start),
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function testAnthropicKey(key: string): Promise<KeyTestResult> {
  const start = performance.now();
  const id = crypto.randomUUID();

  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/models",
      {
        method: "GET",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
      },
      REQUEST_TIMEOUT_MS,
    );

    return {
      id,
      keyMasked: maskApiKey(key),
      provider: "anthropic",
      status: mapHttpStatus(res.status),
      httpStatus: res.status,
      latencyMs: Math.round(performance.now() - start),
      message: res.ok ? undefined : res.statusText,
    };
  } catch (e) {
    return {
      id,
      keyMasked: maskApiKey(key),
      provider: "anthropic",
      status: "error",
      latencyMs: Math.round(performance.now() - start),
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function batchTestKeys(
  keys: string[],
  provider: ApiProvider | "auto",
  concurrency: number,
  onProgress: (done: number, total: number, result: KeyTestResult) => void,
  shouldAbort?: () => boolean,
): Promise<KeyTestResult[]> {
  const results: KeyTestResult[] = new Array(keys.length);
  let index = 0;
  let done = 0;

  async function worker() {
    while (index < keys.length) {
      if (shouldAbort?.()) return;
      const i = index++;
      const key = keys[i];
      const resolved =
        provider === "auto" ? detectProvider(key) : provider;
      const tester =
        resolved === "anthropic" ? testAnthropicKey : testOpenAiKey;
      const result = await tester(key);
      results[i] = result;
      done++;
      onProgress(done, keys.length, result);
    }
  }

  const workers = Math.min(Math.max(1, concurrency), 10, keys.length);
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return results.filter(Boolean);
}

export function exportResultsJson(results: KeyTestResult[]): string {
  return JSON.stringify(results, null, 2);
}

export function exportResultsCsv(results: KeyTestResult[]): string {
  const header = "key,provider,status,http_status,latency_ms,message";
  const rows = results.map((r) =>
    [
      r.keyMasked,
      r.provider,
      r.status,
      r.httpStatus ?? "",
      r.latencyMs ?? "",
      (r.message ?? "").replace(/"/g, '""'),
    ]
      .map((v) => `"${v}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}

export function summarizeResults(results: KeyTestResult[]) {
  const counts = {
    valid: 0,
    invalid: 0,
    rate_limited: 0,
    error: 0,
  };
  let latencySum = 0;
  let latencyCount = 0;

  for (const r of results) {
    if (r.status in counts) counts[r.status as keyof typeof counts]++;
    if (r.latencyMs != null) {
      latencySum += r.latencyMs;
      latencyCount++;
    }
  }

  return {
    ...counts,
    total: results.length,
    avgLatencyMs:
      latencyCount > 0 ? Math.round(latencySum / latencyCount) : 0,
  };
}

export function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
