import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public/tools/ai-article/index.html",
  );
  const html = readFileSync(filePath, "utf-8");

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
