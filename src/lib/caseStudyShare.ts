/** Query params for shareable case-study deep links. */
export const STUDY_PARAM = "study";
export const SECTION_PARAM = "section";

export type CaseStudyLink = {
  slug: string;
  sectionId?: string;
};

export function readCaseStudyLink(
  search = typeof window !== "undefined" ? window.location.search : "",
): CaseStudyLink | null {
  const params = new URLSearchParams(search);
  const slug = params.get(STUDY_PARAM)?.trim();
  if (!slug) return null;
  const sectionId = params.get(SECTION_PARAM)?.trim() || undefined;
  return { slug, sectionId };
}

/** Absolute share URL for a case study (optionally a section). */
export function buildCaseStudyShareUrl(
  slug: string,
  sectionId?: string,
  base =
    typeof window !== "undefined"
      ? window.location.href
      : "https://ozgurablak.com/",
): string {
  const url = new URL(base);
  url.searchParams.set(STUDY_PARAM, slug);
  if (sectionId) {
    url.searchParams.set(SECTION_PARAM, sectionId);
  } else {
    url.searchParams.delete(SECTION_PARAM);
  }
  url.hash = "";
  return url.toString();
}

/** Sync the address bar without adding a history entry. */
export function writeCaseStudyLink(
  slug: string | null,
  sectionId?: string,
): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!slug) {
    url.searchParams.delete(STUDY_PARAM);
    url.searchParams.delete(SECTION_PARAM);
  } else {
    url.searchParams.set(STUDY_PARAM, slug);
    if (sectionId) {
      url.searchParams.set(SECTION_PARAM, sectionId);
    } else {
      url.searchParams.delete(SECTION_PARAM);
    }
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  window.history.replaceState(window.history.state, "", next);
}
