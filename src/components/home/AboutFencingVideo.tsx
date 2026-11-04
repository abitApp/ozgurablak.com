"use client";

import { useEffect, useRef, useState } from "react";
import { handwriting } from "@/lib/fonts";

const VIDEO_SRC = "/media/about/fencing.mp4?v=8";
const POSTER_SRC = "/media/about/fencing-poster.jpg?v=8";
const PLAYBACK_VOLUME = 1;

const POLAROID_DATE = "31. October 2026";

/** Same ring math as HeroMedia play/pause control. */
const BTN_SIZE = 36;
const RING_STROKE = 1.5;
const RING_RADIUS = (BTN_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Shared cover crop for poster + video. object-fit on <video> vs <img> can
 * disagree by a few px in WebKit/Blink; transform-centering uses one layout.
 */
const mediaCoverClass =
  "pointer-events-none absolute top-1/2 left-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2";

const controlBtnClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/45 text-white/85 transition-[transform,colors] duration-200 hover:scale-105 hover:border-white/35 hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] md:bg-black/35 md:backdrop-blur-sm";

export function AboutFencingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingPlayRef = useRef(false);
  /** Suppress play/pause UI while priming the first composited frame. */
  const warmingRef = useRef(false);
  const [mediaSrc, setMediaSrc] = useState<string | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [playBlink, setPlayBlink] = useState(false);
  /** Paused first frame painted — swap off the poster before any click. */
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = PLAYBACK_VOLUME;
    el.muted = muted;
  }, [muted, mediaSrc, frameReady]);

  // Warm-load video when About approaches; blink Play 2s after entering.
  useEffect(() => {
    const section = document.getElementById("about");
    if (!section) return;

    let wasInside = false;
    let delayTimer: number | null = null;
    let warmed = false;

    const clearDelay = () => {
      if (delayTimer !== null) {
        window.clearTimeout(delayTimer);
        delayTimer = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inside = Boolean(entry?.isIntersecting);
        if (inside && !warmed) {
          warmed = true;
          setMediaSrc(VIDEO_SRC);
        }
        if (inside && !wasInside) {
          clearDelay();
          setPlayBlink(false);
          delayTimer = window.setTimeout(() => {
            delayTimer = null;
            setPlayBlink(false);
            requestAnimationFrame(() => setPlayBlink(true));
          }, 2000);
        } else if (!inside && wasInside) {
          clearDelay();
          setPlayBlink(false);
        }
        wasInside = inside;
      },
      { threshold: 0.15, rootMargin: "120px 0px" },
    );
    observer.observe(section);
    return () => {
      clearDelay();
      observer.disconnect();
    };
  }, []);

  // Drive the ring from the video clock while playing (skip warm-up play).
  useEffect(() => {
    if (!mediaSrc || ended || !playing || warmingRef.current) return;
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
  }, [mediaSrc, ended, playing]);

  const tryPlay = async () => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = PLAYBACK_VOLUME;
    el.muted = muted;
    setEnded(false);
    try {
      await el.play();
      setPlaying(true);
    } catch {
      // Browsers often block unmuted autoplay — fall back to muted.
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

  const toggleMute = () => {
    const el = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (el) {
      el.muted = next;
      if (!next) el.volume = PLAYBACK_VOLUME;
    }
  };

  // Play after src mounts (and first frame is ready if we were waiting on load).
  useEffect(() => {
    if (!mediaSrc || !pendingPlayRef.current) return;
    if (!frameReady) return;
    pendingPlayRef.current = false;
    void tryPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- kick off after frame is paintable
  }, [mediaSrc, frameReady]);

  const revealFirstFrame = async () => {
    const el = videoRef.current;
    if (!el || frameReady || warmingRef.current) return;
    el.muted = true;
    warmingRef.current = true;
    try {
      // Force a composited frame while still opacity-0, then freeze on frame 0.
      await el.play();
      el.pause();
      el.currentTime = 0;
    } catch {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    } finally {
      warmingRef.current = false;
      setPlaying(false);
      setProgress(0);
    }
    setFrameReady(true);
  };

  const play = () => {
    const el = videoRef.current;
    if (el && (ended || el.ended || el.currentTime >= (el.duration || 0) - 0.05)) {
      el.currentTime = 0;
      setProgress(0);
      setEnded(false);
    }
    if (!mediaSrc) {
      pendingPlayRef.current = true;
      setMediaSrc(VIDEO_SRC);
      return;
    }
    if (!frameReady) {
      pendingPlayRef.current = true;
      return;
    }
    void tryPlay();
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

  const handleEnded = () => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setPlaying(false);
    setProgress(0);
    setEnded(true);
  };

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const showProgressRing = Boolean(mediaSrc) && !ended && (playing || progress > 0);

  return (
    <figure
      id="about-photo"
      className="relative mx-auto w-full origin-center rotate-[4deg]"
    >
      {/* Soft cream Polaroid — muted, not yellow */}
      <div
        className="relative z-[1] overflow-hidden rounded-[14px] bg-cover bg-center px-3 pt-3 pb-1"
        style={{
          backgroundImage:
            "image-set(url('/media/about/polaroid-paper.webp') type('image/webp'), url('/media/about/polaroid-paper.jpg') type('image/jpeg'))",
        }}
      >
        <div className="relative aspect-[11/10] overflow-hidden rounded-[4px] bg-[#111]">
          {/* Poster only until the paused video first frame is painted. */}
          {!frameReady ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={POSTER_SRC}
              alt=""
              width={1256}
              height={720}
              draggable={false}
              className={mediaCoverClass}
              aria-hidden="true"
            />
          ) : null}
          {mediaSrc ? (
            <video
              ref={videoRef}
              className={`${mediaCoverClass}${frameReady ? "" : " opacity-0"}`}
              src={mediaSrc}
              width={1256}
              height={720}
              muted={muted}
              playsInline
              preload="auto"
              onLoadedData={() => {
                void revealFirstFrame();
              }}
              onPlay={() => {
                if (warmingRef.current) return;
                setPlaying(true);
                setEnded(false);
              }}
              onPause={() => {
                if (warmingRef.current) return;
                setPlaying(false);
              }}
              onEnded={handleEnded}
              aria-label="Fencing practice video"
            />
          ) : null}

          {!showProgressRing ? (
            <button
              type="button"
              onClick={toggle}
              onAnimationEnd={() => setPlayBlink(false)}
              className={`absolute bottom-3 left-1/2 z-[3] h-9 -translate-x-1/2 gap-1.5 px-3.5 ${controlBtnClass}${
                playBlink ? " about-play-border-blink" : ""
              }`}
              aria-label="Play video"
            >
              <svg
                className="ml-px size-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.1-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
              <span className="text-[0.78rem] font-medium tracking-wide text-white/90">
                Play
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggle}
              onAnimationEnd={() => setPlayBlink(false)}
              className={`absolute bottom-3 left-1/2 z-[3] -translate-x-1/2 ${controlBtnClass}${
                playBlink ? " about-play-border-blink" : ""
              }`}
              style={{ width: BTN_SIZE, height: BTN_SIZE }}
              aria-label={playing ? "Pause video" : "Play video"}
              aria-pressed={!playing}
            >
              <svg
                className="pointer-events-none absolute inset-0"
                width={BTN_SIZE}
                height={BTN_SIZE}
                viewBox={`0 0 ${BTN_SIZE} ${BTN_SIZE}`}
                aria-hidden="true"
              >
                <circle
                  cx={BTN_SIZE / 2}
                  cy={BTN_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth={RING_STROKE}
                />
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
                  className="relative size-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg
                  className="relative ml-px size-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.1-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                </svg>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className={`absolute right-3 bottom-3 z-[4] size-9 ${controlBtnClass}`}
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

        <div className="px-1 pt-4 pb-3">
          <figcaption
            className={`${handwriting.className} text-center text-[clamp(1.15rem,3.6vw,1.4rem)] leading-snug text-[#6B4A32]/75`}
          >
            Fencing practice with my coach, {POLAROID_DATE}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
