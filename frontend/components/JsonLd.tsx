import Script from "next/script";
import type { AgentPage } from "@/lib/agentPages";
import { agentPageJsonLd } from "@/lib/agentPages";

export default function JsonLd({ page }: { page: AgentPage }) {
  const data = agentPageJsonLd(page);
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
}
