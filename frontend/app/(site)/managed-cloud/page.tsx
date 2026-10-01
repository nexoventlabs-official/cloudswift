import type { Metadata } from "next";
import OfferingCatalog from "@/components/OfferingCatalog";
import { catalogManagedCloud } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Managed Cloud Services",
  description:
    "25 managed cloud services — Azure, AWS, GCP, Microsoft 365, Oracle, private cloud, security, and data centre.",
};

export default function ManagedCloudPage() {
  return (
    <OfferingCatalog
      title="Managed Cloud Services"
      yearLabel="6 cloud domains"
      description="We manage your cloud environment from migration and security to monitoring, support and cost optimization."
      basePath="/managed-cloud"
      categories={catalogManagedCloud}
      ctaLabel="View service"
    />
  );
}
