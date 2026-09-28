/** Allow CloudSeek-sourced images (webp/svg) in the Nyro template. */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // AVIF often shifts warm golds into a light yellow cast on this gradient
    formats: ["image/webp"],
    deviceSizes: [400, 800, 1200, 1600, 1920],
    imageSizes: [400, 800],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    qualities: [75, 90, 100],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/ai-services/ai-customer-agent",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/services/customer-experience-agents",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/ai-services/customer-experience-agents",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/services/customer-support-agents",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/services/customer-service-agents",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/services/customer-service-ai-agents",
        destination: "/ai-services/customer-support-agents",
        permanent: true,
      },
      {
        source: "/ai-services/ai-knowledge-agent",
        destination: "/ai-services/enterprise-knowledge-base-agents",
        permanent: true,
      },
      {
        source: "/services/enterprise-knowledge-base-agents",
        destination: "/ai-services/enterprise-knowledge-base-agents",
        permanent: true,
      },
      {
        source: "/services/enterprise-knowledge-agents",
        destination: "/ai-services/enterprise-knowledge-base-agents",
        permanent: true,
      },
      {
        source: "/ai-services/ai-deploy",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/ai-model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/ai-services/model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/services/ai-model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/mlops/ai-model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/ai-operations/ai-model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/ai-operations/model-deployment",
        destination: "/ai-services/ai-model-deployment",
        permanent: true,
      },
      {
        source: "/ai-services/ai-hr-agent",
        destination: "/ai-services/ai-hr-assistant",
        permanent: true,
      },
      {
        source: "/services/ai-hr-assistant",
        destination: "/ai-services/ai-hr-assistant",
        permanent: true,
      },
      {
        source: "/ai-services/ai-sales-agent",
        destination: "/ai-services/ai-sales-assistant",
        permanent: true,
      },
      {
        source: "/services/ai-sales-assistant",
        destination: "/ai-services/ai-sales-assistant",
        permanent: true,
      },
      {
        source: "/ai-services/ai-monitoring",
        destination: "/ai-services/ai-model-monitoring",
        permanent: true,
      },
      {
        source: "/services/ai-model-monitoring",
        destination: "/ai-services/ai-model-monitoring",
        permanent: true,
      },
      {
        source: "/ai-services/ai-workflow-agent",
        destination: "/ai-services/ai-workflow-automation",
        permanent: true,
      },
      {
        source: "/services/ai-workflow-automation",
        destination: "/ai-services/ai-workflow-automation",
        permanent: true,
      },
      {
        source: "/ai-services/ai-chatbot-enterprise",
        destination: "/ai-services/enterprise-chatbots",
        permanent: true,
      },
      {
        source: "/services/enterprise-chatbots",
        destination: "/ai-services/enterprise-chatbots",
        permanent: true,
      },
      {
        source: "/ai-agents/enterprise-chatbots",
        destination: "/ai-services/enterprise-chatbots",
        permanent: true,
      },
      {
        source: "/ai-services/ai-doc-intelligence",
        destination: "/ai-services/document-intelligence",
        permanent: true,
      },
      {
        source: "/ai-operations/document-intelligence",
        destination: "/ai-services/document-intelligence",
        permanent: true,
      },
      {
        source: "/services/document-intelligence",
        destination: "/ai-services/document-intelligence",
        permanent: true,
      },
      {
        source: "/ai-operations",
        destination: "/ai-services",
        permanent: true,
      },
      {
        source: "/solutions/ai-services",
        destination: "/ai-services",
        permanent: true,
      },
      {
        source: "/platform",
        destination: "/ai-services",
        permanent: false,
      },
      {
        source: "/ai-services/ai-platforms",
        destination: "/ai-services",
        permanent: true,
      },
      {
        source: "/ai-services/ai-infra",
        destination: "/ai-services/ai-infrastructure",
        permanent: true,
      },
      {
        source: "/services/ai-infrastructure",
        destination: "/ai-services/ai-infrastructure",
        permanent: true,
      },
      {
        source: "/ai-services/ai-powered-apps",
        destination: "/ai-services/ai-development-services",
        permanent: true,
      },
      {
        source: "/services/ai-development-services",
        destination: "/ai-services/ai-development-services",
        permanent: true,
      },
      {
        source: "/ai-services/ai-mvp",
        destination: "/ai-services/ai-mvp-development",
        permanent: true,
      },
      {
        source: "/services/ai-mvp-development",
        destination: "/ai-services/ai-mvp-development",
        permanent: true,
      },
      {
        source: "/ai-services/ai-chatgpt",
        destination: "/ai-services/chatgpt-enterprise-integration",
        permanent: true,
      },
      {
        source: "/ai-services/enterprise-chatgpt",
        destination: "/ai-services/chatgpt-enterprise-integration",
        permanent: true,
      },
      {
        source: "/services/chatgpt-enterprise-integration",
        destination: "/ai-services/chatgpt-enterprise-integration",
        permanent: true,
      },
      {
        source: "/ai-services/ai-readiness",
        destination: "/ai-services/ai-readiness-assessment",
        permanent: true,
      },
      {
        source: "/services/ai-readiness-assessment",
        destination: "/ai-services/ai-readiness-assessment",
        permanent: true,
      },
      {
        source: "/ai-services/ai-roadmap",
        destination: "/ai-services/ai-strategy-roadmap",
        permanent: true,
      },
      {
        source: "/services/ai-strategy-roadmap",
        destination: "/ai-services/ai-strategy-roadmap",
        permanent: true,
      },
      {
        source: "/ai-services/ai-usecase",
        destination: "/ai-services/ai-strategy-roadmap",
        permanent: true,
      },
      {
        source: "/services/ai-use-case-discovery",
        destination: "/ai-services/ai-strategy-roadmap",
        permanent: true,
      },
      {
        source: "/ai-services/ai-optimization",
        destination: "/ai-services",
        permanent: true,
      },
      {
        source: "/services/continuous-optimization",
        destination: "/ai-services",
        permanent: true,
      },
      {
        source: "/ai-services/ai-saas",
        destination: "/ai-services/ai-saas-product-development",
        permanent: true,
      },
      {
        source: "/services/ai-saas-product-development",
        destination: "/ai-services/ai-saas-product-development",
        permanent: true,
      },
      {
        source: "/ai-services/ai-multi-agent",
        destination: "/ai-services/multi-agent-systems",
        permanent: true,
      },
      {
        source: "/services/multi-agent-systems",
        destination: "/ai-services/multi-agent-systems",
        permanent: true,
      },
      {
        source: "/integrations",
        destination: "/services/integration",
        permanent: false,
      },
      {
        source: "/case-studies",
        destination: "/projects",
        permanent: false,
      },
      {
        source: "/pricing",
        destination: "/contact",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
