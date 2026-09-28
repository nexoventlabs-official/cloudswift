import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const enterpriseChatbotsPage: AgentPage = {
  catalogId: "ai-chatbot-enterprise",
  path: PATH.chatbots,
  metaTitle: "Enterprise Chatbots | AI Conversational Support at Scale",
  metaDescription:
    "Enterprise chatbots that handle customer and employee conversations at scale, with the security, integrations, and governance a real enterprise needs.",
  category: "Generative AI Solutions",
  title: "Enterprise Chatbots",
  h1: "Enterprise Chatbots Built for Scale, Security, and Actual Governance",
  overviewHeading: "How an enterprise chatbot holds up past the demo",
  gtmEvent: "enterprise_chatbots_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "Enterprise Chatbots" },
  ],
  heroLede:
    "Conversations at real volume, grounded in your knowledge base, with role-based access and audit logs a security team can sign off on.",
  heroCta: { label: "Talk to us about enterprise chatbots", href: "/contact" },
  image: "/images/cs/ai-services/enterprise-chatbots.webp",
  imageAlt:
    "An enterprise chatbot on a phone, with a robot assistant and a customer, plus controls for security, role-based access, audit logs, and knowledge-base grounding.",
  imageCaption:
    "Enterprise chatbots: scale, security, and grounded answers — not a website widget.",
  overview: [
    "A chatbot that works for a small team's website often falls apart across an entire organization. Enterprise chatbots are built for that scale from the start — thousands of concurrent conversations, the systems a large company already runs, and access controls and audit trails a security team will actually approve.",
    "Whether you call it an enterprise AI chatbot or part of a conversational AI platform, the requirement is the same: it has to hold up under real enterprise conditions, not a demo. Answers are retrieval-grounded in your knowledge base, not invented.",
    "This is not ChatGPT Enterprise. ChatGPT Enterprise is a general-purpose assistant with enterprise privacy. An enterprise chatbot platform is purpose-built for customer support or employee self-service, with deeper integration into the systems that use case depends on. Related work: Customer Support Agents, AI HR Assistant, AI Sales Assistant.",
  ],
  challengesIntro:
    "The teams that look into chatbot software usually recognize a few of these.",
  challenges: [
    {
      tag: "Volume",
      title: "Tickets pile up faster than the team can respond",
      body: "Especially outside business hours.",
    },
    {
      tag: "Repeat",
      title: "HR, IT, and ops hear the same questions constantly",
      body: "There is no single place to get an instant answer.",
    },
    {
      tag: "Scale",
      title: "Existing chatbot tools were not built for this volume",
      body: "They start breaking down under real load.",
    },
    {
      tag: "Security",
      title: "Compliance cannot sign off",
      body: "No proper access controls or audit logging.",
    },
    {
      tag: "Scatter",
      title: "Conversations live in five tools",
      body: "No consistent experience or shared context.",
    },
  ],
  definition: [
    "An enterprise chatbot is an AI-powered conversational tool built for large organizations — customer or employee conversations at the scale, security, and reliability a big company needs.",
    "What separates it from a basic chatbot is not the conversation itself. It is role-based access, full audit logs, integration with the dozen-plus systems an enterprise already runs, and the ability to hold up under thousands of simultaneous conversations. Conversational AI platforms are the broader category; “enterprise chatbot” usually points at support and employee assistance rather than voice AI generally.",
    "Four common types: rule-based, retrieval-based, generative AI-based, and hybrid. CloudSwift typically deploys a hybrid: NLU plus RAG from your documentation, with escalation when confidence is low.",
  ],
  benefits: [
    [
      "Handles real volume without breaking",
      "Built for thousands of concurrent conversations, not a handful.",
    ],
    [
      "Answers instantly, any time of day",
      "No waiting for business hours.",
    ],
    [
      "Integrates with what you already run",
      "CRM, HRIS, ticketing, and knowledge base — not an island.",
    ],
    [
      "Security and compliance can sign off",
      "Role-based access, audit trails, and data governance from the start.",
    ],
    [
      "Consistent across channels",
      "Website, Slack, Teams, or wherever users already are.",
    ],
    [
      "People take the conversations that need a person",
      "Routine questions automated; complex ones escalated with context.",
    ],
  ],
  deliverIncluded: [
    "Design and deployment of a conversational AI chatbot for your customer or employee use case",
    "Integration with CRM, HRIS, ticketing, or knowledge base",
    "Role-based access controls and full conversation audit logging",
    "Escalation logic that routes complex or sensitive conversations to a human",
    "Multi-channel deployment across web, Slack, Teams, or your channel of choice",
    "Multilingual support configuration for global organizations",
  ],
  deliverExcluded: [
    "Building a fully custom large language model from scratch",
    "Ongoing content writing for your knowledge base",
    "Replacing human agents entirely for complex or sensitive conversations",
  ],
  techRows: [
    {
      layer: "Enterprise conversational AI platforms",
      role: "Large-scale, secure conversational deployments",
      useCase: "Rasa, IBM watsonx Assistant, and similar",
      benefit: "Governance and customization out of the box",
    },
    {
      layer: "Contact-center-integrated chatbots",
      role: "Live beside voice and messaging support",
      useCase: "Existing customer communication stacks",
      benefit: "Fits current support workflows",
    },
    {
      layer: "RAG-based knowledge retrieval",
      role: "Pull answers from your documentation",
      useCase: "Reducing hallucinated or outdated answers",
      benefit: "Responses grounded in current information",
    },
    {
      layer: "Multilingual NLU",
      role: "Detect and respond in the user's language",
      useCase: "Global organizations",
      benefit: "Consistent quality, not English-only",
    },
    {
      layer: "Cloud-native chatbot infrastructure",
      role: "Scalable backend for high volume",
      useCase: "Seasonal or unpredictable load",
      benefit: "Scales with demand",
    },
  ],
  techNote:
    "The right enterprise chatbot platform depends on use case, stack, and security — from deep customization to turnkey contact-center tools.",
  industries: [
    {
      label: "Financial services",
      body: "Account questions and routine requests with the audit trail regulators expect.",
    },
    {
      label: "Healthcare",
      body: "Scheduling and administrative questions — not clinical advice.",
    },
    {
      label: "Retail and ecommerce",
      body: "Order status, returns, and product questions at peak volume.",
    },
    {
      label: "Technology and SaaS",
      body: "Tiered support that resolves common issues before a human agent.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Identify the use case — customer support, employee self-service, or both — and conversation volume.",
    },
    {
      title: "Assessment",
      desc: "Review systems, security requirements, and integration needs.",
    },
    {
      title: "Design",
      desc: "Map conversation flows, escalation logic, and connected systems.",
    },
    {
      title: "Development",
      desc: "Build and configure against your knowledge base and integration points.",
    },
    {
      title: "Integration",
      desc: "Connect CRM, HRIS, ticketing, and channels.",
    },
    {
      title: "Testing",
      desc: "Validate real scenarios, including cases that must escalate.",
    },
    {
      title: "Deployment",
      desc: "Pilot group, then organization-wide launch.",
    },
    {
      title: "Optimization",
      desc: "Review unresolved conversations and expand what the chatbot can handle.",
    },
  ],
  architecture: [
    { role: "User", nodes: ["Web", "Slack", "Teams"] },
    { role: "Enterprise chatbot", nodes: ["Conversational AI platform"] },
    {
      role: "Understanding",
      nodes: ["NLU", "RAG from your docs", "CRM / HRIS / tickets"],
    },
    { role: "Escalation", nodes: ["Low confidence → human"] },
    { role: "Outcome", nodes: ["Instant answer", "Handoff with context"] },
    { role: "Logging", nodes: ["Audit trail", "Improvement loop"] },
  ],
  architectureCaption:
    "Users reach an enterprise chatbot that uses NLU and RAG, calls your systems, escalates when needed, and logs every conversation.",
  compliance: [
    {
      label: "Role-based access",
      desc: "Who can see conversation data is controlled.",
    },
    {
      label: "Audit logs",
      desc: "Every interaction is recorded.",
    },
    {
      label: "Retention",
      desc: "Configurable data retention aligned to your requirements.",
    },
    {
      label: "Disclosure",
      desc: "Some jurisdictions require telling users they are talking to a bot. We design for that. Named certifications are cited only where verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Production volume, not a demo",
      desc: "Built for real enterprise scale and security.",
    },
    {
      idx: "02",
      title: "Your systems, not a workaround",
      desc: "Integrates with what you already run.",
    },
    {
      idx: "03",
      title: "Escalation is designed in",
      desc: "Nothing sensitive is handled without human oversight when it should not be.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A global retail company's support team was overwhelmed in peak periods, with wait times past 20 minutes for simple order-status questions.",
      "After deploying an enterprise chatbot integrated with order management, most routine questions resolved instantly, in the customer's language. Staff still handled complex cases — they stopped answering the same order-status question hundreds of times a day.",
    ],
  },
  faqs: [
    {
      q: "What is an enterprise chatbot?",
      a: "An enterprise chatbot is an AI-powered conversational tool built for large organizations, handling customer or employee conversations at scale with enterprise-grade security, integrations, and governance controls.",
    },
    {
      q: "What are the four types of chatbots?",
      a: "Chatbots are commonly grouped into rule-based, retrieval-based, generative AI-based, and hybrid chatbots combining multiple approaches.",
    },
    {
      q: "What's the difference between an enterprise chatbot and ChatGPT Enterprise?",
      a: "ChatGPT Enterprise is a general-purpose AI assistant with enterprise privacy controls, while an enterprise chatbot platform is typically purpose-built for a specific use case with deeper system integration.",
    },
    {
      q: "Are AI chatbots illegal?",
      a: "No, AI chatbots are legal, though some jurisdictions require disclosing to users that they are talking to a bot, particularly in certain regulated industries.",
    },
    {
      q: "What is the best AI chatbot platform for enterprises?",
      a: "The right platform depends on the specific use case, existing tech stack, and security requirements, ranging from highly customizable platforms to more turnkey integrated solutions.",
    },
    {
      q: "How do enterprise chatbots support multilingual capabilities?",
      a: "Enterprise chatbots use multilingual natural language understanding to detect and respond in a user's language, maintaining consistent support quality across languages.",
    },
    {
      q: "What is the future outlook for enterprise chatbots?",
      a: "Enterprise chatbots are trending toward more agentic behavior, taking actions across connected systems, alongside deeper integration with organizational data through retrieval-augmented generation.",
    },
    {
      q: "Does an enterprise chatbot integrate with our existing systems?",
      a: "Most enterprise chatbot platforms integrate with common CRM, HRIS, and ticketing systems, either natively or through a connected API.",
    },
    {
      q: "Can an enterprise chatbot handle multiple languages at once?",
      a: "Yes, a properly configured enterprise chatbot can detect a user's language and respond accordingly, supporting a global organization without separate chatbots per language.",
    },
    {
      q: "What happens if the chatbot can't answer a question?",
      a: "It escalates the conversation to a human agent, ideally with relevant context already gathered.",
    },
    {
      q: "How secure is an enterprise chatbot compared to a standard chatbot?",
      a: "Enterprise chatbots typically include role-based access controls, full audit logging, and configurable data retention policies that standard chatbots usually don't offer.",
    },
    {
      q: "How long does it take to deploy an enterprise chatbot?",
      a: "Timelines vary based on integration complexity, but a focused deployment covering one primary use case can typically launch within a few weeks to a couple of months.",
    },
  ],
  queryVariants: [
    "Enterprise chatbot",
    "Enterprise AI chatbot",
    "conversational AI platform",
    "chatbot software",
    "AI chatbot for business",
    "enterprise conversational AI",
    "enterprise chatbot platform",
  ],
  internalLinks: [
    { anchor: "our Customer Support Agents", href: PATH.support },
    { anchor: "AI HR Assistant", href: PATH.hr },
    { anchor: "AI Sales Assistant", href: PATH.sales },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "Enterprise Knowledge Base Agents", href: PATH.knowledge },
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "AI Sales Assistant", href: PATH.sales },
    { anchor: "AI HR Assistant", href: PATH.hr },
    { anchor: "Document Intelligence", href: PATH.docIntel },
    { anchor: "Customer Support Agents", href: PATH.support },
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
  ],
};
