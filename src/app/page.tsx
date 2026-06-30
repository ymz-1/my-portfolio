import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { GadgetHub } from "@/components/sections/GadgetHub";
import { ArticleList } from "@/components/sections/ArticleList";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <ArticleList />
        <GadgetHub />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
