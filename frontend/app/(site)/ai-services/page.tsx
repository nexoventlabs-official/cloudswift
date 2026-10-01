import type { Metadata } from "next";
import OfferingCatalog from "@/components/OfferingCatalog";
import { catalogAiServices } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "AI Solutions for Business",
  description:
    "18 AI services from strategy to production — agents, generative AI, SaaS products, and MLOps.",
};

export default function AiServicesPage() {
  return (
    <OfferingCatalog
      title="AI Solutions for Business"
      yearLabel="5 AI practices"
      description="From an AI readiness assessment and sequenced roadmap to ChatGPT Enterprise, document intelligence, AI SaaS products, multi-agent systems, and MLOps infrastructure."
      basePath="/ai-services"
      categories={catalogAiServices}
      ctaLabel="View service"
    />
  );
}
