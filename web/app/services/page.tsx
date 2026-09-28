import type { Metadata } from "next";
import OfferingCatalog from "@/components/OfferingCatalog";
import { catalogServices } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Complete IT Services for Enterprises",
  description:
    "21 enterprise services from CloudSwift — applications, infrastructure, security, workplace, advisory, and transformation.",
};

export default function ServicesPage() {
  return (
    <OfferingCatalog
      title="Complete IT Services for Enterprises"
      yearLabel="6 practice areas"
      description="Applications, infrastructure, cybersecurity, digital workplace, consulting and technology transformation."
      basePath="/services"
      categories={catalogServices}
      ctaLabel="View service"
    />
  );
}
