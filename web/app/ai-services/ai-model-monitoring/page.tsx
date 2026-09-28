import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { modelMonitoringPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(modelMonitoringPage);

export default function Page() {
  return <ServiceLanding page={modelMonitoringPage} />;
}
