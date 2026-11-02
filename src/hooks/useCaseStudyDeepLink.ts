"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readCaseStudyLink,
  writeCaseStudyLink,
} from "@/lib/caseStudyShare";

/**
 * Opens this case study when `?study=<slug>` matches, and clears the URL on close.
 */
export function useCaseStudyDeepLink(slug: string) {
  const readMatch = useCallback(() => {
    const link = readCaseStudyLink();
    if (!link || link.slug !== slug) {
      return { open: false, sectionId: undefined as string | undefined };
    }
    return { open: true, sectionId: link.sectionId };
  }, [slug]);

  const [openFromLink, setOpenFromLink] = useState(false);
  const [initialSectionId, setInitialSectionId] = useState<
    string | undefined
  >();

  useEffect(() => {
    const apply = () => {
      const match = readMatch();
      setOpenFromLink(match.open);
      setInitialSectionId(match.sectionId);
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, [readMatch]);

  const clearLink = useCallback(() => {
    const link = readCaseStudyLink();
    if (link?.slug === slug) {
      writeCaseStudyLink(null);
    }
    setOpenFromLink(false);
    setInitialSectionId(undefined);
  }, [slug]);

  return { openFromLink, initialSectionId, clearLink };
}
