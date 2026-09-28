import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { enterpriseChatbotsPage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(enterpriseChatbotsPage);

export default function Page() {
  return <ServiceLanding page={enterpriseChatbotsPage} />;
}
