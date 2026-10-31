"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Design System — Challenge media.
 * Static phone + CSS spec callouts with micro drift.
 * Pills + leader sticks drift together; arrowheads stay fixed on the UI.
 */
const PHONE_SRC = "/media/projects/design-system/dashboard-phone.webp";

const LINE = "#b88950";
/** Composition aspect — used so arrow angles match the stretched frame. */
const FRAME_W = 896;
const FRAME_H = 692;

type Callout = {
  id: string;
  /** One line, or [title, value] for two-line pills */
  label: string | [string, string];
  /** Pill center in composition % */
  pillX: number;
  pillY: number;
  /** Tip on the phone UI in composition % */
  tipX: number;
  tipY: number;
};

/** Pill diameter as % of frame width — keep in sync with pill `width` style. */
const PILL_WIDTH_PCT = 15.5;
/** Arrow size as fraction of frame width (+40% from last size). */
const ARROW_LEN_FRAC = 0.01176;
const ARROW_HALF_FRAC = 0.00588;

/**
 * RULE: tipX/tipY is the only tip source. Line end === arrow tip vertex.
 * Moving a callout tip always moves its line with it — never update one alone.
 */
function leaderGeometry(
  c: Callout,
  w: number,
  h: number,
  driftXPct = 0,
  driftYPct = 0,
) {
  const tipX = c.tipX;
  const tipY = c.tipY;
  const cx = c.pillX + driftXPct;
  const cy = c.pillY + driftYPct;
  const vx = ((tipX - cx) / 100) * w;
  const vy = ((tipY - cy) / 100) * h;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const radiusPx = (PILL_WIDTH_PCT / 100) * w * 0.5;

  // Stick: pill edge → exact tip (line always follows tipX/tipY)
  const x1 = cx + ((radiusPx * ux) / w) * 100;
  const y1 = cy + ((radiusPx * uy) / h) * 100;
  const x2 = tipX;
  const y2 = tipY;

  // Arrow stays fixed at tip; orientation from rest pill → tip
  const rdx = ((tipX - c.pillX) / 100) * w;
  const rdy = ((tipY - c.pillY) / 100) * h;
  const rlen = Math.hypot(rdx, rdy) || 1;
  const rux = rdx / rlen;
  const ruy = rdy / rlen;
  const tipPxX = (tipX / 100) * w;
  const tipPxY = (tipY / 100) * h;
  const arrowLen = w * ARROW_LEN_FRAC;
  const arrowHalf = w * ARROW_HALF_FRAC;
  const baseX = tipPxX - arrowLen * rux;
  const baseY = tipPxY - arrowLen * ruy;
  const px = -ruy;
  const py = rux;
  const toPct = (x: number, y: number) =>
    `${(x / w) * 100},${(y / h) * 100}`;
  const arrowPoints = [
    toPct(baseX + arrowHalf * px, baseY + arrowHalf * py),
    toPct(tipPxX, tipPxY),
    toPct(baseX - arrowHalf * px, baseY - arrowHalf * py),
  ].join(" ");

  return { x1, y1, x2, y2, arrowPoints };
}

/** Composition matches prior specs frame (~896×692); phone centered. */
const CALLOUTS: Callout[] = [
  {
    id: "font-size",
    label: "Font-size 32pt",
    pillX: 14,
    pillY: 16,
    tipX: 41.3,
    tipY: 27.0,
  },
  {
    id: "color",
    label: "Color #00697C",
    pillX: 86,
    pillY: 18,
    // Guest Wi-Fi teal toggle (user-marked)
    tipX: 58.7,
    tipY: 41.5,
  },
  {
    id: "space",
    label: ["Space", "20pt"],
    pillX: 88,
    pillY: 48,
    tipX: 52,
    tipY: 52,
  },
  {
    id: "radius",
    label: "Radius 20pt",
    pillX: 12,
    pillY: 58,
    // Top-left curve of Support & Diagnostics (nearest card to this callout)
    tipX: 42.3,
    tipY: 52.0,
  },
  {
    id: "icon-size",
    label: "Icon size 20pt",
    pillX: 86,
    pillY: 78,
    tipX: 63,
    tipY: 84,
  },
];

const DRIFT = [
  { ampX: 5, ampY: -4, period: 5200, phase: 0.2 },
  { ampX: -4, ampY: 5, period: 4600, phase: 1.1 },
  { ampX: 4, ampY: 4, period: 5800, phase: 2.0 },
  { ampX: -5, ampY: -3, period: 5000, phase: 0.7 },
  { ampX: 4, ampY: 3, period: 5400, phase: 1.6 },
] as const;

