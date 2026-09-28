import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import AIAssistant from "@/components/AIAssistant";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import MetaPixel from "@/components/MetaPixel";
import { company } from "@/lib/data";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: {
    default: `${company.name} — Cloud, AI & Managed IT Solutions Built for Modern Enterprises`,
    template: `%s — ${company.name}`,
  },
  description: company.description,
  keywords: [
    "CloudSwift",
    "Azure Expert MSP",
    "Cloud Migration",
    "Microsoft 365",
    "Dynamics 365",
    "AI Services",
    "Bengaluru",
  ],
  openGraph: {
    siteName: company.name,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={manrope.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={manrope.className} suppressHydrationWarning>
        <GoogleTagManagerNoScript />
        <GoogleTagManager />
        <MetaPixel />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <AIAssistant />
      </body>
    </html>
  );
}
