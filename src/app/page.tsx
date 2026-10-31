import { AboutMe } from "@/components/home/AboutMe";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { SelectedWorkPreview } from "@/components/home/SelectedWorkPreview";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <SelectedWorkPreview />
      <AboutMe />
      <Contact />
      <footer className="border-t border-line bg-surface px-5 py-10 text-ink md:px-8">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-3 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>Özgür Ablak · Product Design</p>
          <p>© {new Date().getFullYear()} Özgür Ablak. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
