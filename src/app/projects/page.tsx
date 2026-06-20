import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ProjectsGrid, ProjectsSectionHeader } from "@/components/projects/ProjectsGrid";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
          <ProjectsSectionHeader />
          <ProjectsGrid />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
