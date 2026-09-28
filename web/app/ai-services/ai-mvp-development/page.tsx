import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiMvpDevelopmentPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiMvpDevelopmentPage);

export default function Page() {
  return <ServiceLanding page={aiMvpDevelopmentPage} />;
}
