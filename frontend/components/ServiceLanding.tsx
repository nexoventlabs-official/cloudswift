import JsonLd from "@/components/JsonLd";
import GtmAgentPage from "@/components/GtmAgentPage";
import AiServiceDetail from "@/components/AiServiceDetail";
import type { AgentPage } from "@/lib/agentPages";

export default function ServiceLanding({ page }: { page: AgentPage }) {
  return (
    <>
      <JsonLd page={page} />
      <GtmAgentPage page={page} />
      <AiServiceDetail page={page} />
    </>
  );
}
