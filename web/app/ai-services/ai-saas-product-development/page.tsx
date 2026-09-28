import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { aiSaasProductDevelopmentPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(aiSaasProductDevelopmentPage);

export default function Page() {
  return <ServiceLanding page={aiSaasProductDevelopmentPage} />;
}
