import type { Metadata } from "next";
import AiServiceDetail from "@/components/AiServiceDetail";
import JsonLd from "@/components/JsonLd";
import GtmAgentPage from "@/components/GtmAgentPage";
import {
  customerSupportPage,
  agentPageMetadata,
} from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(customerSupportPage);

export default function CustomerSupportAgentsPage() {
  return (
    <>
      <JsonLd page={customerSupportPage} />
      <GtmAgentPage page={customerSupportPage} />
      <AiServiceDetail page={customerSupportPage} />
    </>
  );
}
