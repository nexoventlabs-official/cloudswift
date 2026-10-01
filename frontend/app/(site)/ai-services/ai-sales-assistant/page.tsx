import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { salesAssistantPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(salesAssistantPage);

export default function Page() {
  return <ServiceLanding page={salesAssistantPage} />;
}
