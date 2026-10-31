"use client";

import { RatingPromptCard } from "@/components/work/RatingPromptCard";

/**
 * Illustrative in-app rating prompts for the Vodafone Approach layer.
 */
export function RatingPromptDemo() {
  return (
    <section
      className="relative flex h-full min-h-0 w-full items-center justify-center"
      aria-label="In-app rating prompt demonstration"
    >
      <div className="grid w-full grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-3.5">
        <RatingPromptCard platform="ios" />
        <RatingPromptCard platform="android" />
      </div>
    </section>
  );
}
