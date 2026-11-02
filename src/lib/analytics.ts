import { sendGAEvent } from "@next/third-parties/google";

export type ModalAnalyticsPayload = {
  modal_type: "case_study" | "work";
  modal_id: string;
  modal_title: string;
};

function sendAnalyticsEvent(
  eventName: string,
  payload: ModalAnalyticsPayload,
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }
  sendGAEvent("event", eventName, payload);
}

/** Fire when a case-study or Other Works modal opens / switches content. */
export function trackModalView(payload: ModalAnalyticsPayload) {
  sendAnalyticsEvent("modal_view", payload);
}

/** Fire when that modal closes. */
export function trackModalClose(payload: ModalAnalyticsPayload) {
  sendAnalyticsEvent("modal_close", payload);
}
