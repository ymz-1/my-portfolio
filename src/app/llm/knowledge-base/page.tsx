import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { KnowledgeBaseView } from "@/components/tools/KnowledgeBaseView";

export const metadata: Metadata = {
  title: "AI 知识库助手",
  description:
    "上传 PDF，在浏览器本地完成语义检索与 RAG 问答演示，无需后端与 API Key。",
};

export default function KnowledgeBasePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <KnowledgeBaseView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
