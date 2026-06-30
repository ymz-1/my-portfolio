import type { PageText } from "./types";
import { PDF_LIMITS } from "./types";

export function configurePdfWorker(): string {
  return "/pdf.worker.min.mjs";
}

export async function extractTextFromPdf(
  data: ArrayBuffer,
  onProgress?: (current: number, total: number) => void,
): Promise<{ pages: PageText[]; pageCount: number }> {
  const pdfjs = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = configurePdfWorker();
  }

  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;

  if (pdf.numPages > PDF_LIMITS.maxPages) {
    throw new Error(
      `PDF exceeds ${PDF_LIMITS.maxPages} page limit (has ${pdf.numPages} pages)`,
    );
  }

  const pages: PageText[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text) {
      pages.push({ page: pageNum, text });
    }

    onProgress?.(pageNum, pdf.numPages);
  }

  return { pages, pageCount: pdf.numPages };
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Please upload a PDF file.";
  }
  if (file.size > PDF_LIMITS.maxBytes) {
    return `File exceeds ${PDF_LIMITS.maxBytes / (1024 * 1024)} MB limit.`;
  }
  return null;
}
