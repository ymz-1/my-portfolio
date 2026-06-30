import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { LlmBudgetCalculator } from "@/components/tools/LlmBudgetCalculator";

export const metadata: Metadata = {
  title: "LLM 预算计算器",
  description:
    "选定模型对比各服务商/reseller 定价，支持场景预设、用量配置与 VS 官方折扣分析。",
};

export default function LlmPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <LlmBudgetCalculator />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
