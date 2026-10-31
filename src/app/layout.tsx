import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { motto, sans } from "@/lib/fonts";
import "./globals.css";

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
      </body>
    </html>
  );
}
