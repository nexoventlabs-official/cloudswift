import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiReadinessPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiReadinessPage);

export default function Page() {
  return <ServiceLanding page={aiReadinessPage} />;
}
