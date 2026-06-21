import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ArticleReader } from "@/components/articles/ArticleReader";
import {
  articleCategories,
  getArticle,
  getCategorySlugs,
  type ArticleCategory,
} from "@/content/articles";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

function parseCategory(value: string): ArticleCategory | null {
  if (value === "stories" || value === "notes") return value;
  return null;
}

export function generateStaticParams() {
  return articleCategories.flatMap((category) =>
    getCategorySlugs(category).map((slug) => ({ category, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: rawCategory, slug } = await params;
  const category = parseCategory(rawCategory);
  if (!category) return {};

  const article = getArticle(category, slug);
  if (!article) return {};

  return {
    title: article.title.zh,
    description: article.body.zh.slice(0, 120),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category: rawCategory, slug } = await params;
  const category = parseCategory(rawCategory);
  if (!category) notFound();

  const article = getArticle(category, slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <ArticleReader category={category} article={article} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
