"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HERO_BUBBLE_PREVIEW,
  HERO_RABBIT_BUBBLE_AT,
  HERO_RABBIT_BUBBLE_DURATION,
  HERO_RABBIT_BUBBLE_EVENT,
  HERO_RABBIT_BUBBLE_HOLD_MS,
  HERO_RABBIT_BUBBLE_SETTLE,
  HERO_RABBIT_BUBBLE_SYNC_EVENT,
  hero,
  type HeroRabbitBubbleSyncDetail,
} from "@/content/home";

function dispatchBubbleSync(detail: HeroRabbitBubbleSyncDetail) {
  window.dispatchEvent(
    new CustomEvent<HeroRabbitBubbleSyncDetail>(HERO_RABBIT_BUBBLE_SYNC_EVENT, {
      detail,
    }),
  );
}

/**
 * Desktop: background video (only after media query match). Plays once — no loop.
 * Always muted; play/pause only. Mobile / reduced-motion / coarse pointer: static poster.
 */
const BTN_SIZE = 44;
const RING_STROKE = 1.5;
const RING_RADIUS = (BTN_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const controlBtnClass =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/90 transition-colors hover:bg-black/55 md:bg-black/30 md:backdrop-blur-sm";

function hardStop(el: HTMLVideoElement) {
  el.pause();
  try {
    el.currentTime = el.currentTime;
  } catch {
    /* ignore */
  }
}

export function HeroMedia() {
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const playTokenRef = useRef(0);
  const bubbleShowingRef = useRef(false);
  /** Auto pause after enter settle; not a user pause — may auto-resume. */
  const bubbleHoldRef = useRef(false);
  /** Once per cue — hold after settle only. */
  const bubbleHoldArmedRef = useRef(false);
  const bubbleHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBubbleHold = () => {
    if (bubbleHoldTimerRef.current !== null) {
      clearTimeout(bubbleHoldTimerRef.current);
      bubbleHoldTimerRef.current = null;
    }
    bubbleHoldRef.current = false;
  };

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    const sync = () => {
      setUseVideo(media.matches);
      if (!media.matches) {
        const el = videoRef.current;
        if (el) hardStop(el);
        setVideoReady(false);
        setPlaying(false);
        setProgress(0);
        userPausedRef.current = false;
        playTokenRef.current += 1;
        clearBubbleHold();
        if (bubbleShowingRef.current) {
          bubbleShowingRef.current = false;
          bubbleHoldArmedRef.current = false;
          dispatchBubbleSync({ elapsed: null });
        }
      }
    };
    sync();

    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      clearBubbleHold();
    };
  }, []);

  const playVideo = async () => {
    const el = videoRef.current;
    if (!el || userPausedRef.current) return;

    clearBubbleHold();
    const token = ++playTokenRef.current;
    el.muted = true;

    if (el.ended || el.currentTime >= (el.duration || 0) - 0.05) {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      if (bubbleShowingRef.current) {
        bubbleShowingRef.current = false;
        bubbleHoldArmedRef.current = false;
        dispatchBubbleSync({ elapsed: null });
      }
    }

    try {
      await el.play();
      if (token !== playTokenRef.current || userPausedRef.current) {
        hardStop(el);
        setPlaying(false);
        return;
      }
      setPlaying(true);
    } catch {
      if (token !== playTokenRef.current || userPausedRef.current) return;
      setPlaying(false);
    }
  };

  const pauseVideo = () => {
    const el = videoRef.current;
    userPausedRef.current = true;
    clearBubbleHold();
    playTokenRef.current += 1;
    if (el) hardStop(el);
    setPlaying(false);
  };

  /** After enter settles: pause (like the pause button), then auto-play. */
  const holdAfterSettle = () => {
    const el = videoRef.current;
    if (!el || userPausedRef.current || el.ended || bubbleHoldRef.current) return;
    clearBubbleHold();
    bubbleHoldRef.current = true;
    playTokenRef.current += 1;
    hardStop(el);
    setPlaying(false);
    bubbleHoldTimerRef.current = setTimeout(() => {
      bubbleHoldTimerRef.current = null;
      bubbleHoldRef.current = false;
      if (userPausedRef.current) return;
      void playVideo();
    }, HERO_RABBIT_BUBBLE_HOLD_MS);
  };

  useEffect(() => {
    if (!useVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const markReady = () => setVideoReady(true);
    const onEnded = () => {
      setPlaying(false);
      setProgress(1);
    };

    if (el.readyState >= 3) markReady();

    el.addEventListener("canplay", markReady);
    el.addEventListener("loadeddata", markReady);
    el.addEventListener("ended", onEnded);

    return () => {
      playTokenRef.current += 1;
      hardStop(el);
      el.removeEventListener("canplay", markReady);
      el.removeEventListener("loadeddata", markReady);
      el.removeEventListener("ended", onEnded);
    };
  }, [useVideo]);

  useEffect(() => {
    if (!useVideo || !videoReady) return;
    const el = videoRef.current;
    if (!el) return;

    // TEMP preview: jump to cue frame, pause, show bubble for layout check.
    if (HERO_BUBBLE_PREVIEW) {
      userPausedRef.current = true;
      playTokenRef.current += 1;
      const freeze = () => {
        try {
          el.currentTime = HERO_RABBIT_BUBBLE_AT;
        } catch {
          /* ignore */
        }
        hardStop(el);
        setPlaying(false);
        const dur = el.duration;
        if (Number.isFinite(dur) && dur > 0) {
          setProgress(Math.min(1, Math.max(0, HERO_RABBIT_BUBBLE_AT / dur)));
        }
        bubbleShowingRef.current = true;
        window.dispatchEvent(new Event(HERO_RABBIT_BUBBLE_EVENT));
        dispatchBubbleSync({ elapsed: 0 });
      };
      if (el.readyState >= 1) freeze();
      else el.addEventListener("loadedmetadata", freeze, { once: true });
      return;
    }

    if (userPausedRef.current) return;
    void playVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useVideo, videoReady]);

  useEffect(() => {
    if (!useVideo || !videoReady) return;
    if (HERO_BUBBLE_PREVIEW) return;
    const el = videoRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      const t = el.currentTime;
      const dur = el.duration;
      if (Number.isFinite(dur) && dur > 0) {
        setProgress(Math.min(1, Math.max(0, t / dur)));
      }
      setPlaying(!el.paused && !el.ended);

      // Drive bubble from the video clock so pause freezes the exact frame.
      const elapsed = t - HERO_RABBIT_BUBBLE_AT;
      const playing = !el.paused && !el.ended;
      if (elapsed >= 0 && elapsed < HERO_RABBIT_BUBBLE_DURATION) {
        if (!bubbleShowingRef.current) {
          bubbleShowingRef.current = true;
          bubbleHoldArmedRef.current = true;
          window.dispatchEvent(new Event(HERO_RABBIT_BUBBLE_EVENT));
        }
        dispatchBubbleSync({ elapsed, playing });
        // Enter bounce settled → pause (bubble stays), then resume.
        if (
          bubbleHoldArmedRef.current &&
          elapsed >= HERO_RABBIT_BUBBLE_SETTLE &&
          !userPausedRef.current &&
          !bubbleHoldRef.current
        ) {
          bubbleHoldArmedRef.current = false;
          holdAfterSettle();
        }
      } else if (bubbleShowingRef.current) {
        bubbleShowingRef.current = false;
        bubbleHoldArmedRef.current = false;
        dispatchBubbleSync({ elapsed: null, playing: false });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearBubbleHold();
    };
  }, [useVideo, videoReady]);

  const togglePlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused || el.ended || userPausedRef.current || bubbleHoldRef.current) {
      userPausedRef.current = false;
      void playVideo();
    } else {
      pauseVideo();
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
              src={hero.video.src}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>

      {useVideo && videoReady ? (
        <div className="absolute right-5 bottom-5 z-20 flex items-center gap-2 md:right-8 md:bottom-8">
          <button
            type="button"
            onClick={togglePlayback}
            className={`relative ${controlBtnClass}`}
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
        </div>
      ) : null}
    </>
  );
}
