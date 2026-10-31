import { motto } from "@/lib/fonts";
import { HeroMedia } from "@/components/home/HeroMedia";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/[0.08] bg-[#0c0907] text-white/90"
      aria-labelledby="hero-heading"
    >
      <HeroMedia />

      {/* Flat scrim — LOCKED at 0.45; never change unless Özgür sets a new value */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        aria-hidden="true"
      />
      <div className="hero-overlay absolute inset-0 z-[1]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[72rem] flex-col justify-end px-5 pb-20 pt-24 md:justify-center md:px-8 md:pb-28 md:pt-20 md:-translate-y-4">
        <div className="max-w-[20rem] sm:max-w-[28rem] md:max-w-[38rem] lg:max-w-[44rem]">
          <div className="-translate-y-[60px]">
            <h1
              id="hero-heading"
              className={`${motto.className} text-[clamp(calc(1.85rem-2pt),calc(4.8vw-2pt),calc(3.75rem-2pt))] font-bold leading-[1.28] tracking-[-0.02em] text-white/90`}
            >
              The Man Who Changed
              <br />
              the Design World.
            </h1>

            <p className="mt-[10px] text-[clamp(1.15rem,2.4vw,1.75rem)] font-light italic leading-snug text-white/50 md:mt-[14px]">
              Or at least{" "}
              <span className="tried-wave font-medium text-white/90">tried</span>{" "}
              to.
            </p>
          </div>

          <a
            href="#work"
            className="mt-12 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-6 text-xs tracking-[0.16em] text-white/85 uppercase transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white/90 md:mt-14"
          >
            Selected works
            <svg
              className="size-3.5 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 6.25 8 10.75l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
