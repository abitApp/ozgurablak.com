/** Query params for shareable case-study / Other Works deep links. */
export const STUDY_PARAM = "study";
export const SECTION_PARAM = "section";
export const WORK_PARAM = "work";

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

export function readWorkLink(
  search = typeof window !== "undefined" ? window.location.search : "",
): string | null {
  const id = new URLSearchParams(search).get(WORK_PARAM)?.trim();
  return id || null;
}

function applyUrl(mutate: (url: URL) => void): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  mutate(url);
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  window.history.replaceState(window.history.state, "", next);
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
  url.searchParams.delete(WORK_PARAM);
  url.searchParams.set(STUDY_PARAM, slug);
  if (sectionId) {
    url.searchParams.set(SECTION_PARAM, sectionId);
  } else {
    url.searchParams.delete(SECTION_PARAM);
  }
  url.hash = "";
  return url.toString();
}

/** Absolute share URL for an Other Works modal. */
export function buildWorkShareUrl(
  workId: string,
  base =
    typeof window !== "undefined"
      ? window.location.href
      : "https://ozgurablak.com/",
): string {
  const url = new URL(base);
  url.searchParams.delete(STUDY_PARAM);
  url.searchParams.delete(SECTION_PARAM);
  url.searchParams.set(WORK_PARAM, workId);
  url.hash = "";
  return url.toString();
}

/** Sync the address bar for a case study (clears work param). */
export function writeCaseStudyLink(
  slug: string | null,
  sectionId?: string,
): void {
  applyUrl((url) => {
    if (!slug) {
      url.searchParams.delete(STUDY_PARAM);
      url.searchParams.delete(SECTION_PARAM);
      return;
    }
    url.searchParams.delete(WORK_PARAM);
    url.searchParams.set(STUDY_PARAM, slug);
    if (sectionId) {
      url.searchParams.set(SECTION_PARAM, sectionId);
    } else {
      url.searchParams.delete(SECTION_PARAM);
    }
  });
}

/** Sync the address bar for an Other Work (clears study params). */
export function writeWorkLink(workId: string | null): void {
  applyUrl((url) => {
    if (!workId) {
      url.searchParams.delete(WORK_PARAM);
      return;
    }
    url.searchParams.delete(STUDY_PARAM);
    url.searchParams.delete(SECTION_PARAM);
    url.searchParams.set(WORK_PARAM, workId);
  });
}
