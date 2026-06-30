import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { LlmTokenCounterView } from "@/components/tools/LlmTokenCounterView";

export const metadata: Metadata = {
  title: "LLM Token 计数器",
  description:
    "统计 GPT、Claude、Gemini、DeepSeek、Qwen 和 Llama 的 Token 用量，支持本地切分可视化。",
};

export default function LlmTokenCounterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <LlmTokenCounterView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
