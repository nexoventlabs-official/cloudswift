import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { multiAgentSystemsPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(multiAgentSystemsPage);

export default function Page() {
  return <ServiceLanding page={multiAgentSystemsPage} />;
}
