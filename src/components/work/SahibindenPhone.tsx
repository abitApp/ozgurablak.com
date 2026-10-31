"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

/**
 * sahibinden Challenge / Approach — phone + shared backdrop.
 * Sized with % of panel (no CSS scale) so media scroll stays off.
 */
const TAP_LEFT = "52.58%";
const TAP_TOP = "78.19%";
const TAP_SIZE = "10.824%"; // +20% then +10% for Challenge + button waves
const TAP_TILT =
  "translate(-50%, -50%) perspective(520px) rotateZ(-2deg) rotateY(10deg) rotateX(2deg)";

/** Voice-to-text mic icons on the Approach form phone (title + description). */
const MIC_TARGETS = [
  { id: "title", left: "73.46%", top: "31.43%" },
  { id: "description", left: "73.42%", top: "35.87%" },
] as const;
const MIC_SIZE = "5.28%"; // +20% vs prior 4.4% for Approach mic waves
const MIC_TILT =
  "translate(-50%, -50%) perspective(520px) rotateZ(-2deg) rotateY(10deg) rotateX(2deg)";

const VARIANTS = {
  challenge: {
    src: "/media/projects/sahibinden/challenge-phone-rose.png",
    alt: "sahibinden.com app on an angled rose-gold iPhone, showing search and the highlighted post-ad button in the tab bar.",
    label:
      "sahibinden.com app on an angled iPhone, with a tap highlight on the post-ad button",
    showFab: true,
    showMicWaves: false,
  },
  approach: {
    src: "/media/projects/sahibinden/approach-phone-rose.png",
    alt: "sahibinden.com post-ad form on an angled rose-gold iPhone, with voice-to-text on title and description fields.",
    label:
      "sahibinden.com app on an angled iPhone, showing the post-ad form with voice-to-text",
    showFab: false,
    showMicWaves: true,
  },
} as const;

export type SahibindenPhoneVariant = keyof typeof VARIANTS;

/** Soft abstract accents behind the phone — absolute only, no layout growth. */
const BACKDROP_SHAPES = [
  {
    id: "blob-tl",
    left: "10%",
    top: "18%",
    width: "46%",
    height: "32%",
    rotate: "-18deg",
    blur: "67px",
    opacity: 0.32,
    color: "rgba(18, 78, 128, 1)",
    radius: "60% 40% 55% 45%",
    drift: "a" as const,
  },
  {
    id: "circle-tr",
    left: "62%",
    top: "16%",
    width: "28%",
    height: "20%",
    rotate: "0deg",
    blur: "58px",
    opacity: 0.25,
    color: "rgba(45, 120, 185, 1)",
    radius: "9999px",
    drift: "b" as const,
  },
  {
    id: "oval-ml",
    left: "6%",
    top: "38%",
    width: "28%",
    height: "20%",
    rotate: "12deg",
    blur: "62px",
    opacity: 0.2,
    color: "rgba(32, 105, 175, 0.95)",
    radius: "9999px",
    drift: null,
  },
  {
    id: "pill-bl",
    left: "10%",
    top: "66%",
    width: "30%",
    height: "10%",
    rotate: "-28deg",
    blur: "48px",
    opacity: 0.23,
    color: "rgba(196, 138, 74, 0.95)",
    radius: "9999px",
    drift: "c" as const,
  },
  {
    id: "blob-center",
    left: "32%",
    top: "32%",
    width: "42%",
    height: "30%",
    rotate: "8deg",
    blur: "77px",
    opacity: 0.22,
    color: "rgba(28, 95, 165, 1)",
    radius: "50% 55% 45% 60%",
    drift: null,
  },
] as const;

type Ripple = { id: number };

type SahibindenPhoneProps = {
  variant?: SahibindenPhoneVariant;
};

