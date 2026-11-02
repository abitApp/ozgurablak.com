"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ImagePlaceholder } from "@/components/work/ImagePlaceholder";
import { WorkCarousel } from "@/components/work/WorkCarousel";
import { faldiumProject } from "@/content/home";
import { otherWorksCategories } from "@/content/otherWorks";
import { useCaseStudyDeepLink } from "@/hooks/useCaseStudyDeepLink";

const OtherWorksSlider = dynamic(
  () =>
    import("@/components/home/OtherWorksSlider").then((mod) => mod.OtherWorksSlider),
  {
    loading: () => (
      <div
        className="min-h-[28rem] rounded-[1.35rem] border border-line/60 bg-ink/[0.03]"
        aria-hidden
      />
    ),
  },
);

const CaseStudyPopup = dynamic(
  () =>
    import("@/components/work/CaseStudyPopup").then((mod) => mod.CaseStudyPopup),
  { ssr: false },
);

const FALDIUM_MODAL_FADE_MS = 320;

export function SelectedWorkPreview() {
  const [faldiumOpen, setFaldiumOpen] = useState(false);
  const [faldiumMounted, setFaldiumMounted] = useState(false);
  const faldiumDeepLink = useCaseStudyDeepLink(faldiumProject.slug);
  const faldiumVisible = faldiumOpen || faldiumDeepLink.openFromLink;

  useEffect(() => {
    if (faldiumVisible) {
      setFaldiumMounted(true);
      return;
    }
    if (!faldiumMounted) return;
    const timer = window.setTimeout(
      () => setFaldiumMounted(false),
      FALDIUM_MODAL_FADE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [faldiumVisible, faldiumMounted]);

  return (
    <section
      className="bg-surface px-5 pt-20 pb-0 text-ink md:px-8 md:pt-28 md:pb-0"
      aria-labelledby="work-heading"
    >
      <div
        id="work"
        className="mx-auto max-w-[72rem] scroll-mt-24 md:scroll-mt-28"
      >
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="work-heading"
            className="text-[clamp(1.5rem,calc(2.5vw+1rem),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
          >
            Selected Works
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            A selection of work from Vodafone, METRO Markets GmbH and
            sahibinden.com, along with{" "}
            <a
              href="#my-products"
              className="border-b border-current pb-px transition-colors hover:text-ink"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("my-products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Faldium
            </a>
            , my own project.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[calc(72rem+7rem)] px-5 md:px-8">
        <WorkCarousel />
      </div>

      <div
        id="my-products"
        className="mx-auto mt-20 max-w-[72rem] scroll-mt-24 md:mt-28 md:scroll-mt-28"
      >
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="my-products-heading"
            className="text-[clamp(1.5rem,calc(2.5vw+1rem),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
          >
            My Products
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            Products I designed, built and launched on my own.
          </p>
        </div>

        <article className="overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 gap-8 p-6 pb-0 md:grid-cols-[1.2fr_0.8fr] md:gap-10 md:p-8 md:pb-0 md:pr-0">
            <div className="flex min-w-0 flex-col pb-6 md:pb-8">
              <h3 className="text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-tight text-ink">
                Faldium
              </h3>
              <p className="mt-1.5 text-[0.95rem] leading-snug text-ink-muted">
                AI companion & fortune telling app
              </p>

              <dl className="mt-6 space-y-3 text-[0.88rem] leading-snug">
                <div>
                  <dt className="text-ink-muted">My role</dt>
                  <dd className="mt-1 text-ink/90">
                    End to end, from strategy and UX/UI to development, AI
                    experience design, backend and launch, plus the Google Ads
                    campaigns I set up and run.
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Built with</dt>
                  <dd className="mt-1 text-ink/90">
                    FlutterFlow, Supabase, Firebase, Google Analytics and AI
                    prompt workflows.
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Status</dt>
                  <dd className="mt-1 text-ink/90">
                    Live on Google Play, in Turkish. Nearly 5,000 downloads, 4.6
                    rating (23 ratings), users in 20+ countries.
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setFaldiumOpen(true)}
                className="mt-7 inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border border-ink/40 px-5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:bg-accent hover:text-[#0c0907]"
              >
                View project
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="min-w-0 self-end">
              <div className="ml-auto w-[85%] opacity-70 md:-translate-x-10">
                <ImagePlaceholder
                  id="faldium-card"
                  description="Faldium app screens"
                  aspectRatio="819/1024"
                  src="/media/projects/faldium/faldium-card-v7.png?v=20261102c"
                  alt="Faldium app on phone — home screen with coffee reading, dreams and palmistry."
                  unoptimized
                  objectFit="cover"
                  framed={false}
                  roundedClassName="rounded-none"
                  backgroundClassName="bg-transparent"
                />
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mx-auto mt-20 max-w-[72rem] md:mt-28">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="other-works-heading"
            className="text-[clamp(1.5rem,calc(2.5vw+1rem),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
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

      {faldiumMounted ? (
        <CaseStudyPopup
          project={faldiumProject}
          open={faldiumVisible}
          initialSectionId={faldiumDeepLink.initialSectionId}
          onClose={() => {
            setFaldiumOpen(false);
            faldiumDeepLink.clearLink();
          }}
        />
      ) : null}
    </section>
  );
}
