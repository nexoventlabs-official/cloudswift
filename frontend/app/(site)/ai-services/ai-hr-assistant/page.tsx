import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { hrAssistantPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(hrAssistantPage);

export default function Page() {
  return <ServiceLanding page={hrAssistantPage} />;
}