export function SahibindenPhone({
  variant = "challenge",
}: SahibindenPhoneProps) {
  const config = VARIANTS[variant];
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressed, setPressed] = useState(false);
  const nextId = useRef(0);
  const reactId = useId();

  useEffect(() => {
    if (!config.showFab && !config.showMicWaves) return;

    let pressTimer: number | undefined;
    let clearTimer: number | undefined;

    const beat = () => {
      const id = nextId.current++;
      if (config.showFab) setPressed(true);
      setRipples((prev) => [...prev.slice(-5), { id }]);
      if (config.showFab) {
        pressTimer = window.setTimeout(() => setPressed(false), 180);
      }
      clearTimer = window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1100);
    };

    beat();
    const loop = window.setInterval(beat, 1600);

    return () => {
      window.clearInterval(loop);
      if (pressTimer) window.clearTimeout(pressTimer);
      if (clearTimer) window.clearTimeout(clearTimer);
    };
  }, [config.showFab, config.showMicWaves]);

  return (
    <div
      className="relative flex h-full min-h-0 w-full shrink-0 items-center justify-center overflow-hidden"
      aria-label={config.label}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          // Longer top melt so blobs don't look hard-clipped at the panel edge
          maskImage: [
            "linear-gradient(to bottom, transparent 0%, #000 22%, #000 86%, transparent 100%)",
            "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          ].join(", "),
          WebkitMaskImage: [
            "linear-gradient(to bottom, transparent 0%, #000 22%, #000 86%, transparent 100%)",
            "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          ].join(", "),
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        {BACKDROP_SHAPES.map((shape) => {
          const blurPx =
            Number.parseFloat(shape.blur) *
            (variant === "approach" ? 1.2 : 1);

          return (
            <span
              key={shape.id}
              className={
                shape.drift
                  ? `sahibinden-shape sahibinden-shape--${shape.drift}`
                  : "sahibinden-shape"
              }
              style={{
                position: "absolute",
                left: shape.left,
                top: shape.top,
                width: shape.width,
                height: shape.height,
                borderRadius: shape.radius,
                background: shape.color,
                opacity: shape.opacity,
                filter: `blur(${blurPx}px)`,
                transform: `rotate(${shape.rotate})`,
              }}
            />
          );
        })}
      </div>

      {/* Glass floor under the phone — sits in the gap below (above phone z), no layout shift */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-[15] w-[42%] max-w-[18rem]"
        style={{
          bottom: "2%",
          height: "8%",
          transform: "translateX(-50%)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: "18% 2% 0",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.22) 48%, transparent 76%)",
            filter: "blur(8px)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "6%",
            right: "6%",
            top: "8%",
            height: "55%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(243, 235, 226, 0.42) 0%, rgba(150, 205, 255, 0.18) 40%, transparent 78%)",
            filter: "blur(5px)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "18%",
            right: "18%",
            top: "22%",
            height: "18%",
            borderRadius: "50%",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Layout-sized (not transform scale) so it cannot overflow the scroll area */}
      <div
        className="relative z-10 max-h-full max-w-full"
        style={{
          height: "88%",
          width: "auto",
          aspectRatio: "682 / 1024",
        }}
      >
        <Image
          src={config.src}
          alt={config.alt}
          fill
          sizes="(max-width: 768px) 90vw, 45vw"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="select-none object-contain object-center [-webkit-user-drag:none]"
          priority
          unoptimized
          style={{ opacity: 0.9 }}
        />

        {config.showFab ? (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              pointerEvents: "none",
              opacity: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: TAP_LEFT,
                top: `calc(${TAP_TOP} - 6px)`,
                width: TAP_SIZE,
                aspectRatio: "1",
                transform: TAP_TILT,
                transformStyle: "preserve-3d",
              }}
            >
              {ripples.map((ripple) => (
                <span
                  key={`${reactId}-${ripple.id}`}
                  className="sahibinden-fab__ripple"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    borderRadius: "9999px",
                    border: "2px solid rgba(120, 200, 255, 0.95)",
                    background: "rgba(80, 170, 255, 0.32)",
                  }}
                />
              ))}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "9999px",
                  background: "#064b7a",
                  boxShadow:
                    "0 0 0 2px rgba(140, 210, 255, 0.45), 0 4px 14px rgba(0, 30, 60, 0.55)",
                  transform: pressed ? "scale(0.902)" : "scale(1)",
                  transition: "transform 140ms ease-out",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    width: "44%",
                    height: "44%",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "100%",
                      height: "18%",
                      borderRadius: 9999,
                      background: "#ffffff",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "18%",
                      height: "100%",
                      borderRadius: 9999,
                      background: "#ffffff",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </span>
              </span>
            </div>
          </div>
        ) : null}

        {config.showMicWaves ? (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            {MIC_TARGETS.map((mic) => (
              <div
                key={mic.id}
                style={{
                  position: "absolute",
                  left: mic.left,
                  top: mic.top,
                  width: MIC_SIZE,
                  aspectRatio: "1",
                  transform: MIC_TILT,
                  transformStyle: "preserve-3d",
                }}
              >
                {ripples.map((ripple) => (
                  <span
                    key={`${reactId}-${mic.id}-${ripple.id}`}
                    className="sahibinden-mic__ripple"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "9999px",
                      border: "1.5px solid rgba(120, 200, 255, 0.95)",
                      background: "rgba(80, 170, 255, 0.28)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
