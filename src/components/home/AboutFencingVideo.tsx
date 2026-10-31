"use client";

import { useEffect, useRef, useState } from "react";
import { handwriting } from "@/lib/fonts";

const VIDEO_SRC = "/media/about/fencing.mp4";
const PLAYBACK_VOLUME = 0.28;

const POLAROID_DATE = "31. October 2026";

export function AboutFencingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setReducedMotion(motion.matches);
      setCanHover(hover.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    hover.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      hover.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = PLAYBACK_VOLUME;
    el.muted = muted;
  }, [muted]);

  const play = async () => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = PLAYBACK_VOLUME;
    el.muted = muted;
    try {
      await el.play();
      setPlaying(true);
    } catch {
      el.muted = true;
      setMuted(true);
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const pause = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
  };

  const toggle = () => {
    if (playing) pause();
    else void play();
  };

  const toggleMute = () => {
    const el = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (el) {
      el.muted = next;
      if (!next) el.volume = PLAYBACK_VOLUME;
    }
  };

  return (
    <figure
      id="about-photo"
      className="relative mx-auto w-full origin-center rotate-[4deg]"
    >
      {/* Soft cream Polaroid — muted, not yellow */}
      <div
        className="relative z-[1] overflow-hidden rounded-[14px] bg-[url('/media/about/polaroid-paper.jpg')] bg-cover bg-center px-3 pt-3 pb-1"
        onMouseEnter={() => {
          if (canHover && !reducedMotion) void play();
        }}
        onMouseLeave={() => {
          if (canHover) pause();
        }}
      >
        <div className="group relative aspect-[11/10] overflow-hidden rounded-[4px] bg-[#111]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            src={VIDEO_SRC}
            playsInline
            loop
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label="Fencing practice video"
          />

          {/* Full-frame hit target; visible control sits by the caption */}
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 z-[2] cursor-pointer"
            aria-label={playing ? "Pause fencing video" : "Play fencing video"}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute top-2 right-2 z-[4] inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/80 backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-black/40"
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={muted}
          >
            {muted ? (
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="m22 9-6 6M16 9l6 6" />
              </svg>
            ) : (
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3.5 px-1 pt-4 pb-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#6B5A45]/70 text-[#E9DFC9] transition-opacity duration-200"
            aria-label={playing ? "Pause fencing video" : "Play fencing video"}
            tabIndex={-1}
          >
            {playing ? (
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                className="ml-px size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.1-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
            )}
          </button>
          <figcaption
            className={`${handwriting.className} min-w-0 flex-1 text-left text-[clamp(1.15rem,3.6vw,1.4rem)] leading-snug text-[#6B4A32]/75`}
          >
            fencing training with my master, {POLAROID_DATE}
          </figcaption>
        </div>
      </div>

    </figure>
  );
}
