"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  appleSiliconRows,
  nvidiaGpus,
  referenceFootnote,
  referenceNotes,
} from "@/lib/llm/vram-guide";
import {
  CompatDataCells,
  CompatTableSection,
  Legend,
  ModelSizeHeaderRow,
} from "@/components/tools/CompatTable";

export function VramGuideView() {
  const { pick, lang } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 border-b border-white/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "参考工具", en: "Reference" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "显存需求说明", en: "VRAM Requirements Guide" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "显存与 LLM 模型配置对照表，帮助你选择合适的显卡运行 AI 模型。",
            en: "VRAM vs LLM model size reference for choosing the right GPU or Apple chip.",
          })}
        </p>
        <div className="mt-4">
          <Legend />
        </div>
      </header>

      <div className="space-y-8">
        <CompatTableSection title={pick({ zh: "NVIDIA 显卡", en: "NVIDIA GPUs" })}>
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <ModelSizeHeaderRow
                leadingColumns={
                  <>
                    <th className="sticky left-0 z-10 min-w-[7.5rem] border border-white/10 bg-surface px-3 py-2 text-left font-medium">
                      {pick({ zh: "显卡型号", en: "GPU" })}
                    </th>
                    <th className="min-w-[3.5rem] border border-white/10 px-2 py-2 text-left font-medium">
                      {pick({ zh: "显存", en: "VRAM" })}
                    </th>
                  </>
                }
              />
            </thead>
            <tbody>
              {nvidiaGpus.map((row) => (
                <tr key={row.model} className="hover:bg-white/[0.02]">
                  <td className="sticky left-0 z-10 border border-white/10 bg-surface/95 px-3 py-2 font-medium">
                    {row.model}
                  </td>
                  <td className="border border-white/10 px-2 py-2 text-muted">
                    {row.vram}
                  </td>
                  <CompatDataCells cells={row.cells} />
                </tr>
              ))}
            </tbody>
          </table>
        </CompatTableSection>

        <CompatTableSection
          title={pick({ zh: "苹果 Silicon 芯片", en: "Apple Silicon" })}
        >
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <ModelSizeHeaderRow
                leadingColumns={
                  <>
                    <th className="sticky left-0 z-10 min-w-[5.5rem] border border-white/10 bg-surface px-3 py-2 text-left font-medium">
                      {pick({ zh: "芯片型号", en: "Chip" })}
                    </th>
                    <th className="min-w-[4rem] border border-white/10 px-2 py-2 text-left font-medium">
                      {pick({ zh: "GPU核心", en: "GPU cores" })}
                    </th>
                    <th className="min-w-[4.5rem] border border-white/10 px-2 py-2 text-left font-medium">
                      {pick({ zh: "统一内存", en: "Memory" })}
                    </th>
                  </>
                }
              />
            </thead>
            <tbody>
              {appleSiliconRows.map((row, index) => {
                const showChip =
                  index === 0 ||
                  appleSiliconRows[index - 1]?.chip !== row.chip;

                return (
                  <tr key={`${row.chip}-${row.memory}`} className="hover:bg-white/[0.02]">
                    {showChip ? (
                      <td
                        rowSpan={row.chipRowSpan}
                        className="sticky left-0 z-10 border border-white/10 bg-surface/95 px-3 py-2 align-top font-medium"
                      >
                        {row.chip}
                      </td>
                    ) : null}
                    {showChip ? (
                      <td
                        rowSpan={row.gpuCoresRowSpan}
                        className="border border-white/10 px-2 py-2 align-top text-muted"
                      >
                        {row.gpuCores}
                      </td>
                    ) : null}
                    <td className="border border-white/10 px-2 py-2 text-muted">
                      {row.memory}
                    </td>
                    <CompatDataCells cells={row.cells} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CompatTableSection>

        <section className="rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6">
          <h2 className="text-base font-semibold">
            {pick({ zh: "参考说明", en: "Reference notes" })}
          </h2>
          <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
            {referenceNotes[lang].map((note, index) => (
              <li key={note.title}>
                <span className="font-medium text-foreground">
                  {index + 1}. {note.title}
                </span>
                <p className="mt-1">{note.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted">{referenceFootnote[lang]}</p>
        </section>
      </div>
    </div>
  );
}
