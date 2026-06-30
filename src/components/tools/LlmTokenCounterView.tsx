"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage, type Localized } from "@/lib/i18n/LanguageProvider";
import {
  countTokensForModel,
  getModelById,
  segmentText,
  tokenCounterFaqs,
  tokenCounterModels,
} from "@/lib/llm/token-counter";
import { cn } from "@/lib/utils";

const DEFAULT_PROMPT = `请帮我写一篇 Devlog，记录这周独立开发一个 AI 小工具的过程：
1. 本周完成了哪些功能
2. 遇到的主要技术难点
3. 下周计划
要求语气真诚、简洁，800 字左右。`;

const SEGMENT_COLORS = [
  "bg-brand/25 text-brand-100",
  "bg-emerald-500/20 text-emerald-100",
  "bg-amber-500/20 text-amber-100",
  "bg-sky-500/20 text-sky-100",
  "bg-rose-500/20 text-rose-100",
];

type SectionId = "about" | "faq" | "related";

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-background/40 px-4 py-3 text-center">
      <p className="font-mono text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export function LlmTokenCounterView() {
  const { pick } = useLanguage();
  const [modelId, setModelId] = useState(tokenCounterModels[0].id);
  const [text, setText] = useState(DEFAULT_PROMPT);
  const [showTokenIds, setShowTokenIds] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    tokenCounterFaqs[0].id,
  );

  const model = useMemo(() => getModelById(modelId), [modelId]);

  const stats = useMemo(
    () => countTokensForModel(text, model),
    [text, model],
  );

  const segments = useMemo(
    () => segmentText(text, model),
    [text, model],
  );

  const badgeLabel = model.precise
    ? pick({ zh: "较精确", en: "Tighter estimate" })
    : pick({ zh: "估算", en: "Estimate" });

  const sections: { id: SectionId; label: Localized }[] = [
    { id: "about", label: { zh: "关于此工具", en: "About" } },
    { id: "faq", label: { zh: "常见问题", en: "FAQ" } },
    { id: "related", label: { zh: "相关工具", en: "Related tools" } },
  ];

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
          {pick({ zh: "在线工具", en: "Online tool" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "LLM Token 计数器", en: "LLM Token Counter" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "统计 GPT、Claude、Gemini、DeepSeek、Qwen 和 Llama 等模型的 Token 用量。OpenAI 模型计数较精确，其它模型为估算。所有处理均在浏览器本地完成。",
            en: "Count tokens for GPT, Claude, Gemini, DeepSeek, Qwen, and Llama. OpenAI models use a tighter estimate; others are approximate. All processing runs locally in your browser.",
          })}
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-surface/50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">
            {pick({ zh: "模型", en: "Model" })}
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="min-w-[12rem] rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none ring-brand/40 focus:ring-2"
          >
            {tokenCounterModels.map((m) => (
              <option key={m.id} value={m.id}>
                {pick(m.name)}
              </option>
            ))}
          </select>
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-200">
            {badgeLabel} ·{" "}
            {pick({
              zh: `约 ${model.charsPerToken} 字符/token`,
              en: `~${model.charsPerToken} chars/token`,
            })}
          </span>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium">
            {pick({ zh: "您的提示词", en: "Your prompt" })}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={pick({
              zh: "在此粘贴或输入文本…",
              en: "Paste or type text here…",
            })}
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm leading-7 text-foreground outline-none ring-brand/40 focus:ring-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setText("")}
            className="rounded-lg border border-white/15 px-4 py-1.5 text-sm transition-colors hover:bg-white/5"
          >
            {pick({ zh: "清除", en: "Clear" })}
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            {pick({ zh: "本地处理", en: "Local processing" })}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Token" value={stats.tokens.toLocaleString()} />
          <StatBox
            label={pick({ zh: "字符", en: "Characters" })}
            value={stats.characters.toLocaleString()}
          />
          <StatBox
            label={pick({ zh: "词数", en: "Words" })}
            value={stats.words.toLocaleString()}
          />
          <StatBox
            label={pick({ zh: "Token / 词", en: "Token / word" })}
            value={stats.tokensPerWord.toFixed(2)}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">
              {pick({ zh: "Token 切分", en: "Token segmentation" })}
            </h2>
            <button
              type="button"
              onClick={() => setShowTokenIds((v) => !v)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                showTokenIds
                  ? "bg-brand/20 text-brand"
                  : "text-muted hover:text-foreground",
              )}
            >
              {pick({ zh: "显示 token ID", en: "Show token IDs" })}
            </button>
          </div>
          <div className="mt-3 min-h-[4rem] rounded-xl border border-white/10 bg-background/40 p-4 text-sm leading-8">
            {segments.length === 0 ? (
              <span className="text-muted">
                {pick({ zh: "输入文本后显示切分", en: "Enter text to see segments" })}
              </span>
            ) : (
              segments.map((seg, i) => (
                <span
                  key={`${seg.tokenId}-${i}`}
                  className={cn(
                    "mr-0.5 inline rounded px-0.5",
                    SEGMENT_COLORS[seg.tokenId % SEGMENT_COLORS.length],
                  )}
                  title={
                    showTokenIds
                      ? `#${seg.tokenId}`
                      : pick({ zh: "Token 片段", en: "Token segment" })
                  }
                >
                  {showTokenIds && (
                    <span className="mr-0.5 font-mono text-[10px] opacity-70">
                      {seg.tokenId}
                    </span>
                  )}
                  {seg.text}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[11rem_1fr]">
        <nav className="space-y-1">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            {pick({ zh: "本页内容", en: "On this page" })}
          </p>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeSection === s.id
                  ? "bg-brand/15 text-brand"
                  : "text-muted hover:bg-white/5 hover:text-foreground",
              )}
            >
              {pick(s.label)}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-6">
          {activeSection === "about" && (
            <section className="space-y-4 text-sm leading-relaxed text-muted">
              <h2 className="text-lg font-semibold text-foreground">
                {pick({ zh: "关于此工具", en: "About this tool" })}
              </h2>
              <p>
                {pick({
                  zh: "大语言模型并不直接处理「字」或「词」，而是先将文本切分为 token 序列。不同模型的分词器差异会导致同一文本的 token 数不同，这直接影响 API 计费与上下文窗口占用。",
                  en: "LLMs don't read raw characters or words — text is split into token sequences first. Different tokenizers change counts, which affects API billing and context window usage.",
                })}
              </p>
              <p>
                {pick({
                  zh: "本工具帮助你在发送请求前快速了解文本规模。选择目标模型后输入 Prompt，即可查看 token 总数、字符/词数统计，以及可视化的 token 切分结果。",
                  en: "Pick a target model, paste your prompt, and see token totals, character/word stats, and a visual segmentation — before you send anything.",
                })}
              </p>
              <div className="rounded-xl border border-brand/20 bg-brand/10 px-4 py-3 text-sm text-brand-100">
                {pick({
                  zh: "🔒 文本仅在浏览器本地处理，不会上传到服务器。",
                  en: "🔒 Text is processed locally in your browser — nothing is uploaded.",
                })}
              </div>
            </section>
          )}

          {activeSection === "faq" && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                {pick({ zh: "常见问题", en: "FAQ" })}
              </h2>
              <div className="space-y-2">
                {tokenCounterFaqs.map((faq) => {
                  const open = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="overflow-hidden rounded-xl border border-white/10 bg-surface/40"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqId(open ? null : faq.id)
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium"
                      >
                        {pick(faq.question)}
                        <span className="text-muted">{open ? "−" : "+"}</span>
                      </button>
                      {open && (
                        <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-muted">
                          {pick(faq.answer)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeSection === "related" && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                {pick({ zh: "相关工具", en: "Related tools" })}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/llm/"
                    className="block rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-sm transition-colors hover:border-brand/30 hover:bg-brand/5"
                  >
                    <span className="font-medium text-foreground">
                      {pick({ zh: "LLM 预算计算器", en: "LLM Budget Calculator" })}
                    </span>
                    <p className="mt-1 text-muted">
                      {pick({
                        zh: "对比各服务商定价，估算月度 API 成本",
                        en: "Compare provider pricing and estimate monthly API costs",
                      })}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/llm/knowledge-base/"
                    className="block rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-sm transition-colors hover:border-brand/30 hover:bg-brand/5"
                  >
                    <span className="font-medium text-foreground">
                      {pick({ zh: "AI 知识库助手", en: "AI Knowledge Base" })}
                    </span>
                    <p className="mt-1 text-muted">
                      {pick({
                        zh: "上传 PDF，本地语义检索与大模型问答",
                        en: "Upload PDF for local semantic search and Q&A",
                      })}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/llm/vram/"
                    className="block rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-sm transition-colors hover:border-brand/30 hover:bg-brand/5"
                  >
                    <span className="font-medium text-foreground">
                      {pick({ zh: "显存需求说明", en: "VRAM Requirements Guide" })}
                    </span>
                    <p className="mt-1 text-muted">
                      {pick({
                        zh: "查看各规格模型所需的 GPU 显存",
                        en: "See GPU VRAM requirements by model size",
                      })}
                    </p>
                  </Link>
                </li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
