"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const STIMULATION = 1.25;
const NOVELTY = -0.13;
const GROW_MS = 1400;
const EASE = [0.22, 1, 0.36, 1] as const;

const COLOR_BAD = "#6e645b";
const COLOR_GOOD = "#c48a4a";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function cubicBezier(
  t: number,
  p1: number,
  p2: number,
  p3: number,
  p4: number,
) {
  const cx = 3 * p1;
  const bx = 3 * (p3 - p1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p2;
  const by = 3 * (p4 - p2) - cy;
  const ay = 1 - cy - by;

  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const sampleDX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;

  let x = t;
  for (let i = 0; i < 6; i += 1) {
    const z = sampleX(x) - t;
    if (Math.abs(z) < 1e-5) break;
    const d = sampleDX(x);
    if (Math.abs(d) < 1e-5) break;
    x -= z / d;
  }
  return sampleY(x);
}

function easeOut(t: number) {
  return cubicBezier(t, EASE[0], EASE[1], EASE[2], EASE[3]);
}

function formatUeq(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  return value < 0 ? `\u2212${abs}` : abs;
}

type UeqNoveltyStaticProps = {
  active?: boolean;
};

/**
 * METRO Challenge — UEQ feeling scales (Stimulation + Novelty).
 * Outline pills match Impact chart callouts; numbers ease-out from 0.
 */
export function UeqNoveltyStatic({ active = false }: UeqNoveltyStaticProps) {
  const descId = useId();
  const rafRef = useRef<number | null>(null);
  const [stimulation, setStimulation] = useState(0);
  const [novelty, setNovelty] = useState(0);

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    cancel();
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setStimulation(STIMULATION);
      setNovelty(NOVELTY);
      return;
    }

    setStimulation(0);
    setNovelty(0);
    const t0 = performance.now();

    const tick = (now: number) => {
      const u = Math.min(1, Math.max(0, (now - t0) / GROW_MS));
      const e = easeOut(u);
      setStimulation(lerp(0, STIMULATION, e));
      setNovelty(lerp(0, NOVELTY, e));
      if (u >= 1) {
        setStimulation(STIMULATION);
        setNovelty(NOVELTY);
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancel]);

  useEffect(() => {
    if (!active) {
      cancel();
      const resetId = window.setTimeout(() => {
        setStimulation(0);
        setNovelty(0);
      }, 0);
      return () => window.clearTimeout(resetId);
    }
    const id = window.setTimeout(() => play(), 200);
    return () => {
      window.clearTimeout(id);
      cancel();
    };
  }, [active, play, cancel]);

  const scales = [
    {
      label: "Stimulation",
      value: stimulation,
      pill: "ABOVE AVERAGE",
      color: COLOR_GOOD,
    },
    {
      label: "Novelty",
      value: novelty,
      pill: "BAD",
      color: COLOR_BAD,
    },
  ] as const;

  return (
    <figure
      className="ueq-novelty-static relative flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-xl border border-white/10"
      style={
        {
          containerType: "inline-size",
          background: "transparent",
          color: "var(--ink, #f4ede5)",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
        } as CSSProperties
      }
      role="img"
      aria-labelledby={descId}
    >
      <p id={descId} className="sr-only">
        UEQ feeling scales: Stimulation 1.25 (Above Average) and Novelty −0.13
        (Bad). Practical scales scored 1.75 to 1.92.
      </p>

      <p
        className="m-0 shrink-0 px-[4%] text-left font-semibold uppercase"
        style={{
          fontSize: "clamp(0.7rem, 2.4cqw, 0.95rem)",
          letterSpacing: "0.14em",
          color: "var(--ink-muted, #cdbfb0)",
          paddingTop: "20px",
        }}
      >
        UEQ — the two scales about feeling
      </p>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center px-[4%]">
          <div
            className="grid w-full max-w-[40rem] grid-cols-2"
            style={{
              gap: "clamp(1rem, 4cqw, 2.5rem)",
              transform: "translateY(0px)",
            }}
          >
            {scales.map((scale) => (
              <div
                key={scale.label}
                className="flex min-w-0 flex-col items-center text-center"
                style={{ gap: "calc(clamp(0.65rem, 2.2cqw, 1rem) + 4px)" }}
              >
                <p
                  className="m-0 font-medium"
                  style={{
                    fontSize: "clamp(0.85rem, 2.6cqw, 1.05rem)",
                    color: "var(--ink, #f4ede5)",
                  }}
                >
                  {scale.label}
                </p>
                <p
                  className="m-0 font-bold leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(2.75rem, 12cqw, 5.5rem)",
                    letterSpacing: "-0.04em",
                    color: "var(--ink, #f4ede5)",
                    opacity: 0.9,
                  }}
                >
                  {formatUeq(scale.value)}
                </p>
                <span
                  className="inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wide whitespace-nowrap"
                  style={{
                    height: "clamp(1.75rem, 5cqw, 2.25rem)",
                    paddingInline: "clamp(0.85rem, 2.2cqw, 1.25rem)",
                    fontSize: "clamp(0.7rem, 2cqw, 0.85rem)",
                    background: "transparent",
                    color: "color-mix(in srgb, var(--ink, #f4ede5) 90%, transparent)",
                    border: `1px solid ${scale.color}`,
                  }}
                >
                  {scale.pill}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className="m-0 shrink-0 px-[4%] text-center"
          style={{
            fontSize: "clamp(0.65rem, 1.9cqw, 0.8rem)",
            color: "#9d9185",
            lineHeight: 1.9,
            paddingBottom: "calc(4% + 10px)",
          }}
        >
          Practical scales scored 1.75 to 1.92, good to excellent
          <br />
          UEQ scale from −3 to +3
        </p>
      </div>
    </figure>
  );
}
