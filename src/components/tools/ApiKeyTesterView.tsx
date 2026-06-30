"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  batchTestKeys,
  DEFAULT_CONCURRENCY,
  downloadText,
  exportResultsCsv,
  exportResultsJson,
  parseKeys,
  summarizeResults,
  type ApiProvider,
  type KeyTestResult,
} from "@/lib/llm/api-key-tester";
import { cn } from "@/lib/utils";

type ProviderMode = ApiProvider | "auto";

const STATUS_STYLE: Record<string, string> = {
  valid: "bg-emerald-500/15 text-emerald-300",
  invalid: "bg-red-500/15 text-red-300",
  rate_limited: "bg-amber-500/15 text-amber-200",
  error: "bg-zinc-500/20 text-muted",
  pending: "bg-white/5 text-muted",
};

export function ApiKeyTesterView() {
  const { pick } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<ProviderMode>("auto");
  const [concurrency, setConcurrency] = useState(DEFAULT_CONCURRENCY);
  const [results, setResults] = useState<KeyTestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const summary = results.length > 0 ? summarizeResults(results) : null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ""));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleTest = useCallback(async () => {
    const keys = parseKeys(input);
    if (keys.length === 0) return;

    abortRef.current = false;
    setRunning(true);
    setResults([]);
    setProgress({ done: 0, total: keys.length });

    try {
      const out = await batchTestKeys(
        keys,
        provider,
        concurrency,
        (done, total, result) => {
          setProgress({ done, total });
          setResults((prev) => [...prev, result]);
        },
        () => abortRef.current,
      );
      setResults(out);
    } finally {
      setRunning(false);
    }
  }, [input, provider, concurrency]);

  const handleStop = () => {
    abortRef.current = true;
  };

  const statusLabel = (s: string) => {
    const map: Record<string, { zh: string; en: string }> = {
      valid: { zh: "有效", en: "Valid" },
      invalid: { zh: "无效", en: "Invalid" },
      rate_limited: { zh: "限流", en: "Rate limited" },
      error: { zh: "错误", en: "Error" },
      pending: { zh: "等待", en: "Pending" },
    };
    return pick(map[s] ?? { zh: s, en: s });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/15 via-surface/80 to-surface/40 px-6 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "开发者工具", en: "Developer tools" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "API Key 批量测试", en: "API Key Batch Tester" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "批量验证 OpenAI / Anthropic API Key 是否可用，统计延迟与有效/无效/限流状态。Key 仅存在浏览器内存，不会上传服务器。",
            en: "Batch-check OpenAI / Anthropic API keys for validity, latency, and rate limits. Keys stay in browser memory only.",
          })}
        </p>
      </header>

      <section className="space-y-5 rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium">
              {pick({ zh: "API Key（每行一个）", en: "API keys (one per line)" })}
            </label>
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.csv,text/plain"
                className="hidden"
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg border border-white/15 px-3 py-1 text-xs hover:bg-white/5"
              >
                {pick({ zh: "导入 TXT/CSV", en: "Import TXT/CSV" })}
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={running}
            rows={8}
            placeholder={pick({
              zh: "sk-...\nsk-ant-...\n（每行一个 Key）",
              en: "sk-...\nsk-ant-...\n(one key per line)",
            })}
            className="w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-3 font-mono text-xs leading-6 outline-none ring-brand/40 focus:ring-2 disabled:opacity-60"
          />
          <p className="mt-1 text-[11px] text-muted">
            {parseKeys(input).length}{" "}
            {pick({ zh: "个 Key", en: "keys" })} ·{" "}
            {pick({ zh: "最多 1000 个", en: "max 1000" })}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "Provider", en: "Provider" })}
            </label>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as ProviderMode)
              }
              disabled={running}
              className="mt-2 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
            >
              <option value="auto">
                {pick({ zh: "自动识别", en: "Auto detect" })}
              </option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "并发数", en: "Concurrency" })} ({concurrency})
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              disabled={running}
              className="mt-3 w-full accent-brand"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleTest()}
            disabled={running || parseKeys(input).length === 0}
            className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {running
              ? pick({ zh: "测试中…", en: "Testing…" })
              : pick({ zh: "开始测试", en: "Start test" })}
          </button>
          {running && (
            <button
              type="button"
              onClick={handleStop}
              className="rounded-lg border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
            >
              {pick({ zh: "停止", en: "Stop" })}
            </button>
          )}
        </div>

        {running && progress.total > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>
                {progress.done} / {progress.total}
              </span>
              <span>
                {Math.round((progress.done / progress.total) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{
                  width: `${(progress.done / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </section>

      {summary && (
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: pick({ zh: "总计", en: "Total" }), value: summary.total },
            { label: pick({ zh: "有效", en: "Valid" }), value: summary.valid },
            {
              label: pick({ zh: "无效", en: "Invalid" }),
              value: summary.invalid,
            },
            {
              label: pick({ zh: "限流", en: "Limited" }),
              value: summary.rate_limited,
            },
            {
              label: pick({ zh: "错误", en: "Error" }),
              value: summary.error,
            },
            {
              label: pick({ zh: "平均延迟", en: "Avg latency" }),
              value: `${summary.avgLatencyMs}ms`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-surface/50 px-4 py-3 text-center"
            >
              <p className="font-mono text-lg font-semibold">{item.value}</p>
              <p className="mt-1 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </section>
      )}

      {results.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface/40">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-semibold">
              {pick({ zh: "测试结果", en: "Results" })}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  downloadText(
                    exportResultsCsv(results),
                    "api-key-results.csv",
                    "text/csv",
                  )
                }
                className="rounded-lg border border-white/15 px-3 py-1 text-xs hover:bg-white/5"
              >
                {pick({ zh: "导出 CSV", en: "Export CSV" })}
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadText(
                    exportResultsJson(results),
                    "api-key-results.json",
                    "application/json",
                  )
                }
                className="rounded-lg border border-white/15 px-3 py-1 text-xs hover:bg-white/5"
              >
                {pick({ zh: "导出 JSON", en: "Export JSON" })}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-xs text-muted">
                  <th className="border border-white/10 px-3 py-2.5">Key</th>
                  <th className="border border-white/10 px-3 py-2.5">
                    Provider
                  </th>
                  <th className="border border-white/10 px-3 py-2.5">
                    {pick({ zh: "状态", en: "Status" })}
                  </th>
                  <th className="border border-white/10 px-3 py-2.5">HTTP</th>
                  <th className="border border-white/10 px-3 py-2.5">
                    {pick({ zh: "延迟", en: "Latency" })}
                  </th>
                  <th className="border border-white/10 px-3 py-2.5">
                    {pick({ zh: "备注", en: "Note" })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02]">
                    <td className="border border-white/10 px-3 py-2 font-mono text-xs">
                      {row.keyMasked}
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-xs capitalize">
                      {row.provider}
                    </td>
                    <td className="border border-white/10 px-3 py-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          STATUS_STYLE[row.status],
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className="border border-white/10 px-3 py-2 font-mono text-xs">
                      {row.httpStatus ?? "—"}
                    </td>
                    <td className="border border-white/10 px-3 py-2 font-mono text-xs">
                      {row.latencyMs != null ? `${row.latencyMs} ms` : "—"}
                    </td>
                    <td className="max-w-[12rem] truncate border border-white/10 px-3 py-2 text-xs text-muted">
                      {row.message ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        {pick({
          zh: "⚠️ 浏览器直连 API 可能受 CORS 限制；若大量显示「错误」，请使用代理或在服务端测试。Key 不会离开本机，但仍请勿在公共设备上使用。",
          en: "⚠️ Direct browser calls may hit CORS limits. Many errors? Use a proxy or server-side testing. Keys never leave your device — avoid public machines.",
        })}
      </div>
    </div>
  );
}
