import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";
import { chatgptEnterprisePage, agentPageMetadata } from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(chatgptEnterprisePage);

export default function Page() {
  return <ServiceLanding page={chatgptEnterprisePage} />;
}
