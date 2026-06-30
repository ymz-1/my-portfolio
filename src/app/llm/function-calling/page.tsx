import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { FunctionCallingBuilderView } from "@/components/tools/FunctionCallingBuilderView";

export const metadata: Metadata = {
  title: "工具调用构建器",
  description:
    "可视化设计 AI Function Calling 工具 Schema，支持 OpenAI、Claude、LangChain 多格式导出。",
};

export default function FunctionCallingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <FunctionCallingBuilderView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
