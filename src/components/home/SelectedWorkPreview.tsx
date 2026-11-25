"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ImagePlaceholder } from "@/components/work/ImagePlaceholder";
import { WorkCarousel } from "@/components/work/WorkCarousel";
import { faldiumCard, faldiumProject } from "@/content/home";
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
          <div className="p-6 md:p-8">
            <h3 className="text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-tight text-ink">
              Faldium
            </h3>
            <p className="mt-1.5 text-base leading-snug text-ink-muted">
              {faldiumCard.subtitle}
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-x-4 border-y border-line py-6 md:mt-8 md:grid-cols-4 md:py-7">
              {faldiumCard.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col items-center justify-between gap-2 text-center"
                >
                  <dt className="order-2 text-[0.8125rem] leading-snug text-ink-muted md:text-sm">
                    {metric.label}
                  </dt>
                  <dd className="order-1 text-[clamp(1.5rem,3.2vw,2rem)] font-medium leading-none tracking-tight text-ink">
                    {metric.value}
                  </dd>
                </div>
              ))}
              <div className="col-span-3 mt-5 flex flex-col items-center justify-between gap-2 text-center md:col-span-1 md:mt-0">
                <dt className="text-[clamp(1.5rem,3.2vw,2rem)] font-medium leading-none tracking-tight text-ink">
                  Status
                </dt>
                <dd className="flex items-center justify-center gap-2 text-[0.8125rem] leading-snug text-ink-muted md:text-sm">
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-emerald-400/70"
                    aria-hidden="true"
                  />
                  {faldiumCard.statusLabel}
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid grid-cols-1 items-start gap-8 text-[0.9375rem] leading-[1.55] md:mt-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[1fr_1fr_0.97fr]">
              <div>
                <h4 className="text-base font-normal text-ink-muted">
                  What I designed
                </h4>
                <ul className="mt-3 space-y-4 text-ink/90">
                  {faldiumCard.whatIDesigned.map((item) => (
                    <li key={item.lead}>
                      <strong className="font-medium text-ink">
                        {item.lead}
                      </strong>{" "}
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="space-y-5">
                <div>
                  <dt className="text-base text-ink-muted">My role</dt>
                  <dd className="mt-3 text-ink/90">{faldiumCard.role}</dd>
                </div>
                <div>
                  <dt className="text-base text-ink-muted">Built with</dt>
                  <dd className="mt-3 text-ink/90">{faldiumCard.builtWith}</dd>
                </div>
                <div>
                  <dt className="text-base text-ink-muted">Status</dt>
                  <dd className="mt-3 text-ink/90">{faldiumCard.statusNote}</dd>
                </div>
              </dl>

              {/* Phone: 3rd column from lg; hidden on smaller screens */}
              <div className="hidden min-w-0 opacity-70 lg:block lg:self-end">
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

            <div className="mt-6 flex flex-col gap-6 border-t border-line pt-6 md:mt-8 lg:mt-0 md:flex-row md:items-center md:justify-between md:gap-10 md:pt-7 lg:grid lg:grid-cols-[1fr_1fr_0.97fr] lg:justify-normal lg:gap-x-10">
              <ul
                className="flex min-w-0 flex-wrap gap-2 lg:col-span-2"
                aria-label="Skills"
              >
                {faldiumCard.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-ink/20 px-3 py-1.5 text-xs leading-none text-ink-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setFaldiumOpen(true)}
                className="inline-flex min-h-11 w-fit shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/40 px-5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:bg-accent hover:text-[#0c0907] lg:justify-self-center"
              >
                View project
                <span aria-hidden="true">→</span>
              </button>
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
