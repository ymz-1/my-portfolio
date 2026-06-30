import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { PromptGeneratorView } from "@/components/tools/PromptGeneratorView";

export const metadata: Metadata = {
  title: "Prompt 模板生成器",
  description:
    "选择写作、编程或分析用途，由本地大模型生成结构化 Prompt 模板。",
};

export default function PromptGeneratorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <PromptGeneratorView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
