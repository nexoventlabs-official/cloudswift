/**
 * CloudSwift AI knowledge — adapted from cloudseek backend system-prompt.ts
 * Answers run locally in the Nyro template chat widget (no design copy).
 */

import { company, services, projects, faqs, team } from "./data";
import {
  allServiceItems,
  allManagedItems,
  allAiItems,
} from "./catalog";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const CLOUDSWIFT_SYSTEM_KNOWLEDGE = `
You are CloudSwift AI, the official website assistant for CloudSwift Technologies (oncloudswift.com).
Only discuss CloudSwift and its cloud / Microsoft / IT / security / AI services.
Never invent pricing. For pricing: customized per engagement — book a free consultation.
Keep answers short (1–3 sentences or up to 5 bullets). Answer first, then optionally one CTA.

COMPANY
- ${company.legalName} — Azure Expert MSP
- Founded ${company.founded}, HQ ${company.hq}. Offices: Mumbai; Lewes, Delaware, USA
- 450+ enterprise clients across India, Middle East (Gulf), and United States
- SLA: 99.97% uptime, 15-minute critical response, ~87% first-call resolution
- Certifications: ISO 27001, SOC 2 Type II
- Partnerships: Microsoft Solutions Partner / Azure Expert MSP, AWS, Google Cloud, Oracle Cloud MSP, Cisco, VMware, and others
- Trust: ${company.trust.join(", ")}

CONTACT
- India email: ${company.email}
- US email: ${company.emailUs}
- Phones: ${company.phone}, ${company.phoneAlt}; USA ${company.phoneUs}
- WhatsApp: ${company.whatsapp}
- Book free 30-min consultation: ${company.calendly}
- HQ: ${company.address}

TEAM
${team.map((t) => `- ${t.name} — ${t.role}`).join("\n")}

SOLUTIONS (/solutions)
${projects.map((p) => `- ${p.title}: ${p.description}`).join("\n")}

FLAGSHIP SERVICES / HUBS
${services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}

FULL CATALOG COUNTS
- Enterprise Services: ${allServiceItems.length} → /services
- Managed Cloud: ${allManagedItems.length} → /managed-cloud
- AI Services: ${allAiItems.length} → /ai-services
- Solutions: ${projects.length} → /solutions

ENTERPRISE SERVICES (sample)
${allServiceItems
  .slice(0, 8)
  .map((i) => `- ${i.title}: ${i.desc}`)
  .join("\n")}

MANAGED CLOUD (sample)
${allManagedItems
  .slice(0, 8)
  .map((i) => `- ${i.title}: ${i.desc}`)
  .join("\n")}

AI SERVICES (sample)
${allAiItems
  .slice(0, 8)
  .map((i) => `- ${i.title}: ${i.desc}`)
  .join("\n")}

ALSO OFFERED
- Managed Cloud: AWS, Azure, GCP, M365, VMware, Hyper-V, Oracle MSP, backup/DR, compliance
- AI Services: readiness, roadmaps, support/knowledge/sales/HR agents, ChatGPT integrations, MLOps
- AI Model Deployment (canonical): /ai-services/ai-model-deployment — packaging, serving, monitoring, LLM deployment, canary/blue-green/shadow
- AI Infrastructure /ai-services/ai-infrastructure — GPU compute, storage, orchestration, cost visibility
- AI Development Services /ai-services/ai-development-services — custom AI from POC to production
- AI MVP Development /ai-services/ai-mvp-development — smallest working feature, real users, go/no-go
- ChatGPT Enterprise Integration /ai-services/chatgpt-enterprise-integration — independent SSO/governance rollout; not an OpenAI partner
- AI Readiness Assessment /ai-services/ai-readiness-assessment — data, infra, team, alignment scored before spend
- AI Strategy & Roadmap /ai-services/ai-strategy-roadmap — use case discovery, prioritization, executable sequence
- AI SaaS Product Development /ai-services/ai-saas-product-development — AI-native multi-tenant SaaS from idea to production, with usage cost in the pricing model
- Multi-Agent Systems /ai-services/multi-agent-systems — coordinated agents with roles, handoffs, failure containment, and observability
- AI HR Assistant /ai-services/ai-hr-assistant — HR chatbot for PTO, benefits, policy
- AI Sales Assistant /ai-services/ai-sales-assistant — agentic CRM, follow-ups, lead prioritization
- AI Model Monitoring /ai-services/ai-model-monitoring — drift detection, production ML
- AI Workflow Automation /ai-services/ai-workflow-automation — agentic multi-step workflows
- Enterprise Chatbots /ai-services/enterprise-chatbots — RAG-grounded enterprise AI chatbot
- Document Intelligence /ai-services/document-intelligence — IDP, document AI, invoice/contract extraction
- Industries: Healthcare, Finance, Manufacturing, Retail, Education
- Cities: Bangalore, Chennai, Hyderabad, Mumbai, Pune, Dubai (+ US via Delaware)

CLIENT WORK
- IFFCO Dubai — AD migration across 18 regions to Azure AD
- Apex IT Bangalore — on-prem server & AD migration with near-zero downtime

SITE PATHS (this template)
- Home /, About /about, Solutions /solutions, Blog /blog, Contact /contact
- AI Model Deployment /ai-services/ai-model-deployment
- AI HR Assistant /ai-services/ai-hr-assistant
- AI Sales Assistant /ai-services/ai-sales-assistant
- AI Model Monitoring /ai-services/ai-model-monitoring
- AI Workflow Automation /ai-services/ai-workflow-automation
- Enterprise Chatbots /ai-services/enterprise-chatbots
- Document Intelligence /ai-services/document-intelligence
- Customer Support Agents /ai-services/customer-support-agents
- Enterprise Knowledge Base Agents /ai-services/enterprise-knowledge-base-agents
- AI Infrastructure /ai-services/ai-infrastructure
- AI Development Services /ai-services/ai-development-services
- AI MVP Development /ai-services/ai-mvp-development
- ChatGPT Enterprise Integration /ai-services/chatgpt-enterprise-integration
- AI Readiness Assessment /ai-services/ai-readiness-assessment
- AI Strategy & Roadmap /ai-services/ai-strategy-roadmap
- AI SaaS Product Development /ai-services/ai-saas-product-development
- Multi-Agent Systems /ai-services/multi-agent-systems

FAQ
${faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
`.trim();

