"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const BEFORE = -0.13;
const AFTER = 1.17;
const PX_PER_UNIT = 320; // at 1600 stage
const BAR_W = 220;
const ZERO_Y = 730;
const LEFT_CX = 538; // was 520 — charts 36px closer overall
const RIGHT_CX = 1062; // was 1080
const STAGE_W = 1600;
const STAGE_H = 1200;
const LABEL_GAP_POS = 28;
const LABEL_GAP_NEG = 26;
const GROW_MS = 1600;
const EASE = [0.22, 1, 0.36, 1] as const;

const COLOR_BEFORE = "#6e645b";
const COLOR_AFTER = "#c48a4a"; // site --accent gold

function formatUeq(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  return value < 0 ? `\u2212${abs}` : abs;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(from: string, to: string, t: number) {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      Number.parseInt(h.slice(0, 2), 16),
      Number.parseInt(h.slice(2, 4), 16),
      Number.parseInt(h.slice(4, 6), 16),
    ] as const;
  };
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  return `rgb(${Math.round(lerp(r1, r2, t))} ${Math.round(lerp(g1, g2, t))} ${Math.round(lerp(b1, b2, t))})`;
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

type BarGeom = {
  x: number;
  y: number;
  width: number;
  height: number;
  radiusTop: boolean;
};

function barGeom(cx: number, value: number): BarGeom {
  const h = Math.abs(value) * PX_PER_UNIT;
  const width = BAR_W;
  const x = cx - width / 2;
  if (value >= 0) {
    return { x, y: ZERO_Y - h, width, height: h, radiusTop: true };
  }
  return { x, y: ZERO_Y, width, height: h, radiusTop: false };
}

function barPath(g: BarGeom, radius: number): string {
  const r = Math.min(radius, g.width / 2, Math.max(0, g.height));
  if (g.height < 0.5) {
    return `M ${g.x} ${ZERO_Y} H ${g.x + g.width} V ${ZERO_Y + 0.01} H ${g.x} Z`;
  }
  if (g.radiusTop) {
    return [
      `M ${g.x} ${g.y + g.height}`,
      `L ${g.x} ${g.y + r}`,
      `Q ${g.x} ${g.y} ${g.x + r} ${g.y}`,
      `L ${g.x + g.width - r} ${g.y}`,
      `Q ${g.x + g.width} ${g.y} ${g.x + g.width} ${g.y + r}`,
      `L ${g.x + g.width} ${g.y + g.height}`,
      "Z",
    ].join(" ");
  }
  return [
    `M ${g.x} ${g.y}`,
    `L ${g.x + g.width} ${g.y}`,
    `L ${g.x + g.width} ${g.y + g.height - r}`,
    `Q ${g.x + g.width} ${g.y + g.height} ${g.x + g.width - r} ${g.y + g.height}`,
    `L ${g.x + r} ${g.y + g.height}`,
    `Q ${g.x} ${g.y + g.height} ${g.x} ${g.y + g.height - r}`,
    "Z",
  ].join(" ");
}

/**
 * Positive: alphabetic baseline 28u above bar top (digits sit above the bar).
 * Negative: hanging baseline 26u below bar bottom (top of digits clear of the bar).
 */
function valueLabelProps(value: number) {
  const h = Math.abs(value) * PX_PER_UNIT;
  if (value >= 0) {
    return {
      y: ZERO_Y - h - LABEL_GAP_POS,
      dominantBaseline: "alphabetic" as const,
    };
  }
  return {
    y: ZERO_Y + h + LABEL_GAP_NEG,
    dominantBaseline: "hanging" as const,
  };
}

type RatingTier = "bad" | "average" | "above";

/** BAD at start → AVERAGE mid-growth → ABOVE AVERAGE at ≥ 1.00 */
function ratingFor(value: number): RatingTier {
  if (value >= 1) return "above";
  if (value >= 0.35) return "average";
  return "bad";
}

function ratingLabel(tier: RatingTier): string {
  if (tier === "above") return "ABOVE AVERAGE";
  if (tier === "average") return "AVERAGE";
  return "BAD";
}

/**
 * Callout anchor on the bar edge.
 * Negative / BAD: zero-line (top of hanging bar).
 * Positive: growing tip.
 */
function tipY(value: number): number {
  if (value < 0) return ZERO_Y;
  return ZERO_Y - value * PX_PER_UNIT;
}

type CalloutSide = "left" | "right";

type CalloutGeom = {
  anchorX: number;
  anchorY: number;
  pillX: number;
  pillY: number;
  pillW: number;
  pillH: number;
  joinX: number;
  joinY: number;
  label: string;
  color: string;
};

