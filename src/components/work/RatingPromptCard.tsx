"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";

export type RatingPlatform = "ios" | "android";

type RatingPromptCardProps = {
  platform: RatingPlatform;
};

const STAR_COUNT = 5;

function StarIcon({
  filled,
  platform,
}: {
  filled: boolean;
  platform: RatingPlatform;
}) {
  const iosFill = filled ? "#F5C542" : "transparent";
  const iosStroke = filled ? "#F5C542" : "rgba(90, 140, 255, 0.85)";
  const androidFill = filled ? "#34A853" : "transparent";
  const androidStroke = filled ? "#34A853" : "rgba(255,255,255,0.35)";

  const fill = platform === "ios" ? iosFill : androidFill;
  const stroke = platform === "ios" ? iosStroke : androidStroke;

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
      aria-hidden
      style={{
        filter: filled
          ? platform === "ios"
            ? "drop-shadow(0 0 5px rgba(245, 197, 66, 0.5))"
            : "drop-shadow(0 0 5px rgba(52, 168, 83, 0.4))"
          : undefined,
      }}
    >
      <path
        d="M12 2.6l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.7 6.6 19.4l1-6.1-4.4-4.3 6.1-.9L12 2.6z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RatingPromptCard({ platform }: RatingPromptCardProps) {
  const labelId = useId();
  const [filledCount, setFilledCount] = useState(STAR_COUNT);
  const [hoverPreview, setHoverPreview] = useState<number | null>(null);

  const displayCount = hoverPreview ?? filledCount;

  const selectRating = (count: number) => {
    setFilledCount(count);
    setHoverPreview(null);
  };

  const onStarKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectRating(index);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      selectRating(Math.min(STAR_COUNT, index + 1));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      selectRating(Math.max(1, index - 1));
    }
  };

  const isIos = platform === "ios";
  const platformLabel = isIos ? "App Store" : "Google Play";

  return (
    <article
      className={`group relative flex h-full min-h-0 w-full origin-center flex-col overflow-hidden transition-transform duration-300 ease-out hover:scale-90 hover:rotate-[5deg] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0 ${
        isIos
          ? "rounded-2xl border border-white/12 bg-[#1c1c1e]/50 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
          : "rounded-[0.9rem] border border-white/10 bg-[#2a211c]/50 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
      }`}
      aria-labelledby={labelId}
    >
      <div className="flex items-center justify-center border-b border-white/[0.08] px-3 py-2">
        <span
          id={labelId}
          className="whitespace-nowrap text-[0.62rem] font-medium tracking-[0.1em] text-white/90 uppercase"
        >
          {platformLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-3 py-3 text-center sm:px-3.5 sm:py-3.5">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.55rem] bg-[#E60000] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <Image
            src="/brands/vodafone.svg"
            alt="Vodafone"
            width={22}
            height={22}
            unoptimized
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="h-[1.15rem] w-[1.15rem] select-none object-contain [-webkit-user-drag:none]"
          />
        </div>

        <p className="mt-4 text-[0.8rem] font-normal leading-none text-white/90">
          Gigabox
        </p>

        {isIos ? (
          <p className="mt-2 max-w-[13rem] text-[0.65rem] leading-snug text-white/50">
            Tap a star to rate it on the App Store.
          </p>
        ) : (
          <p className="mt-2 max-w-[13rem] text-[0.65rem] leading-snug text-white/50">
            Rate your experience after a successful task.
          </p>
        )}

        <div
          className="mt-3 flex items-center justify-center gap-0.5"
          role="radiogroup"
          aria-label={`${platformLabel} rating demonstration`}
          onMouseLeave={() => setHoverPreview(null)}
        >
          {Array.from({ length: STAR_COUNT }, (_, i) => {
            const value = i + 1;
            const filled = value <= displayCount;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={filledCount >= value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className="rounded p-0.5 transition-transform duration-200 ease-out hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2b87a]"
                onMouseEnter={() => setHoverPreview(value)}
                onFocus={() => setHoverPreview(value)}
                onBlur={() => setHoverPreview(null)}
                onClick={() => selectRating(value)}
                onKeyDown={(event) => onStarKeyDown(event, value)}
              >
                <StarIcon filled={filled} platform={platform} />
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-[0.55rem] tracking-[0.12em] text-white/30 uppercase">
          {filledCount} / {STAR_COUNT} selected
        </p>

        <div className="mt-2.5 flex w-full max-w-[12rem] gap-1.5">
          {isIos ? (
            <span className="flex-1 rounded-full bg-white/8 py-1.5 text-center text-[0.68rem] text-white/65">
              Not Now
            </span>
          ) : (
            <>
              <span className="flex-1 rounded-full border border-white/12 py-1.5 text-center text-[0.68rem] text-white/50">
                Not now
              </span>
              <span className="flex-1 rounded-full bg-[#34A853] py-1.5 text-center text-[0.68rem] font-medium text-white/90">
                Submit
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
