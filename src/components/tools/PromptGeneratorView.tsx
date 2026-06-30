"use client";

import { useState } from "react";
import Link from "next/link";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  buildGeneratorMessages,
  generateLocalTemplate,
  purposeOptions,
  type PromptPurpose,
} from "@/lib/llm/prompt-generator";
import type { LoadProgress } from "@/lib/rag/types";
import {
  checkWebGpuSupport,
  isNetworkOrCacheError,
  streamChat,
} from "@/lib/rag/webllm-engine";
import { cn } from "@/lib/utils";

type GenerateMode = "local" | "ai";

export function PromptGeneratorView() {
  const { pick, lang } = useLanguage();
  const [purpose, setPurpose] = useState<PromptPurpose>("writing");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelProgress, setModelProgress] = useState<LoadProgress | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastMode, setLastMode] = useState<GenerateMode>("local");

  const runLocal = () => {
    setOutput(generateLocalTemplate(purpose, userInput, lang));
    setLastMode("local");
    setNotice(null);
    setError(null);
  };

  const handleGenerate = async (mode: GenerateMode) => {
    if (!userInput.trim()) return;

    if (mode === "local") {
      runLocal();
      return;
    }

    if (!checkWebGpuSupport()) {
      setError(
        pick({
          zh: "当前浏览器不支持 WebGPU，已改用快速生成。",
          en: "WebGPU unavailable — use quick generate instead.",
        }),
      );
      runLocal();
      return;
    }

    setError(null);
    setNotice(null);
    setOutput("");
    setIsGenerating(true);
    setModelProgress(null);

    try {
      const messages = buildGeneratorMessages(purpose, userInput, lang);
      let full = "";
      for await (const token of streamChat(messages, setModelProgress, 1536)) {
        full += token;
        setOutput(full);
      }
      setLastMode("ai");
    } catch (err) {
      if (isNetworkOrCacheError(err)) {
        runLocal();
        setNotice(
          pick({
            zh: "模型下载失败（网络或缓存受限），已自动使用离线模板生成。可检查网络/VPN 后重试「AI 生成」。",
            en: "Model download failed (network/cache). Fell back to offline template. Check network and retry AI generate.",
          }),
        );
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/15 via-surface/80 to-surface/40 px-6 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "Prompt 工具", en: "Prompt tools" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "Prompt 模板生成器", en: "Prompt Template Generator" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "选择用途并描述需求，快速生成结构化 Prompt 模板。支持离线即时生成，也可选用本地 AI 模型增强（首次需下载约 500MB）。",
            en: "Pick a use case and describe your need. Instant offline templates, or optional local AI enhancement (~500MB first download).",
          })}
        </p>
      </header>

      <section className="space-y-6 rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium">
            {pick({ zh: "1. 选择用途", en: "1. Choose purpose" })}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {purposeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPurpose(opt.id)}
                disabled={isGenerating}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-colors",
                  purpose === opt.id
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/10 bg-background/30 hover:border-white/20",
                )}
              >
                <p className="font-medium">{pick(opt.label)}</p>
                <p className="mt-1 text-xs text-muted">{pick(opt.description)}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">
            {pick({ zh: "2. 描述你的需求", en: "2. Describe your need" })}
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isGenerating}
            rows={5}
            placeholder={pick({
              zh: "例如：帮我写一份技术博客 Prompt，读者是初学者，语气友好，800 字左右…",
              en: "e.g. A tech blog prompt for beginners, friendly tone, ~800 words…",
            })}
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm leading-7 outline-none ring-brand/40 focus:ring-2 disabled:opacity-60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleGenerate("local")}
            disabled={isGenerating || !userInput.trim()}
            className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pick({ zh: "快速生成", en: "Quick generate" })}
          </button>
          <button
            type="button"
            onClick={() => void handleGenerate("ai")}
            disabled={isGenerating || !userInput.trim()}
            className="rounded-lg border border-white/15 px-5 py-2 text-sm transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            {isGenerating
              ? pick({ zh: "AI 生成中…", en: "AI generating…" })
              : pick({ zh: "AI 生成", en: "AI generate" })}
          </button>
        </div>

        {isGenerating && modelProgress && (
          <div>
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>
                {pick({
                  zh: "正在加载本地模型（首次约 500MB，需可访问 Hugging Face）…",
                  en: "Loading local model (~500MB, needs Hugging Face access)…",
                })}
              </span>
              <span>{modelProgress.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${modelProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {notice && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {notice}
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </section>

      {output && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface/50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold">
                {pick({ zh: "生成的模板", en: "Generated template" })}
              </h2>
              <p className="mt-0.5 text-[10px] text-muted">
                {lastMode === "ai"
                  ? pick({ zh: "由本地 AI 生成", en: "From local AI" })
                  : pick({ zh: "离线规则模板", en: "Offline rule template" })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="rounded-lg border border-white/15 px-3 py-1 text-xs transition-colors hover:bg-white/5"
            >
              {copied
                ? pick({ zh: "已复制", en: "Copied" })
                : pick({ zh: "复制 Markdown", en: "Copy Markdown" })}
            </button>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <ArticleMarkdown content={output} />
          </div>
        </section>
      )}

      <p className="mt-6 text-center text-[11px] text-muted">
        {pick({
          zh: "「快速生成」无需联网。「AI 生成」在浏览器本地运行，模型从 Hugging Face 下载，国内网络可能不稳定。",
          en: "Quick generate works offline. AI generate runs locally but downloads from Hugging Face — may be unstable in some regions.",
        })}
      </p>
    </div>
  );
}