/** Outline pill + diagonal leader, matching the reference callouts. */
function calloutGeom(
  side: CalloutSide,
  value: number,
  label: string,
  color: string,
): CalloutGeom {
  const anchorY = tipY(value);
  const anchorX =
    side === "left" ? LEFT_CX - BAR_W / 2 : RIGHT_CX + BAR_W / 2;

  const pillH = 60;
  const pillW =
    label === "ABOVE AVERAGE" ? 292 : label === "AVERAGE" ? 176 : 108;
  const gapX = 44;
  const gapY = 56;

  const pillY = anchorY - gapY - pillH;
  const pillX = side === "left" ? anchorX - gapX - pillW : anchorX + gapX;
  const joinX = side === "left" ? pillX + pillW : pillX;
  const joinY = pillY + pillH * 0.55;

  return {
    anchorX,
    anchorY,
    pillX,
    pillY,
    pillW,
    pillH,
    joinX,
    joinY,
    label,
    color,
  };
}

function Callout({
  geom,
  opacity,
}: {
  geom: CalloutGeom;
  opacity: number;
}) {
  const {
    anchorX,
    anchorY,
    pillX,
    pillY,
    pillW,
    pillH,
    joinX,
    joinY,
    label,
    color,
  } = geom;
  const r = pillH / 2;

  return (
    <g style={{ opacity, transition: "opacity 0.5s" }}>
      <line
        x1={anchorX}
        y1={anchorY}
        x2={joinX}
        y2={joinY}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={anchorX} cy={anchorY} r={4.5} fill={color} />
      <rect
        x={pillX}
        y={pillY}
        width={pillW}
        height={pillH}
        rx={r}
        ry={r}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={pillX + pillW / 2}
        y={pillY + pillH / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.9)"
        fontSize={28}
        fontWeight={600}
        fontFamily="inherit"
        letterSpacing="0.04em"
      >
        {label}
      </text>
    </g>
  );
}

const darkTokens: Record<string, string> = {
  "--ueq-surface": "rgba(255,255,255,0.04)",
  "--ueq-ink": "var(--ink, #f4ede5)",
  "--ueq-secondary": "var(--ink-muted, #cdbfb0)",
  "--ueq-muted": "#9d9185",
  "--ueq-hair": "rgba(255,255,255,0.16)",
  "--ueq-accent": "var(--card-gold, var(--accent, #c48a4a))",
  "--ueq-accent-soft": "rgba(201,143,80,0.18)",
  "--ueq-accent-text": "#f0c896",
  "--ueq-bar-before": "#6e645b",
  "--ueq-pill-fg": "rgba(255,255,255,0.9)",
};

const lightTokens: Record<string, string> = {
  "--ueq-surface": "#fcfcfb",
  "--ueq-ink": "#0b0b0b",
  "--ueq-secondary": "#52514e",
  "--ueq-muted": "#6f6e6a",
  "--ueq-hair": "#d9d8d3",
  "--ueq-accent": "#2a78d6",
  "--ueq-accent-soft": "#e4eefb",
  "--ueq-accent-text": "#184f95",
  "--ueq-bar-before": "#bdbcb5",
  "--ueq-pill-fg": "rgba(255,255,255,0.9)",
};

type UeqNoveltyChartProps = {
  /** Play when the parent carousel card becomes the active item. */
  active?: boolean;
};

/**
 * Animated UEQ Novelty before/after bars for METRO Challenge.
 * Dark by default to match portfolio cards; data-theme="light" restores light tokens.
 */
