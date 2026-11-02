"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/home";

/**
 * Desktop: muted looping background video (only after media query match).
 * Mobile / reduced-motion / coarse pointer: static poster — video is never requested.
 * Poster (first frame) stays visible until the video can play, then video fades in.
 *
 * Frame bias: media is 50px taller than the viewport and top-aligned with
 * object-bottom, so the crop sits 50px lower in-frame (no empty gap).
 */
const BTN_SIZE = 44;
const RING_STROKE = 1.5;
const RING_RADIUS = (BTN_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function HeroMedia() {
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    const sync = () => {
      setUseVideo(media.matches);
      if (!media.matches) {
        setVideoReady(false);
        setPlaying(true);
        setProgress(0);
      }
    };
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!useVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const markReady = () => setVideoReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    if (el.readyState >= 3) markReady();

    el.addEventListener("canplay", markReady);
    el.addEventListener("loadeddata", markReady);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("canplay", markReady);
      el.removeEventListener("loadeddata", markReady);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [useVideo]);

  // Drive the ring from the video clock while the control is mounted.
  useEffect(() => {
    if (!useVideo || !videoReady) return;
    const el = videoRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      const duration = el.duration;
      if (Number.isFinite(duration) && duration > 0) {
        setProgress(Math.min(1, Math.max(0, el.currentTime / duration)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [useVideo, videoReady]);

  const togglePlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[calc(100%+50px)]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />

          {useVideo ? (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover object-bottom transition-opacity duration-500 ease-out ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={hero.video.src} type="video/mp4" />
            </video>
          ) : null}
        </div>
      </div>

      {/* Sibling of hero scrims so the control stays clickable above them. */}
      {useVideo && videoReady ? (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute right-5 bottom-5 z-20 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/90 transition-colors hover:bg-black/55 md:right-8 md:bottom-8 md:bg-black/30 md:backdrop-blur-sm"
          style={{ width: BTN_SIZE, height: BTN_SIZE }}
          aria-label={
            playing ? "Pause background video" : "Play background video"
          }
          aria-pressed={!playing}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={BTN_SIZE}
            height={BTN_SIZE}
            viewBox={`0 0 ${BTN_SIZE} ${BTN_SIZE}`}
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx={BTN_SIZE / 2}
              cy={BTN_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={RING_STROKE}
            />
            {/* Progress — starts at 12 o'clock */}
            <circle
              cx={BTN_SIZE / 2}
              cy={BTN_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${BTN_SIZE / 2} ${BTN_SIZE / 2})`}
            />
          </svg>

          {playing ? (
            <svg
              className="relative size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              className="relative ml-px size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.1-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
