const TIGHT_EMPHASIS =
  /\*\*([^*\n]+[。.!?])\*\*(?=[^\s\n])/g;

function parseFenceLine(line: string): { char: "`" | "~"; length: number } | null {
  const match = /^(`{3,}|~{3,})/.exec(line.trim());
  if (!match) return null;
  const fence = match[1];
  return { char: fence[0] as "`" | "~", length: fence.length };
}

function fixLine(line: string): string {
  return line.replace(TIGHT_EMPHASIS, "**$1** ");
}

/**
 * CommonMark requires a right-flanking delimiter after closing `**`.
 * Patterns like `**标题。**正文` (no space) fail to parse; insert a space after `**`.
 */
export function fixTightEmphasis(markdown: string): string {
  let inFence = false;
  let fenceChar: "`" | "~" | null = null;
  let fenceLength = 0;

  return markdown
    .split("\n")
    .map((line) => {
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
        return line;
      }

      if (inFence) return line;
      return fixLine(line);
    })
    .join("\n");
}
