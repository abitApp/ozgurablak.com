"use client";

import { useEffect, useState } from "react";
import { motto, sans } from "@/lib/fonts";
import { HeroMedia } from "@/components/home/HeroMedia";
import {
  HERO_BUBBLE_PREVIEW,
  HERO_RABBIT_BUBBLE_EVENT,
  HERO_RABBIT_BUBBLE_SYNC_EVENT,
  WORKS_GO_START_EVENT,
  type HeroRabbitBubbleSyncDetail,
} from "@/content/home";

export function Hero() {
  const [rabbitBubble, setRabbitBubble] = useState(HERO_BUBBLE_PREVIEW);
  const [bubblePaused, setBubblePaused] = useState(false);
  const [bubbleGen, setBubbleGen] = useState(0);

  useEffect(() => {
    if (HERO_BUBBLE_PREVIEW) {
      setRabbitBubble(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onCue = () => {
      if (reduced.matches) return;
      setBubblePaused(false);
      setBubbleGen((n) => n + 1);
      setRabbitBubble(true);
    };

    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<HeroRabbitBubbleSyncDetail>).detail;
      if (!detail) return;
      if (detail.elapsed === null) {
        setRabbitBubble(false);
        setBubblePaused(false);
        return;
      }
      if (reduced.matches) return;
      setRabbitBubble(true);
      setBubblePaused(detail.playing === false);
    };

    window.addEventListener(HERO_RABBIT_BUBBLE_EVENT, onCue);
    window.addEventListener(HERO_RABBIT_BUBBLE_SYNC_EVENT, onSync);
    return () => {
      window.removeEventListener(HERO_RABBIT_BUBBLE_EVENT, onCue);
      window.removeEventListener(HERO_RABBIT_BUBBLE_SYNC_EVENT, onSync);
    };
  }, []);

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

      {rabbitBubble ? (
        <>
          <div
            key={bubbleGen}
            className={`hero-rabbit-bubble${HERO_BUBBLE_PREVIEW ? " is-preview" : ""}${bubblePaused ? " is-paused" : ""}`}
            aria-hidden="true"
          >
            {/* Inline SVG — avoids late network paint where copy showed before the shape. */}
            <svg
              className="hero-rabbit-bubble-shape"
              viewBox="0 0 301 158"
              width={301}
              height={158}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M150.5 2C232.514 2 299 32.4446 299 70C299 107.555 232.514 138 150.5 138C126.844 138 104.479 135.466 84.6299 130.96L33.0293 155.114C31.4671 155.845 29.7737 154.388 30.2637 152.734L41.1465 116.005C16.8404 103.897 2 87.7428 2 70C2 32.4446 68.4857 2 150.5 2Z"
                fill="#542A17"
                fillOpacity="0.5"
                stroke="#623D2D"
                strokeWidth="1"
              />
            </svg>
            <span className={`${sans.className} hero-rabbit-bubble-text`}>
              Whoever put your design revolution
              <br />
              in the backlog, Özgür… he was the{" "}
              <span className="tried-wave">traitor</span>.
            </span>
          </div>
          <a
            className={`${sans.className} hero-rabbit-bubble-link`}
            href="https://youtu.be/QMnCnT3Rmco?t=197"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch the original scene ↗
          </a>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[72rem] flex-col justify-center px-5 pb-16 pt-28 md:px-8 md:pb-28 md:pt-20 md:-translate-y-4">
        <div className="max-w-[22.5rem] -translate-y-6 sm:max-w-[28rem] sm:-translate-y-8 md:max-w-[38rem] md:-translate-y-[60px] lg:max-w-[44rem]">
          <h1
            id="hero-heading"
            className={`${motto.className} text-[clamp(calc(2.35rem-2pt),calc(5.5vw+0.4rem),calc(3.75rem-2pt))] font-bold leading-[1.28] tracking-[-0.02em] text-white/90`}
          >
            The Man Who Changed
            <br />
            the Design World.
          </h1>

          <p className="mt-[10px] text-[clamp(1.1rem,2.4vw,1.75rem)] font-light italic leading-snug text-white/50 md:mt-[14px]">
            Or at least{" "}
            <span className="tried-wave font-medium text-white/90">tried</span>{" "}
            to.
          </p>

          <a
            href="#work"
            className="mt-12 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-6 text-sm tracking-[0.14em] text-white/85 uppercase transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white/90 md:mt-14 md:text-xs md:tracking-[0.16em]"
            onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(new Event(WORKS_GO_START_EVENT));
              const target = document.getElementById("work");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#work");
              }
            }}
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
