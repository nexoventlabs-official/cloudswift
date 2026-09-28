import type { Metadata } from "next";
import IndustriesTwoColumnLayout from "@/components/IndustriesTwoColumnLayout";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industry-focused cloud, data, application, and managed technology services from CloudSwift.",
};

export default function IndustriesPage() {
  return <IndustriesTwoColumnLayout />;
}



