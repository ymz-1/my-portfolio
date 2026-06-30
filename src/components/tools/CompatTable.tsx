import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CompatCell } from "@/lib/llm/vram-guide";
import { MODEL_SIZES } from "@/lib/llm/vram-guide";

function Cell({ cell }: { cell: CompatCell }) {
  return (
    <td
      className={cn(
        "min-w-[4.5rem] border border-white/10 px-1.5 py-2 text-center text-[11px] leading-tight",
        cell.status === "good" && "bg-emerald-500/15 text-emerald-200",
        cell.status === "warn" && "bg-amber-500/15 text-amber-200",
        cell.status === "bad" && "bg-red-500/15 text-red-300 font-semibold",
      )}
    >
      {cell.text ? (
        cell.text
      ) : (
        <>
          <div className="font-medium">{cell.precision}</div>
          <div className="mt-0.5 text-[10px] opacity-90">{cell.vram}</div>
        </>
      )}
    </td>
  );
}

type Props = {
  title: string;
  children: ReactNode;
};

export function CompatTableSection({ title, children }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-surface/40 overflow-hidden">
      <h2 className="border-b border-white/10 px-4 py-3 text-base font-semibold sm:px-6">
        {title}
      </h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function ModelSizeHeaderRow({
  leadingColumns,
}: {
  leadingColumns: ReactNode;
}) {
  return (
    <tr className="bg-white/5 text-xs text-muted">
      {leadingColumns}
      {MODEL_SIZES.map((size) => (
        <th
          key={size}
          className="min-w-[5.5rem] border border-white/10 px-2 py-2 text-center font-medium"
        >
          {size}
        </th>
      ))}
    </tr>
  );
}

export function CompatDataCells({ cells }: { cells: CompatCell[] }) {
  return (
    <>
      {cells.map((cell, index) => (
        <Cell key={index} cell={cell} />
      ))}
    </>
  );
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-6 rounded bg-emerald-500/20" />
        FP16 可运行
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-6 rounded bg-amber-500/20" />
        INT8 / INT4 量化
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-6 rounded bg-red-500/20" />
        不可运行 (X)
      </span>
    </div>
  );
}