function score(query: string, text: string) {
  const words = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  let s = 0;
  for (const w of words) {
    if (text.toLowerCase().includes(w)) s += 1;
  }
  return s;
}

export function answerCloudSwift(question: string): string {
  const q = question.trim().toLowerCase();

  if (!q) {
    return "Ask me about CloudSwift — Azure MSP services, migrations, Microsoft 365, Dynamics, AI, or how to get in touch.";
  }

  if (/(hello|hi|hey)\b/.test(q)) {
    return "Hi — I'm CloudSwift AI. I can help with our Azure Expert MSP services, migrations, Microsoft platforms, AI offerings, and contact options. What do you need?";
  }

  if (/(what model|are you chatgpt|system prompt)/.test(q)) {
    return "I'm CloudSwift AI, the official assistant for CloudSwift Technologies.";
  }

  if (/(price|pricing|cost|quote)/.test(q)) {
    return `Pricing is customized per engagement. Book a free consultation for a quote: ${company.calendly}`;
  }

  if (/(contact|email|phone|call|whatsapp|reach|book)/.test(q)) {
    return `Email ${company.email} or call ${company.phone}. WhatsApp: ${company.whatsapp}. Book free: ${company.calendly}`;
  }

  if (/(where|office|address|location|bengaluru|bangalore)/.test(q)) {
    return `HQ: ${company.hq}. Also Mumbai and Lewes, Delaware (US). We serve India, the Gulf, and North America.`;
  }

  if (/(azure expert|expert msp)/.test(q)) {
    return faqs[0].answer;
  }

  if (/(azure)/.test(q)) {
    return "CloudSwift is an Azure Expert MSP. We manage VMs, AKS, DevOps, security & compliance, and FinOps with a 99.97% uptime SLA and 15-minute critical response. See /solutions/microsoft-azure";
  }

  if (/(microsoft 365|m365|office 365|teams|intune)/.test(q)) {
    return "We manage Microsoft 365 end-to-end — Entra ID, MFA, Conditional Access, Intune, Teams, SharePoint, Exchange, Defender — under SLA. See /solutions/microsoft-365";
  }

  if (/(dynamics|crm|erp)/.test(q)) {
    return faqs[2].answer;
  }

  if (/(ai|chatgpt|agent|mlops)/.test(q)) {
    return "AI Services span readiness assessments, enterprise ChatGPT integrations, support/knowledge agents, document intelligence, and MLOps — from strategy to production. Ask about a specific use case or book: " + company.calendly;
  }

  if (/(aws|amazon)/.test(q)) {
    return "We offer managed AWS — architecture, migration, security optimization, and 24/7 ops across EC2, S3, Lambda, and databases. See /solutions/amazon-web-services";
  }

  if (/(gcp|google cloud)/.test(q)) {
    return "We operate Google Cloud — GKE, BigQuery, AI/ML, Cloud Run — with migration and ongoing support. See /solutions/google-cloud-platform";
  }

  if (/(oracle)/.test(q)) {
    return "CloudSwift provides Oracle MSP, advisory, OCI migrations, managed IaaS/PaaS, engineered systems, and hybrid Oracle cloud.";
  }

  if (/(migrat)/.test(q)) {
    return "We run discovery-first migrations (6Rs, landing zones, wave planning, rollback). 200+ cloud migrations delivered. Start with a free assessment: " + company.calendly;
  }

  if (/(sla|uptime|response|incident)/.test(q)) {
    return faqs[1].answer;
  }

  if (/(team|who|leadership|founder)/.test(q)) {
    return `Leadership and engineering include ${team
      .slice(0, 5)
      .map((t) => `${t.name} (${t.role})`)
      .join(", ")}. More on /about`;
  }

  if (/(service|offer|what do you|do you provide|catalog)/.test(q)) {
    return `We publish full catalogs: Enterprise Services (${allServiceItems.length}) at /services, Managed Cloud (${allManagedItems.length}) at /managed-cloud, AI Services (${allAiItems.length}) at /ai-services, and Solutions (${projects.length}) at /solutions. Which area should we open?`;
  }

  // Search full offering catalogs
  const pool = [...allServiceItems, ...allManagedItems, ...allAiItems];
  let bestItem = pool[0];
  let bestItemScore = 0;
  for (const item of pool) {
    const s = score(q, `${item.title} ${item.desc} ${item.tags.join(" ")}`);
    if (s > bestItemScore) {
      bestItem = item;
      bestItemScore = s;
    }
  }
  if (bestItemScore >= 2) {
    const hub = allAiItems.some((i) => i.id === bestItem.id)
      ? "/ai-services"
      : allManagedItems.some((i) => i.id === bestItem.id)
        ? "/managed-cloud"
        : "/services";
    return `${bestItem.title}: ${bestItem.desc} More: ${hub}/${bestItem.id}`;
  }

  if (/(blog|article|resource)/.test(q)) {
    return "Visit /blog for CloudSwift field notes on migrations, Azure, security, and AI.";
  }

  if (/(shoe|on running|footwear|cloudswift shoe)/.test(q)) {
    return "CloudSwift Technologies (oncloudswift.com) is a Bengaluru Azure Expert MSP — not affiliated with On Running or On Cloudswift footwear.";
  }

  let best = faqs[0];
  let bestScore = score(q, faqs[0].question + " " + faqs[0].answer);
  for (const f of faqs) {
    const s = score(q, f.question + " " + f.answer);
    if (s > bestScore) {
      best = f;
      bestScore = s;
    }
  }
  if (bestScore >= 2) return best.answer;

  for (const s of services) {
    if (score(q, s.title + " " + s.description) >= 2) {
      return `${s.title}: ${s.description}`;
    }
  }

  return `CloudSwift helps enterprises migrate, secure, and operate cloud and Microsoft platforms. Try Azure, Microsoft 365, AI, migrations, or contact. Email ${company.email} or book ${company.calendly}`;
}

export const assistantSystemHint = CLOUDSWIFT_SYSTEM_KNOWLEDGE;
