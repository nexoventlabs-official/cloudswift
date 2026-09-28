import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { workflowAutomationPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(workflowAutomationPage);

export default function Page() {
  return <ServiceLanding page={workflowAutomationPage} />;
}
