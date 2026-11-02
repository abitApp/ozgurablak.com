"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/** Public Measurement ID — also set NEXT_PUBLIC_GA_ID in Vercel if preferred. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VTZ4NEKD2K";
const CLARITY_ID = "xer0ubl8wt";

const SECTION_IDS = ["work", "my-products", "about", "contact"] as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function syncInternalFlagFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("internal") === "1") {
      window.localStorage.setItem("internal_traffic", "true");
    } else if (params.get("internal") === "0") {
      window.localStorage.removeItem("internal_traffic");
    }
  } catch {
    // ignore quota / private mode
  }
}

function isInternalTraffic(): boolean {
  try {
    return window.localStorage.getItem("internal_traffic") === "true";
  } catch {
    return false;
  }
}

function sendSectionEvent(
  eventName: "section_view" | "section_time",
  params: Record<string, string | number>,
) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/**
 * Production-only analytics.
 * - `?internal=1` / `?internal=0` toggles localStorage.internal_traffic
 * - GA always loads in production; internal visits get traffic_type: "internal"
 * - Clarity + section tracking skip when the internal flag is set
 */
export function SiteAnalytics() {
  const [ready, setReady] = useState(false);
  const [internal, setInternal] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    syncInternalFlagFromUrl();
    setInternal(isInternalTraffic());
    setReady(true);
  }, []);

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

  const gaConfig = internal
    ? `{ 'traffic_type': 'internal' }`
    : "";

  return (
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
gtag('config', '${GA_ID}'${gaConfig ? `, ${gaConfig}` : ""});`}
      </Script>
      {!internal ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      ) : null}
    </>
  );
}
