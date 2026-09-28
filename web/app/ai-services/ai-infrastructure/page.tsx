import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiInfrastructurePage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiInfrastructurePage);

export default function Page() {
  return <ServiceLanding page={aiInfrastructurePage} />;
}
