import { WorkCarousel } from "@/components/work/WorkCarousel";
import { OtherWorksSlider } from "@/components/home/OtherWorksSlider";
import { otherWorksCategories } from "@/content/otherWorks";

export function SelectedWorkPreview() {
  return (
    <section
      className="bg-surface px-5 py-20 text-ink md:px-8 md:py-28"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-[72rem]">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="work-heading"
            className="text-[clamp(calc(2rem-12pt),calc(4vw-12pt),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
          >
            Selected Project
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            A selection of work from Vodafone, METRO Markets GmbH and
            sahibinden.com, along with Faldium, my own project.
          </p>
        </div>
      </div>

      <div
        id="work"
        className="mx-auto w-full max-w-[calc(72rem+7rem)] scroll-mt-24 px-5 md:scroll-mt-28 md:px-8"
      >
        <WorkCarousel />
      </div>

      <div className="mx-auto mt-20 max-w-[72rem] md:mt-28">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="other-works-heading"
            className="text-[clamp(calc(2rem-12pt),calc(4vw-12pt),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
          >
            Other Works
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            Product concepts, UI animations and 3D work that sit outside the case
            studies. Each card holds a small collection: use the arrows to
            browse.
          </p>
        </div>

        <OtherWorksSlider categories={otherWorksCategories} />
      </div>
    </section>
  );
}