export function UeqNoveltyChart({ active = false }: UeqNoveltyChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const descId = useId();

  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(0);
  const [rightColor, setRightColor] = useState(COLOR_BEFORE);

  const radius = Math.min(14.4, Math.max(4, STAGE_W * 0.009));

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
      setLeftValue(BEFORE);
      setRightValue(AFTER);
      setRightColor(COLOR_AFTER);
      return;
    }

    setLeftValue(0);
    setRightValue(0);
    setRightColor(COLOR_BEFORE);

    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      const u = Math.min(1, Math.max(0, elapsed / GROW_MS));
      const e = easeOut(u);

      setLeftValue(lerp(0, BEFORE, e));
      setRightValue(lerp(0, AFTER, e));
      setRightColor(lerpColor(COLOR_BEFORE, COLOR_AFTER, e));

      if (u >= 1) {
        setLeftValue(BEFORE);
        setRightValue(AFTER);
        setRightColor(COLOR_AFTER);
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
        setLeftValue(0);
        setRightValue(0);
        setRightColor(COLOR_BEFORE);
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    // Wait a beat so button / snap scroll can settle on the card
    const id = window.setTimeout(() => play(), 280);
    return () => {
      window.clearTimeout(id);
      cancel();
    };
  }, [active, play, cancel]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onPlay = () => play();
    el.addEventListener("chart:play", onPlay);

    (window as Window & { playNoveltyChart?: () => void }).playNoveltyChart =
      onPlay;

    return () => {
      cancel();
      el.removeEventListener("chart:play", onPlay);
      const w = window as Window & { playNoveltyChart?: () => void };
      if (w.playNoveltyChart) delete w.playNoveltyChart;
    };
  }, [play, cancel]);

  const leftG = barGeom(LEFT_CX, leftValue);
  const rightG = barGeom(RIGHT_CX, rightValue);
  const leftLabel = valueLabelProps(leftValue);
  const rightLabel = valueLabelProps(rightValue);
  const leftPct = `${(LEFT_CX / STAGE_W) * 100}%`;
  const rightPct = `${(RIGHT_CX / STAGE_W) * 100}%`;
  const leftTier = ratingFor(leftValue);
  const rightTier = ratingFor(rightValue);
  const leftCallout = calloutGeom(
    "left",
    leftValue,
    ratingLabel(leftTier),
    "var(--ueq-bar-before)",
  );
  const rightCallout = calloutGeom(
    "right",
    rightValue,
    ratingLabel(rightTier),
    rightColor,
  );

  return (
    <figure
      ref={rootRef}
      className="ueq-novelty flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-white/10"
      style={
        {
          containerType: "inline-size",
          background: "var(--ueq-surface)",
          color: "var(--ueq-ink)",
          ...darkTokens,
        } as CSSProperties
      }
      role="img"
      aria-labelledby={descId}
    >
      <style>{`
        .ueq-novelty[data-theme="light"] {
          --ueq-surface: ${lightTokens["--ueq-surface"]};
          --ueq-ink: ${lightTokens["--ueq-ink"]};
          --ueq-secondary: ${lightTokens["--ueq-secondary"]};
          --ueq-muted: ${lightTokens["--ueq-muted"]};
          --ueq-hair: ${lightTokens["--ueq-hair"]};
          --ueq-accent: ${lightTokens["--ueq-accent"]};
          --ueq-accent-soft: ${lightTokens["--ueq-accent-soft"]};
          --ueq-accent-text: ${lightTokens["--ueq-accent-text"]};
          --ueq-bar-before: ${lightTokens["--ueq-bar-before"]};
          --ueq-pill-fg: ${lightTokens["--ueq-pill-fg"]};
        }
        .ueq-novelty .ueq-name {
          top: 80%;
        }
        @container (max-width: 999px) {
          .ueq-novelty .ueq-compact-hide {
            display: none !important;
          }
          .ueq-novelty .ueq-name {
            top: 82.5%;
          }
        }
      `}</style>

      <p id={descId} className="sr-only">
        UEQ Novelty rose from −0.13 (Bad) to 1.17 (Above Average) after the
        animations were added.
      </p>

      <div
        className="relative h-full min-h-0 w-full"
        style={{
          fontFamily: "var(--font-poppins), Inter, system-ui, sans-serif",
        }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            left: "7.5%",
            top: "9%",
          }}
        >
          <h4
            className="m-0 font-semibold leading-none"
            style={{ fontSize: "3.5cqw", color: "var(--ueq-ink)" }}
          >
            UEQ Novelty
          </h4>
          <p
            className="ueq-compact-hide m-0 mt-[0.9cqw] font-normal leading-none"
            style={{ fontSize: "2.125cqw", color: "var(--ueq-secondary)" }}
          >
            scale from −3 to +3
          </p>
        </div>

        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <line
            x1={120}
            y1={ZERO_Y}
            x2={1480}
            y2={ZERO_Y}
            stroke="var(--ueq-hair)"
            strokeWidth={2}
          />

          <g>
            <path d={barPath(leftG, radius)} fill="var(--ueq-bar-before)" />
            <text
              x={LEFT_CX}
              y={leftLabel.y}
              textAnchor="middle"
              dominantBaseline={leftLabel.dominantBaseline}
              fill="var(--ueq-ink)"
              fontSize={100}
              fontWeight={700}
              fontFamily="inherit"
            >
              {formatUeq(leftValue)}
            </text>
          </g>

          <g>
            <path d={barPath(rightG, radius)} fill={rightColor} />
            <text
              x={RIGHT_CX}
              y={rightLabel.y}
              textAnchor="middle"
              dominantBaseline={rightLabel.dominantBaseline}
              fill="var(--ueq-ink)"
              fontSize={100}
              fontWeight={700}
              fontFamily="inherit"
            >
              {formatUeq(rightValue)}
            </text>
          </g>

          <Callout geom={leftCallout} opacity={1} />
          <Callout geom={rightCallout} opacity={1} />
        </svg>

        <div
          className="ueq-name pointer-events-none absolute whitespace-nowrap font-normal"
          style={{
            left: leftPct,
            transform: "translateX(-50%)",
            fontSize: "2.5cqw",
            color: "var(--ueq-ink)",
          }}
        >
          No animations
        </div>
        <div
          className="ueq-name pointer-events-none absolute whitespace-nowrap font-normal"
          style={{
            left: rightPct,
            transform: "translateX(-50%)",
            fontSize: "2.5cqw",
            color: "var(--ueq-ink)",
          }}
        >
          With animations
        </div>

        <p
          className="ueq-compact-hide pointer-events-none absolute m-0"
          style={{
            left: "7.5%",
            bottom: "4.5%",
            fontSize: "1.875cqw",
            color: "var(--ueq-muted)",
          }}
        >
          UEQ rounds in user sessions · 17.05.2019 and 21.06.2019
        </p>
      </div>
    </figure>
  );
}
