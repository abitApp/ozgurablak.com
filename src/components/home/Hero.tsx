"use client";

import { motto } from "@/lib/fonts";
import { HeroMedia } from "@/components/home/HeroMedia";
import {
  HERO_SUPPORT_EMPHASIS,
  HERO_SUPPORT_MUTED,
  HERO_SUPPORT_TEXT_CLASS,
} from "@/content/home";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/[0.08] bg-[#0c0907] text-white/90"
      aria-labelledby="hero-heading"
    >
      <HeroMedia />

      {/* Flat scrim — LOCKED at 0.35; never change unless Özgür sets a new value */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
        aria-hidden="true"
      />
      <div className="hero-overlay absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Rabbit speech bubble removed (markup + styles in git history, commit def887b).
          Kept for later — YouTube scene link:
          https://youtu.be/QMnCnT3Rmco?t=197 ("Watch the original scene ↗") */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[calc(100%-2.5rem)] max-w-[72rem] flex-col justify-center pb-16 pt-28 md:w-[calc(100%-4rem)] md:pb-28 md:pt-20 md:-translate-y-4">
        <div className="max-w-[22.5rem] -translate-y-6 sm:max-w-[28rem] sm:-translate-y-8 md:max-w-[38rem] md:-translate-y-[60px] lg:max-w-[44rem]">
          <h1
            id="hero-heading"
            className={`${motto.className} text-[clamp(calc(2.35rem-2pt),calc(5.5vw+0.4rem),calc(3.75rem-2pt))] font-bold leading-[1.28] tracking-[-0.02em] text-white/90`}
          >
            The Man Who Changed
            <br />
            the Design World.
          </h1>

          <p
            className={`mt-[10px] ${HERO_SUPPORT_TEXT_CLASS} md:mt-[14px]`}
            style={{ color: HERO_SUPPORT_MUTED }}
          >
            According to the{" "}
            <span
              className="tried-wave font-medium"
              style={{ color: HERO_SUPPORT_EMPHASIS }}
            >
              rabbit
            </span>
            .
          </p>

          <p
            className="hidden mt-[30px] text-sm tracking-[0.14em] uppercase md:text-xs md:tracking-[0.16em]"
            style={{ color: "rgba(255, 255, 255, 0.65)" }}
          >
            Previously at Vodafone ·{" "}
            <br className="md:hidden" />
            METRO&nbsp;·&nbsp;sahibinden.com
          </p>
        </div>
      </div>
    </section>
  );
}
