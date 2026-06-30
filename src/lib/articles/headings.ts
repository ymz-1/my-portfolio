import type { ReactNode } from "react";

export type ArticleHeading = {
  level: number;
  text: string;
  id: string;
};

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\\([._\-])/g, "$1")
    .trim();
}

export function slugify(text: string): string {
  const cleaned = stripMarkdownInline(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "section";
}

function uniqueId(base: string, used: Map<string, number>): string {
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  if (count === 0) return base;
  return `${base}-${count}`;
}

function parseFenceLine(line: string): { char: "`" | "~"; length: number } | null {
  const match = /^(`{3,}|~{3,})/.exec(line.trim());
  if (!match) return null;
  const fence = match[1];
  return { char: fence[0] as "`" | "~", length: fence.length };
}

export function extractHeadings(markdown: string): ArticleHeading[] {
  const used = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  let inFence = false;
  let fenceChar: "`" | "~" | null = null;
  let fenceLength = 0;

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    const fence = parseFenceLine(trimmed);

    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceChar = fence.char;
        fenceLength = fence.length;
      } else if (fence.char === fenceChar && fence.length >= fenceLength) {
        inFence = false;
        fenceChar = null;
        fenceLength = 0;
      }
      continue;
    }

    if (inFence) continue;

    const match = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (!match) continue;

    const level = match[1].length;
    const text = stripMarkdownInline(match[2]);
    if (!text) continue;

    const id = uniqueId(slugify(text), used);
    headings.push({ level, text, id });
  }

  return headings;
}

export function headingTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(headingTextFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    const node = children as { props?: { children?: ReactNode } };
    return headingTextFromChildren(node.props?.children ?? "");
  }
  return "";
}
