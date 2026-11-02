import { Caveat, Cormorant_Garamond, Poppins } from "next/font/google";

/** Body / UI — only weights used across the site (+ italic for hero subline). */
export const sans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});

/** Hero motto only uses bold Cormorant. */
export const motto = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  adjustFontFallback: true,
});

/** Polaroid caption — below the fold; don't preload on first paint. */
export const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});
