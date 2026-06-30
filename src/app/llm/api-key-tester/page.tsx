import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ApiKeyTesterView } from "@/components/tools/ApiKeyTesterView";

export const metadata: Metadata = {
  title: "API Key 批量测试",
  description:
    "批量验证 OpenAI / Anthropic API Key 有效性，统计延迟与限流状态，纯前端运行。",
};

export default function ApiKeyTesterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <ApiKeyTesterView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
