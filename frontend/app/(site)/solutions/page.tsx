import type { Metadata } from "next";
import SolutionsGrid from "./SolutionsGrid";

export const metadata: Metadata = {
  title: "Cloud & Business Platforms",
  description:
    "Design, implement and manage Azure, AWS, GCP, Microsoft 365, Dynamics 365 and Power BI.",
};

export default function SolutionsPage() {
  return <SolutionsGrid />;
}
