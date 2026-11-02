import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { motto, sans } from "@/lib/fonts";
import "./globals.css";

/** Public Measurement ID — also set NEXT_PUBLIC_GA_ID in Vercel if preferred. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VTZ4NEKD2K";

export const metadata: Metadata = {
  title: "Özgür Ablak — Product Designer",
  description:
    "Senior/Principal Product Designer portfolio. UX/UI, digital products, mobile apps, B2B platforms, and design systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${motto.variable} h-full`}
      suppressHydrationWarning
    >
      <body className={`${sans.className} min-h-full antialiased`}>
        <SiteHeader />
        {children}
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}
