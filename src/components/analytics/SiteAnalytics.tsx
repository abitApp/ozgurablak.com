"use client";

import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  isInternalTraffic,
  subscribeInternalTraffic,
  syncInternalFlagFromUrl,
} from "@/lib/internal-traffic";

/** Public Measurement ID — also set NEXT_PUBLIC_GA_ID in Vercel if preferred. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VTZ4NEKD2K";
const CLARITY_ID = "xer0ubl8wt";

const SECTION_IDS = ["work", "my-products", "about", "contact"] as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function sendSectionEvent(
  eventName: "section_view" | "section_time",
  params: Record<string, string | number>,
) {
  // Checked at send time so even a late cleanup flush stays silent.
  if (isInternalTraffic()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

const noopSubscribe = () => () => {};

/** Re-applies `?internal=1|0` on every client-side navigation. */
function InternalTrafficWatcher() {
  const search = useSearchParams().toString();

  useEffect(() => {
    syncInternalFlagFromUrl(search ? `?${search}` : "");
  }, [search]);

  return null;
}

/**
 * Production-only analytics.
 * - `?internal=1` / `?internal=0` toggles localStorage.internal_traffic
 *   (on first load and on every client-side navigation)
 * - Internal visits load nothing: no GA, no Clarity, no section or modal events
 * - If the flag turns on after scripts already loaded, GA is hard-disabled via
 *   `ga-disable-<ID>` and Clarity is told to stop; switching back re-enables GA
 *   and restarts Clarity (`clarity("start")`) without a reload
 */
export function SiteAnalytics() {
  // false on the server and during hydration, true afterwards (production only).
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => process.env.NODE_ENV === "production",
    () => false,
  );
  const internal = useSyncExternalStore(
    subscribeInternalTraffic,
    isInternalTraffic,
    () => false,
  );
  // True only while a running Clarity was stopped by us and may need a restart.
  const clarityStopped = useRef(false);

  // Flag flipped mid-session: silence trackers already running, and bring
  // them back when the visitor goes from internal to normal again.
  useEffect(() => {
    if (!ready) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] =
      internal;

    try {
      if (internal) {
        if (typeof window.clarity === "function") {
          window.clarity("consent", false);
          window.clarity("stop");
          clarityStopped.current = true;
        }
      } else if (clarityStopped.current) {
        clarityStopped.current = false;
        // After "stop", window.clarity is a queue stub; "start" is moved to the
        // front of that queue and boots Clarity again without a reload.
        window.clarity?.("start");
        window.clarity?.("consent", true);
      }
    } catch {
      // best effort — tracking must never break the page
    }
  }, [ready, internal]);

  useEffect(() => {
    if (!ready || internal) return;

    const viewed = new Set<string>();
    const enteredAt = new Map<string, number>();
    const totalMs = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;

          const visible =
            entry.isIntersecting && entry.intersectionRatio >= 0.5;

          if (visible) {
            if (!viewed.has(id)) {
              viewed.add(id);
              sendSectionEvent("section_view", { section_id: id });
            }
            if (!enteredAt.has(id)) {
              enteredAt.set(id, now);
            }
            continue;
          }

          const start = enteredAt.get(id);
          if (start === undefined) continue;
          enteredAt.delete(id);
          const next = (totalMs.get(id) ?? 0) + (now - start);
          totalMs.set(id, next);
          sendSectionEvent("section_time", {
            section_id: id,
            seconds: Math.round(next / 1000),
          });
        }
      },
      { threshold: 0.5 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      const now = performance.now();
      for (const [id, start] of enteredAt) {
        const next = (totalMs.get(id) ?? 0) + (now - start);
        sendSectionEvent("section_time", {
          section_id: id,
          seconds: Math.round(next / 1000),
        });
      }
      observer.disconnect();
    };
  }, [ready, internal]);

  if (!ready) return null;

  return (
    <>
      {/* useSearchParams must sit in Suspense so static pages still prerender. */}
      <Suspense fallback={null}>
        <InternalTrafficWatcher />
      </Suspense>
      {!internal ? (
        <>
          <Script
            id="_next-ga"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="_next-ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
          </Script>
        </>
      ) : null}
    </>
  );
}
