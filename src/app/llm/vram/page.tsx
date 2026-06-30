import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { VramGuideView } from "@/components/tools/VramGuideView";

export const metadata: Metadata = {
  title: "显存需求说明",
  description:
    "显存与 LLM 模型配置对照表，帮助你选择合适的显卡运行 AI 模型。",
};

export default function VramGuidePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <VramGuideView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
