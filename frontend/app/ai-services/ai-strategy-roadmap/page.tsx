import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiStrategyRoadmapPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiStrategyRoadmapPage);

export default function Page() {
  return <ServiceLanding page={aiStrategyRoadmapPage} />;
}
