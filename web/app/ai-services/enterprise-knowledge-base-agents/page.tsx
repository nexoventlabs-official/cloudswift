import type { Metadata } from "next";
import AiServiceDetail from "@/components/AiServiceDetail";
import JsonLd from "@/components/JsonLd";
import GtmAgentPage from "@/components/GtmAgentPage";
import {
  enterpriseKnowledgePage,
  agentPageMetadata,
} from "@/lib/agentPages";

export const metadata: Metadata = agentPageMetadata(enterpriseKnowledgePage);

export default function EnterpriseKnowledgeBaseAgentsPage() {
  return (
    <>
      <JsonLd page={enterpriseKnowledgePage} />
      <GtmAgentPage page={enterpriseKnowledgePage} />
      <AiServiceDetail page={enterpriseKnowledgePage} />
    </>
  );
}
