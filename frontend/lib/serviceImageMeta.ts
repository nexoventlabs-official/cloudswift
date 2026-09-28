export type ServiceImageMeta = {
  slug: string;
  width: number;
  height: number;
  widths: number[];
  fallback: string;
};

/** Intrinsic sizes and srcset widths for fluid AI-service heroes. */
export const SERVICE_IMAGE_META: Record<string, ServiceImageMeta> = {
  "/images/cs/ai-services/ai-model-deployment.webp": {
    slug: "ai-model-deployment",
    width: 1024,
    height: 655,
    widths: [400, 800, 1024],
    fallback: "ai-model-deployment-1024.jpg",
  },
  "/images/cs/ai-services/ai-model-monitoring.webp": {
    slug: "ai-model-monitoring",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-model-monitoring-1024.jpg",
  },
  "/images/cs/ai-services/ai-hr-assistant.webp": {
    slug: "ai-hr-assistant",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-hr-assistant-1024.jpg",
  },
  "/images/cs/ai-services/ai-development-services.webp": {
    slug: "ai-development-services",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-development-services-1024.jpg",
  },
  "/images/cs/ai-services/ai-sales-assistant.webp": {
    slug: "ai-sales-assistant",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-sales-assistant-1024.jpg",
  },
  "/images/cs/ai-services/customer-support-agents.webp": {
    slug: "customer-support-agents",
    width: 1586,
    height: 992,
    widths: [400, 800, 1200, 1586],
    fallback: "customer-support-agents-1200.jpg",
  },
  "/images/cs/ai-services/enterprise-knowledge-base-agents.webp": {
    slug: "enterprise-knowledge-base-agents",
    width: 1586,
    height: 992,
    widths: [400, 800, 1200, 1586],
    fallback: "enterprise-knowledge-base-agents-1200.jpg",
  },
  "/images/cs/ai-services/enterprise-chatbots.webp": {
    slug: "enterprise-chatbots",
    width: 1024,
    height: 640,
    widths: [400, 800, 1024],
    fallback: "enterprise-chatbots-1024.jpg",
  },
  "/images/cs/ai-services/ai-readiness-assessment.webp": {
    slug: "ai-readiness-assessment",
    width: 2624,
    height: 1632,
    widths: [400, 800, 1200, 1600],
    fallback: "ai-readiness-assessment-1200.jpg",
  },
  "/images/cs/ai-services/ai-infrastructure.webp": {
    slug: "ai-infrastructure",
    width: 2624,
    height: 1632,
    widths: [400, 800, 1200, 1600],
    fallback: "ai-infrastructure-1200.jpg",
  },
  "/images/cs/ai-services/ai-mvp-development.webp": {
    slug: "ai-mvp-development",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-mvp-development-1024.jpg",
  },
  "/images/cs/ai-services/ai-saas-product-development.webp": {
    slug: "ai-saas-product-development",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "ai-saas-product-development-1024.jpg",
  },
  "/images/cs/ai-services/chatgpt-enterprise-integration.webp": {
    slug: "chatgpt-enterprise-integration",
    width: 2624,
    height: 1632,
    widths: [400, 800, 1200, 1600],
    fallback: "chatgpt-enterprise-integration-1200.jpg",
  },
  "/images/cs/ai-services/multi-agent-systems.webp": {
    slug: "multi-agent-systems",
    width: 1024,
    height: 637,
    widths: [400, 800, 1024],
    fallback: "multi-agent-systems-1024.jpg",
  },
  "/images/cs/ai-services/ai-strategy-roadmap.webp": {
    slug: "ai-strategy-roadmap",
    width: 2624,
    height: 1632,
    widths: [400, 800, 1200, 1600],
    fallback: "ai-strategy-roadmap-1200.jpg",
  },
};

const OPT = "/images/cs/ai-services/opt";

export function getServiceImageMeta(src?: string | null) {
  if (!src) return undefined;
  return SERVICE_IMAGE_META[src];
}

export function serviceSrcSet(slug: string, widths: number[], ext: "avif" | "webp") {
  return widths.map((w) => `${OPT}/${slug}-${w}.${ext} ${w}w`).join(", ");
}

export function serviceFallbackSrc(meta: ServiceImageMeta) {
  return `${OPT}/${meta.fallback}`;
}
