"use client";

import { useEffect } from "react";
import type { AgentPage } from "@/lib/agentPages";
import { queryVariantMap } from "@/lib/agentPages";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function GtmAgentPage({ page }: { page: AgentPage }) {
  useEffect(() => {
    const row = queryVariantMap.find((item) => item.url === page.path);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: page.gtmEvent ?? row?.gtm.event ?? "agent_page_view",
      content_group: page.category,
      content_group2: page.path,
      primary_query: page.queryVariants[0],
      query_variants: page.queryVariants.join("|"),
      page_title: page.metaTitle,
    });
  }, [page]);
  return null;
}
