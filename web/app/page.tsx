import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";

export const metadata: Metadata = {
  title: "CloudSwift — Azure Expert MSP for Indian Startups",
  description:
    "Managed Azure services for Indian startups and growing companies. 15-min response, 99.97% uptime SLA. Azure Expert MSP — Bengaluru.",
  alternates: { canonical: "https://oncloudswift.com" },
  openGraph: {
    title: "CloudSwift — Azure Expert MSP for Indian Startups",
    description:
      "Managed Azure services for Indian startups and growing companies.",
    url: "https://oncloudswift.com",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};
import HowWeHelp from "@/components/HowWeHelp";
import PlatformOrbit from "@/components/PlatformOrbit";
import OfferingsMarquee from "@/components/OfferingsMarquee";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

/**
 * Home narrative (template layout preserved):
 * 1. Hero — what we run
 * 2. Platforms — estate map
 * 3. How we help — Migrate / Secure / Operate
 * 4. What we offer — service hubs
 * 5. Proof — stats
 * 6. Featured solutions
 * 7. Social proof + FAQ + footer
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlatformOrbit />
      <OfferingsMarquee />
      <HowWeHelp />
      <ServicesSection />
      <StatsSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </>
  );
}
