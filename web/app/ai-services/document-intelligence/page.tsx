import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { documentIntelligencePage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(documentIntelligencePage);

export default function Page() {
  return <ServiceLanding page={documentIntelligencePage} />;
}
