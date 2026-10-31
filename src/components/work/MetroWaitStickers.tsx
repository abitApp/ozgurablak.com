"use client";

import Image from "next/image";

/**
 * Relative layout inside a centered square cluster.
 * Carrot back (−10°), tree mid (+2°), pan front (+10°).
 */
const STICKERS = [
  {
    src: "/media/projects/metro/wait-tree.webp",
    alt: "Animated Christmas tree topped with an M",
    rotate: 2,
    top: "36%",
    left: "calc(16% + 20px)",
    width: "52%",
    zIndex: 2,
    shadow: [
      "drop-shadow(0 8px 14px rgba(0,0,0,0.42))",
      "drop-shadow(0 0 10px rgba(255,190,70,0.34))",
    ].join(" "),
  },
  {
    src: "/media/projects/metro/wait-pan.webp",
    alt: "Animated frying pan tossing colourful ingredients",
    rotate: 10,
    top: "calc(10% + 10px)",
    left: "calc(48% + 45px)",
    width: "37%", // 31% × 1.2
    zIndex: 3,
    shadow: [
      "drop-shadow(0 6px 12px rgba(0,0,0,0.42))",
      "drop-shadow(0 0 8px rgba(200,220,255,0.26))",
    ].join(" "),
  },
  {
    src: "/media/projects/metro/wait-carrot.webp",
    alt: "Animated knife chopping a carrot on a cutting board",
    rotate: -10,
    top: "calc(4% + 40px)",
    left: "2%",
    width: "43%", // was 48% — −10%
    zIndex: 1,
    shadow: [
      "drop-shadow(0 6px 12px rgba(0,0,0,0.42))",
      "drop-shadow(0 0 8px rgba(255,120,70,0.3))",
    ].join(" "),
  },
] as const;

/**
 * METRO Approach — three wait-humour stickers, staggered sizes/tilts.
 * Cluster is centered in the media panel; no scroll.
 */
export function MetroWaitStickers() {
  return (
    <div
      className="relative flex h-full min-h-0 w-full shrink-0 items-center justify-center overflow-hidden"
      aria-label="Wait-state humour animations"
    >
      <div className="relative aspect-square w-[min(100%,22rem)] sm:w-[min(100%,26rem)]">
        {STICKERS.map((sticker) => (
          <div
            key={sticker.src}
            className="absolute"
            style={{
              top: sticker.top,
              left: sticker.left,
              width: sticker.width,
              zIndex: sticker.zIndex,
              transform: `rotate(${sticker.rotate}deg)`,
              filter: `${sticker.shadow} brightness(0.85)`,
            }}
          >
            <Image
              src={sticker.src}
              alt={sticker.alt}
              width={600}
              height={600}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className="h-auto w-full select-none object-contain [-webkit-user-drag:none]"
              unoptimized
              sizes="(max-width: 768px) 40vw, 16vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
