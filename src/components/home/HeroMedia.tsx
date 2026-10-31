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
export function HeroMedia() {
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    const sync = () => {
      setUseVideo(media.matches);
      if (!media.matches) setVideoReady(false);
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

    if (el.readyState >= 3) {
      markReady();
      return;
    }

    el.addEventListener("canplay", markReady);
    el.addEventListener("loadeddata", markReady);
    return () => {
      el.removeEventListener("canplay", markReady);
      el.removeEventListener("loadeddata", markReady);
    };
  }, [useVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden">
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
            preload="auto"
            poster={hero.image.src}
            aria-hidden="true"
          >
            <source src={hero.video.src} type="video/mp4" />
          </video>
        ) : null}
      </div>
    </div>
  );
}
