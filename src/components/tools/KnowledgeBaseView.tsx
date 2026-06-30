"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { chunkPages } from "@/lib/rag/chunk";
import { indexChunks, searchChunks } from "@/lib/rag/embeddings";
import {
  extractTextFromPdf,
  validatePdfFile,
} from "@/lib/rag/pdf-extract";
import { buildRagPrompt } from "@/lib/rag/prompt";
import type { LoadProgress, RagIndex, SearchResult } from "@/lib/rag/types";
import {
  checkWebGpuSupport,
  streamAnswer,
} from "@/lib/rag/webllm-engine";
import { cn } from "@/lib/utils";

type Phase =
  | "idle"
  | "parsing"
  | "indexing"
  | "ready"
  | "loading-model"
  | "answering"
  | "error";

export function KnowledgeBaseView() {
  const { pick, lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const [index, setIndex] = useState<RagIndex | null>(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [modelProgress, setModelProgress] = useState<LoadProgress | null>(
    null,
  );

  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validation = validatePdfFile(file);
      if (validation) {
        setError(
          pick({
            zh: validation.includes("PDF") ? "请上传 PDF 文件" : "文件超过 10 MB 限制",
            en: validation,
          }),
        );
        setPhase("error");
        return;
      }

      setFileName(file.name);
      setPhase("parsing");
      setProgress(0);
      setProgressLabel(pick({ zh: "正在解析 PDF…", en: "Parsing PDF…" }));
      setAnswer("");
      setResults([]);
      setQuery("");

      try {
        const buffer = await file.arrayBuffer();
        const { pages, pageCount: pagesTotal } = await extractTextFromPdf(
          buffer,
          (current, total) => {
            setProgress(Math.round((current / total) * 100));
          },
        );

        if (pages.length === 0) {
          throw new Error(
            pick({
              zh: "未能从 PDF 提取文字，请使用可选中文字的 PDF（不支持扫描件）",
              en: "No extractable text found. Use a text-based PDF (scanned images are not supported).",
            }),
          );
        }

        setPageCount(pagesTotal);
        const chunks = chunkPages(pages);
        setChunkCount(chunks.length);

        setPhase("indexing");
        setProgress(0);
        setProgressLabel(
          pick({ zh: "正在建立语义索引…", en: "Building semantic index…" }),
        );

        const indexed = await indexChunks(chunks, (current, total) => {
          setProgress(Math.round((current / total) * 100));
        });

        setIndex({ fileName: file.name, pageCount: pagesTotal, chunks: indexed });
        setPhase("ready");
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setPhase("error");
      }
    },
    [pick],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void processFile(file);
  };

  const handleAsk = async () => {
    if (!index || !query.trim()) return;

    if (!checkWebGpuSupport()) {
      setError(
        pick({
          zh: "当前浏览器不支持 WebGPU，请使用 Chrome / Edge 113+ 并启用 WebGPU",
          en: "WebGPU is unavailable. Use Chrome / Edge 113+ with WebGPU enabled.",
        }),
      );
      return;
    }

    setError(null);
    setAnswer("");
    setResults([]);
    setPhase("loading-model");
    setModelProgress(null);

    try {
      const hits = await searchChunks(query.trim(), index.chunks);
      setResults(hits);

      if (hits.length === 0) {
        setAnswer(
          pick({
            zh: "未找到相关内容，请尝试换一种问法。",
            en: "No relevant passages found. Try rephrasing your question.",
          }),
        );
        setPhase("ready");
        return;
      }

      const prompt = buildRagPrompt(query.trim(), hits, lang);
      setPhase("answering");

      let full = "";
      for await (const token of streamAnswer(prompt, setModelProgress)) {
        full += token;
        setAnswer(full);
      }

      setPhase("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("ready");
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setError(null);
    setFileName(null);
    setPageCount(0);
    setChunkCount(0);
    setProgress(0);
    setIndex(null);
    setQuery("");
    setAnswer("");
    setResults([]);
    setModelProgress(null);
  };

  const canAsk = phase === "ready" || phase === "answering";
  const isBusy =
    phase === "parsing" ||
    phase === "indexing" ||
    phase === "loading-model" ||
    phase === "answering";

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
          {pick({ zh: "RAG 演示", en: "RAG Demo" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "AI 知识库助手", en: "AI Knowledge Base" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "上传 PDF，在浏览器本地完成语义检索与问答。文件不上传服务器，首次问答需下载约 500MB 的 Qwen2.5-0.5B 模型。",
            en: "Upload a PDF for local semantic search and Q&A in your browser. Files never leave your device. First question downloads ~500MB Qwen2.5-0.5B model.",
          })}
        </p>
      </header>

      {/* Upload */}
      <section className="rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {phase === "idle" || phase === "error" ? (
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
              dragOver
                ? "border-brand/50 bg-brand/10"
                : "border-white/15 bg-background/30 hover:border-brand/30 hover:bg-brand/5",
            )}
          >
            <p className="text-base font-medium">
              {pick({ zh: "拖拽或点击上传 PDF", en: "Drag & drop or click to upload PDF" })}
            </p>
            <p className="mt-2 text-xs text-muted">
              {pick({
                zh: "≤ 10 MB · ≤ 30 页 · 仅支持可选中文字的 PDF",
                en: "≤ 10 MB · ≤ 30 pages · Text-based PDFs only",
              })}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="mt-1 text-xs text-muted">
                {pageCount}{" "}
                {pick({ zh: "页", en: "pages" })} · {chunkCount}{" "}
                {pick({ zh: "个片段", en: "chunks" })}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={isBusy}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              {pick({ zh: "重新上传", en: "Upload another" })}
            </button>
          </div>
        )}

        {(phase === "parsing" || phase === "indexing") && (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>{progressLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </section>

      {/* Q&A */}
      {index && (
        <section className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
          <div>
            <label className="text-sm font-medium">
              {pick({ zh: "你的问题", en: "Your question" })}
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              disabled={!canAsk || isBusy}
              placeholder={pick({
                zh: "例如：文档的主要内容是什么？",
                en: "e.g. What is the main topic of this document?",
              })}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm leading-7 outline-none ring-brand/40 focus:ring-2 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={!canAsk || isBusy || !query.trim()}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {phase === "loading-model" || phase === "answering"
                ? pick({ zh: "处理中…", en: "Working…" })
                : pick({ zh: "搜索 / 提问", en: "Search / Ask" })}
            </button>
            {!checkWebGpuSupport() && (
              <span className="text-xs text-amber-300">
                {pick({ zh: "需要 WebGPU 支持", en: "WebGPU required" })}
              </span>
            )}
          </div>

          {phase === "loading-model" && modelProgress && (
            <div>
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>
                  {pick({
                    zh: "正在加载 Qwen2.5-0.5B 模型…",
                    en: "Loading Qwen2.5-0.5B model…",
                  })}
                </span>
                <span>{modelProgress.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${modelProgress.progress}%` }}
                />
              </div>
              {modelProgress.text && (
                <p className="mt-1 truncate text-[10px] text-muted">
                  {modelProgress.text}
                </p>
              )}
            </div>
          )}

          {answer && (
            <div className="rounded-xl border border-white/10 bg-background/40 p-4">
              <h2 className="text-sm font-semibold text-brand">
                {pick({ zh: "AI 回答", en: "AI answer" })}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {answer}
                {phase === "answering" && (
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-brand" />
                )}
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">
                {pick({ zh: "相关段落", en: "Relevant passages" })}
              </h2>
              <ul className="space-y-3">
                {results.map((r) => (
                  <li
                    key={r.chunk.id}
                    className="rounded-xl border border-white/10 bg-surface/40 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded bg-brand/15 px-2 py-0.5 text-brand">
                        {pick({ zh: `第 ${r.chunk.page} 页`, en: `Page ${r.chunk.page}` })}
                      </span>
                      <span className="text-muted">
                        {pick({ zh: "相似度", en: "Score" })}{" "}
                        {(r.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">
                      {r.chunk.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="mt-6 rounded-xl border border-brand/20 bg-brand/10 px-4 py-3 text-sm text-brand-100">
        {pick({
          zh: "🔒 所有 PDF 解析、向量索引与大模型推理均在浏览器本地完成，不会上传到任何服务器。",
          en: "🔒 PDF parsing, embedding index, and LLM inference all run locally — nothing is uploaded.",
        })}
      </div>
    </div>
  );
}
