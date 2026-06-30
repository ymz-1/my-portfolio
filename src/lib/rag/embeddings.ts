import type { IndexedChunk, SearchResult, TextChunk } from "./types";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

type EmbeddingPipeline = (
  text: string,
  options?: { pooling: "mean"; normalize: boolean },
) => Promise<{ data: Float32Array | number[] }>;

let pipelinePromise: Promise<EmbeddingPipeline> | null = null;

async function getPipeline(): Promise<EmbeddingPipeline> {
  if (!pipelinePromise) {
    pipelinePromise = import("@xenova/transformers").then(({ pipeline }) =>
      pipeline("feature-extraction", EMBEDDING_MODEL, {
        quantized: true,
      }) as Promise<EmbeddingPipeline>,
    );
  }
  return pipelinePromise;
}

function toVector(data: Float32Array | number[]): number[] {
  return Array.from(data);
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getPipeline();
  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return toVector(output.data);
}

export async function indexChunks(
  chunks: TextChunk[],
  onProgress?: (current: number, total: number) => void,
): Promise<IndexedChunk[]> {
  const indexed: IndexedChunk[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk.text);
    indexed.push({ ...chunk, embedding });
    onProgress?.(i + 1, chunks.length);
  }
  return indexed;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export async function searchChunks(
  query: string,
  indexed: IndexedChunk[],
  topK = 4,
): Promise<SearchResult[]> {
  if (indexed.length === 0) return [];

  const queryEmbedding = await embedText(query);
  const scored = indexed.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk, score }) => ({
      chunk: {
        id: chunk.id,
        page: chunk.page,
        text: chunk.text,
        startChar: chunk.startChar,
      },
      score,
    }));
}

export function preloadEmbeddingModel(): void {
  void getPipeline();
}
