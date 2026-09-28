import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { modelDeploymentPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(modelDeploymentPage);

export default function Page() {
  return <ServiceLanding page={modelDeploymentPage} />;
}
