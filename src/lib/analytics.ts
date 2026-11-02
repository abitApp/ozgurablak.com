import { sendGAEvent } from "@next/third-parties/google";

export type ModalAnalyticsPayload = {
  modal_type: "case_study" | "work";
  modal_id: string;
  modal_title: string;
};

/** Fire when a case-study or Other Works modal opens / switches content. */
export function trackModalView(payload: ModalAnalyticsPayload) {
  sendGAEvent("event", "modal_view", payload);
}

/** Fire when that modal closes. */
export function trackModalClose(payload: ModalAnalyticsPayload) {
  sendGAEvent("event", "modal_close", payload);
}
