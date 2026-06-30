import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ContextWindowCheckerView } from "@/components/tools/ContextWindowCheckerView";

export const metadata: Metadata = {
  title: "上下文窗口检查器",
  description:
    "检查 Prompt 是否超出模型上下文窗口，实时显示已用 token、剩余空间与参考表。",
};

export default function ContextWindowPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <ContextWindowCheckerView />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
