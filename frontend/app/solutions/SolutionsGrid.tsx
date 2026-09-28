"use client";
import OfferingCatalog from "@/components/OfferingCatalog";
import { catalogSolutionCategories } from "@/lib/catalog";

export default function SolutionsGrid() {
  return (
    <OfferingCatalog
      title="Cloud & Business Platforms"
      yearLabel="2 platform groups"
      description="Enterprise platforms we architect, secure, and operate — Azure, AWS, GCP, Microsoft 365, Dynamics 365, and Power BI under one SLA."
      basePath="/solutions"
      categories={catalogSolutionCategories}
    />
  );
}
