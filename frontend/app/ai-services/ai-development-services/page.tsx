import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiDevelopmentServicesPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiDevelopmentServicesPage);

export default function Page() {
  return <ServiceLanding page={aiDevelopmentServicesPage} />;
}
