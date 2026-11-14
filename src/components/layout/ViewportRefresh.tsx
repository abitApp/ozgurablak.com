"use client";

import { useEffect } from "react";

/**
 * iPad / iPhone Safari can keep the previous orientation's layout viewport
 * after a rotate (page stays portrait-width inside a landscape screen).
 * Re-applying the viewport meta makes Safari recompute it. No-op elsewhere.
 */
export function ViewportRefresh() {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]',
    );
    if (!meta) return;

    const original = meta.content || "width=device-width, initial-scale=1";
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    const refresh = () => {
      meta.content = `${original}, maximum-scale=1`;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        meta.content = original;
      });
    };

    const schedule = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
      // Rotation animation settles at different times across iPadOS versions.
      timers.push(setTimeout(refresh, 120), setTimeout(refresh, 500));
    };

    window.addEventListener("orientationchange", schedule);
    window.screen.orientation?.addEventListener("change", schedule);

    return () => {
      window.removeEventListener("orientationchange", schedule);
      window.screen.orientation?.removeEventListener("change", schedule);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      meta.content = original;
    };
  }, []);

  return null;
}
