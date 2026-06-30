import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ModelMatrixView } from "@/components/tools/ModelMatrixView";

export const metadata: Metadata = {
  title: "模型矩阵",
  description: "一览各服务商对主流 LLM 模型的支持状态与能力矩阵。",
};

export default function ModelMatrixPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <ModelMatrixView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
