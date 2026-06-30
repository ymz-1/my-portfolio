import type { PageText, TextChunk } from "./types";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 80;

export function chunkPages(pages: PageText[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  let globalIndex = 0;

  for (const { page, text } of pages) {
    if (!text.trim()) continue;

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + CHUNK_SIZE, text.length);
      const slice = text.slice(start, end).trim();
      if (slice.length > 0) {
        chunks.push({
          id: `chunk-${globalIndex++}`,
          page,
          text: slice,
          startChar: start,
        });
      }
      if (end >= text.length) break;
      start = Math.max(end - CHUNK_OVERLAP, start + 1);
    }
  }

  return chunks;
}