export function DesignSystemSpecs() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const arrowRefs = useRef<(SVGPolygonElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = now - start;
      const box = frameRef.current?.getBoundingClientRect();
      const w = box?.width || FRAME_W;
      const h = box?.height || FRAME_H;

      CALLOUTS.forEach((c, i) => {
        const d = DRIFT[i] ?? DRIFT[0];
        const wobble = Math.sin((t / d.period) * Math.PI * 2 + d.phase);
        const dxPx = d.ampX * wobble;
        const dyPx = d.ampY * wobble;
        // Single geometry pass: line end and arrow tip always share tipX/tipY
        const { x1, y1, x2, y2, arrowPoints } = leaderGeometry(
          c,
          w,
          h,
          (dxPx / w) * 100,
          (dyPx / h) * 100,
        );

        const pill = pillRefs.current[i];
        if (pill) {
          pill.style.transform = `translate(${dxPx}px, ${dyPx}px)`;
        }

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x1", String(x1));
          line.setAttribute("y1", String(y1));
          line.setAttribute("x2", String(x2));
          line.setAttribute("y2", String(y2));
        }

        const arrow = arrowRefs.current[i];
        if (arrow) {
          arrow.setAttribute("points", arrowPoints);
        }
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="relative flex h-full min-h-0 w-full shrink-0 items-center justify-center overflow-hidden"
      aria-label="Vodafone router Dashboard on a phone, with design-spec callouts for type, color, spacing, radius, and icon size"
    >
      <div
        ref={frameRef}
        className="relative h-full max-h-full w-full max-w-full"
        style={{ aspectRatio: "896 / 692" }}
      >
        {/* Phone — static */}
        <div
          className="absolute top-1/2 left-1/2 z-10"
          style={{
            height: "92%",
            width: "auto",
            aspectRatio: "354 / 632",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 z-[5] w-[70%]"
            style={{
              bottom: "1%",
              height: "7%",
              transform: "translateX(-50%)",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: "10% 0 0",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 48%, transparent 76%)",
                filter: "blur(7px)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "8%",
                right: "8%",
                top: "0%",
                height: "50%",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(243, 235, 226, 0.35) 0%, rgba(150, 205, 255, 0.12) 45%, transparent 78%)",
                filter: "blur(4px)",
              }}
            />
          </div>

          <Image
            src={PHONE_SRC}
            alt="Vodafone router Dashboard on an angled graphite iPhone."
            fill
            sizes="(max-width: 768px) 70vw, 35vw"
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="select-none object-contain object-center [-webkit-user-drag:none]"
            priority
            unoptimized
            style={{ opacity: 0.95 }}
          />
        </div>

        {/* Leaders + arrows in one SVG so every line tip joins its arrow */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {CALLOUTS.map((c, index) => {
            const { x1, y1, x2, y2, arrowPoints } = leaderGeometry(
              c,
              FRAME_W,
              FRAME_H,
            );
            return (
              <g key={`leader-${c.id}`}>
                <line
                  ref={(el) => {
                    lineRefs.current[index] = el;
                  }}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(184, 137, 80, 0.3)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <polygon
                  ref={(el) => {
                    arrowRefs.current[index] = el;
                  }}
                  points={arrowPoints}
                  fill={LINE}
                />
              </g>
            );
          })}
        </svg>

        {/* Spec pills — drift with sticks */}
        {CALLOUTS.map((c, index) => (
          <div
            key={c.id}
            aria-hidden
            className="pointer-events-none absolute z-30"
            style={{
              left: `${c.pillX}%`,
              top: `${c.pillY}%`,
              width: "15.5%",
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              ref={(el) => {
                pillRefs.current[index] = el;
              }}
              className="flex h-full w-full items-center justify-center rounded-full will-change-transform"
              style={{
                background: "rgba(42, 40, 38, 0.2)",
                border: "1px solid rgba(184, 137, 80, 0.5)",
                boxShadow: "none",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
              }}
            >
              <span
                className="flex flex-col items-center justify-center px-1.5 text-center font-medium tracking-wide text-white/90"
                style={{
                  fontSize: "clamp(0.42rem, 0.95vw, 0.58rem)",
                  lineHeight: 1.45,
                }}
              >
                {Array.isArray(c.label) ? (
                  <>
                    <span>{c.label[0]}</span>
                    <span>{c.label[1]}</span>
                  </>
                ) : (
                  c.label
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
