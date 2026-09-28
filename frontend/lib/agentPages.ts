import type { Metadata } from "next";
import { company } from "@/lib/data";
import { getServiceImageMeta } from "@/lib/serviceImageMeta";
import {
  hrAssistantPage,
  salesAssistantPage,
  modelMonitoringPage,
  workflowAutomationPage,
  enterpriseChatbotsPage,
  documentIntelligencePage,
  aiInfrastructurePage,
  aiDevelopmentServicesPage,
  aiMvpDevelopmentPage,
  chatgptEnterprisePage,
  aiReadinessPage,
  aiStrategyRoadmapPage,
  aiSaasProductDevelopmentPage,
  multiAgentSystemsPage,
} from "./landings";
import { PATH } from "./landings/paths";

export {
  hrAssistantPage,
  salesAssistantPage,
  modelMonitoringPage,
  workflowAutomationPage,
  enterpriseChatbotsPage,
  documentIntelligencePage,
  aiInfrastructurePage,
  aiDevelopmentServicesPage,
  aiMvpDevelopmentPage,
  chatgptEnterprisePage,
  aiReadinessPage,
  aiStrategyRoadmapPage,
  aiSaasProductDevelopmentPage,
  multiAgentSystemsPage,
};

export type AgentLink = { anchor: string; href: string };

export type AgentCrumb = { name: string; href?: string };

export type AgentPage = {
  catalogId: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  title: string;
  h1?: string;
  overviewHeading?: string;
  crumbs?: AgentCrumb[];
  gtmEvent?: string;
  heroLede: string;
  heroCta: { label: string; href: string };
  image: string;
  imageAlt: string;
  /** Visible figcaption under the hero; also used as ImageObject caption. */
  imageCaption?: string;
  overview: string[];
  challengesIntro: string;
  challenges: { tag: string; title: string; body: string }[];
  definition: string[];
  benefits: [string, string][];
  deliverIncluded: string[];
  deliverExcluded: string[];
  techRows: { layer: string; role: string; useCase: string; benefit: string }[];
  techNote: string;
  industries: { label: string; body: string }[];
  steps: { title: string; desc: string }[];
  architecture: { role: string; nodes: string[] }[];
  architectureCaption: string;
  compliance: { label: string; desc: string }[];
  why: { idx: string; title: string; desc: string }[];
  example: { disclaimer: string; body: string[] };
  faqs: { q: string; a: string }[];
  queryVariants: string[];
  schemaDescription?: string;
  /** Copy-doc JSON-LD: Service + FAQPage + BreadcrumbList only. */
  schemaPreset?: "document";
  internalLinks: AgentLink[];
  externalLinks: AgentLink[];
  related: AgentLink[];
};

const ORIGIN = company.website.replace(/\/$/, "");
const BLOG_KNOWLEDGE_GAPS = "/blog/how-ai-agents-reduce-knowledge-gaps";
const BLOG_MLOPS_DEPLOY =
  "/blog/from-notebook-to-production-mlops-deployment";

const SHARED_LINKS = {
  multiAgent: {
    anchor: "Multi-Agent Systems",
    href: PATH.multiAgent,
  },
  integrations: {
    anchor: "integrations with your existing tools",
    href: "/services/integration",
  },
  caseStudies: { anchor: "case studies", href: "/projects" },
  pricing: { anchor: "pricing", href: "/contact" },
  blog: {
    anchor: "how AI agents reduce knowledge gaps (blog)",
    href: BLOG_KNOWLEDGE_GAPS,
  },
  cx: {
    anchor: "our Customer Support Agents",
    href: PATH.support,
  },
  cs: {
    anchor: "our Customer Support Agents",
    href: PATH.support,
  },
  kb: {
    anchor: "Enterprise Knowledge Base Agents",
    href: PATH.knowledge,
  },
  deploy: {
    anchor: "AI Model Deployment",
    href: PATH.deploy,
  },
  monitoring: {
    anchor: "model monitoring",
    href: PATH.monitor,
  },
  serving: {
    anchor: "model serving",
    href: PATH.infra,
  },
  mlopsBlog: {
    anchor: "from notebook to production (blog)",
    href: BLOG_MLOPS_DEPLOY,
  },
  docIntel: {
    anchor: "Document Intelligence",
    href: PATH.docIntel,
  },
} as const;

export const customerSupportPage: AgentPage = {
  catalogId: "ai-customer-agent",
  path: PATH.support,
  metaTitle:
    "Customer Support Agents | RAG-Grounded AI Support | CloudSwift",
  metaDescription:
    "Customer support agents from CloudSwift resolve support queries instantly, stay on-brand, and escalate what they can't grounded in your real content.",
  category: "AI Agent Development",
  title: "Customer Support Agents",
  heroLede:
    "Give your support team an AI agent that resolves real tickets, not just deflects them. CloudSwift builds RAG-grounded customer support agents that stay on-brand and escalate what they cannot answer.",
  heroCta: {
    label: "Talk to us about your support workflow",
    href: "/contact",
  },
  image: "/images/cs/ai-services/customer-support-agents.webp",
  imageAlt:
    "A customer support agent wearing a headset resolves an order in live chat with a customer, with on-screen values for empathy, solutions, ownership, and excellence.",
  imageCaption:
    "Resolve the ticket — or hand it to a human with the full thread.",
  overview: [
    "A customer support agent works alongside your support team across chat, email, and voice. Unlike scripted chatbots, it uses your company's knowledge, documentation, past tickets, product data, and order systems. It understands the request, resolves it, or hands off to a human with full context.",
    "CloudSwift designs, builds, and connects this agent through integrations with your existing tools, so it behaves as an extension of your team rather than another add-on on the site. See how similar programs land in our case studies, and review pricing when you are ready to scope an engagement.",
    "Read how AI agents reduce knowledge gaps (blog) if the harder problem is documentation quality, not just ticket volume. Teams that also need internal answers for staff often pair this work with our AI agent platform when several agents must share tools and policy.",
  ],
  challengesIntro:
    "Support teams are asked to do more with the same headcount. Ticket volume rises with every product launch, while hiring rarely keeps pace. Wait times stretch, answers drift between agents, and the same questions burn people out.",
  challenges: [
    {
      tag: "Volume",
      title: "Tickets outgrow the team",
      body: "Each launch and each new customer adds repetitive work. An agent that cannot resolve the easy cases leaves humans stuck on password resets instead of the issues that need judgement.",
    },
    {
      tag: "Quality",
      title: "Answers drift by shift and channel",
      body: "Without a single source of truth, customers hear different versions of the same policy depending on who picks up the ticket.",
    },
    {
      tag: "Trust",
      title: "Bad automation costs more than no automation",
      body: "A looping chatbot or a confident wrong answer damages trust faster than a longer queue. Agent design matters as much as the decision to automate.",
    },
    {
      tag: "Handoff",
      title: "Escalations arrive without context",
      body: "When bots dump a customer on a human with no history, the customer repeats themselves and the agent starts from zero.",
    },
  ],
  definition: [
    "A customer support agent is a specialised AI system that reads, understands, and responds to customer questions using your organisation's real data, not a fixed decision tree.",
    "It uses a large language model connected to your knowledge sources through retrieval (RAG), governed by rules about what it may do, and designed to escalate whenever confidence is low or the case needs judgement, approval, or empathy.",
    "CloudSwift builds it as a custom system for your workflows. Grounding follows the same retrieval-augmented generation pattern described in Microsoft's RAG documentation for Azure AI Search, and in Azure OpenAI on your data, so answers stay tied to content you control.",
  ],
  benefits: [
    [
      "Faster resolution of high-volume questions",
      "Human agents spend their time on complex or sensitive cases instead of the same ten tickets.",
    ],
    [
      "Consistent, on-brand answers",
      "One source of truth, so policy and product facts do not change between agents, shifts, or channels.",
    ],
    [
      "24/7 coverage without 24/7 headcount",
      "The agent stays available across time zones. Overnight volume no longer has to wait for the morning queue.",
    ],
    [
      "Clear escalation paths",
      "Nothing sits with an agent that should not handle it. Low confidence, disputes, and security issues go to a human with the full thread.",
    ],
    [
      "Visibility into gaps",
      "You see which questions the agent resolves, where it hands off, and where your knowledge base is thin.",
    ],
  ],
  deliverIncluded: [
    "Discovery and workflow mapping of your current support process",
    "Custom customer support agent design linked to your knowledge base, ticketing system, and relevant internal tools",
    "Retrieval setup so answers are grounded in your documentation and data",
    "Escalation logic and human handoff design",
    "Integration with your existing support platform",
    "Testing, quality assurance, and staged rollout",
    "Analytics and monitoring so you can see how the agent performs",
  ],
  deliverExcluded: [
    "Ongoing content writing for your knowledge base, unless scoped separately",
    "Staffing or managing your human support team",
    "Guarantees of specific deflection or resolution rates before we assess your ticket data",
  ],
  techRows: [
    {
      layer: "Large language models",
      role: "Understand and generate natural language",
      useCase: "Interpreting intent and drafting replies",
      benefit: "Natural conversation instead of rigid scripts",
    },
    {
      layer: "Retrieval-augmented generation (RAG)",
      role: "Grounds responses in company data",
      useCase: "Pulling answers from documents, tickets, and product data",
      benefit: "Fewer invented or off-brand answers",
    },
    {
      layer: "Helpdesk / CRM integration",
      role: "Connects the agent to your support tools",
      useCase: "Reading and updating tickets, orders, and accounts",
      benefit: "Works inside your workflow, not beside it",
    },
    {
      layer: "Analytics and monitoring",
      role: "Tracks performance and outcomes",
      useCase: "Volume handled, escalations, and knowledge gaps",
      benefit: "A system you can see into and improve",
    },
  ],
  techNote:
    "The model and RAG layers handle understanding and accuracy. Integration and analytics make sure the agent fits how your team already works.",
  industries: [
    {
      label: "SaaS",
      body: "Ticket-heavy technical questions: setup, configuration, and troubleshooting the agent can resolve without a human on every thread.",
    },
    {
      label: "Retail / ecommerce",
      body: "Order status, returns, and seasonal spikes — high volume, well-structured intents, a natural fit for RAG-grounded support.",
    },
    {
      label: "Finance",
      body: "Structured, high-compliance questions with strict escalation rules designed in from the start.",
    },
    {
      label: "Logistics",
      body: "Shipment tracking and delivery questions at scale, where repetition is the burden on the human team.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Map current support workflows, ticket categories, and systems.",
    },
    {
      title: "Assessment",
      desc: "Read ticket data to see what can be automated versus what still needs a human.",
    },
    {
      title: "Design",
      desc: "Define knowledge sources, escalation rules, and conversation flows.",
    },
    {
      title: "Development",
      desc: "Build the agent and connect it to your knowledge base and tools.",
    },
    {
      title: "Integration",
      desc: "Connect helpdesk, CRM, and the internal systems the agent must act on.",
    },
    {
      title: "Testing",
      desc: "Quality assurance against real ticket scenarios before customers see it.",
    },
    {
      title: "Deployment",
      desc: "Staged rollout, starting with lower-risk ticket categories.",
    },
    {
      title: "Optimization",
      desc: "Tune from live conversation data and escalation patterns.",
    },
  ],
  architecture: [
    { role: "Customer", nodes: ["Chat", "Email", "Voice"] },
    { role: "Channel", nodes: ["Channel layer"] },
    { role: "Agent", nodes: ["Conversation logic", "Routing", "Escalation rules"] },
    { role: "Model", nodes: ["LLM — understanding and generation"] },
    { role: "Retrieval", nodes: ["RAG over your knowledge sources"] },
    {
      role: "Sources",
      nodes: ["Docs", "Past tickets", "Product and order data"],
    },
    { role: "Security", nodes: ["Access controls", "Data handling rules"] },
    { role: "Analytics", nodes: ["Monitoring", "Reporting", "Gap detection"] },
    { role: "Handoff", nodes: ["Human escalation with full context"] },
  ],
  architectureCaption:
    "The customer never talks to a naked model. Channels, policy, retrieval, and security sit in front of generation, and a human path sits at the end.",
  compliance: [
    {
      label: "Access control",
      desc: "The agent only reads the data you configure — documentation, ticket history, and specified systems.",
    },
    {
      label: "Audit logging",
      desc: "Conversations and escalations can be logged so support leadership can review what the agent did and why.",
    },
    {
      label: "Retention",
      desc: "Data retention rules are configurable to match how you already handle support records.",
    },
    {
      label: "Escalation governance",
      desc: "Low-confidence, regulated, or sensitive intents go to a human instead of a guessed answer.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Your workflows, not a generic bot",
      desc: "We design around the systems and ticket patterns you actually have, instead of asking you to reshape the helpdesk around a product.",
    },
    {
      idx: "02",
      title: "Honest about what can be automated",
      desc: "Discovery includes a frank read of ticket volume so you know what to expect before build starts.",
    },
    {
      idx: "03",
      title: "A system your team can see into",
      desc: "Monitoring and gap reports are part of delivery, not an afterthought dashboard.",
    },
    {
      idx: "04",
      title: "RAG-grounded, then escalated",
      desc: "Answers come from your content. When they cannot, the handoff carries the full thread.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A mid-sized SaaS company is flooded with “how do I reset my password” and “where's my invoice” tickets. They are repetitive and low complexity, but they still consume a small support team.",
      "A customer support agent connected to the help centre and billing system can resolve those directly, and automatically escalate anything involving a security concern or a billing dispute to a live agent with the conversation attached.",
      "The human team spends its time on the harder cases instead of answering the same questions again.",
    ],
  },
  faqs: [
    {
      q: "What is a customer support agent?",
      a: "An AI system that understands and responds to customer support conversations using your company's real data, and escalates to a human when needed.",
    },
    {
      q: "How is this different from a chatbot?",
      a: "A traditional chatbot follows scripted decision trees. An AI agent understands natural language and retrieves live answers from your knowledge sources.",
    },
    {
      q: "Will it give customers wrong information?",
      a: "Grounding the agent in your documentation through RAG reduces that risk. Escalation rules send low-confidence answers to a human instead of guessing.",
    },
    {
      q: "What channels can it work across?",
      a: "Chat, email, and voice, depending on your support stack and what we scope.",
    },
    {
      q: "Does it replace my support team?",
      a: "No. It is designed to handle repetitive, high-volume questions so your team can focus on complex or sensitive cases.",
    },
    {
      q: "How long does implementation take?",
      a: "Timeline depends on ticket categories and systems. We scope it during discovery.",
    },
    {
      q: "What systems does it integrate with?",
      a: "Your existing helpdesk, CRM, and relevant internal tools, connected during the integration phase.",
    },
    {
      q: "How does escalation to a human work?",
      a: "The agent hands off with full conversation context when confidence is low, the request needs judgement, or your rules require a human.",
    },
    {
      q: "What data does the agent have access to?",
      a: "Only what you configure — documentation, ticket history, and specified systems — governed by access controls.",
    },
    {
      q: "Does it work with our existing knowledge base?",
      a: "Yes. That is the primary knowledge source it is built to retrieve from.",
    },
    {
      q: "Is a customer support agent the same as a chatbot?",
      a: "No. A chatbot follows scripts. A customer support agent — also called a customer service AI agent — understands natural language, retrieves grounded answers, and can act or escalate. That is what people mean by an AI agent for customer service.",
    },
    {
      q: "What does RAG-grounded AI support mean?",
      a: "Retrieval-augmented generation means replies are pulled from your real content, not invented from the model’s general training data. That is how CloudSwift keeps customer support agents on-brand.",
    },
  ],
  queryVariants: [
    "customer support agents",
    "customer support agent",
    "customer support AI agent",
    "AI customer support agent",
    "customer experience agents",
    "customer service AI agent",
    "customer service AI",
    "customer service agent",
    "AI customer service agent",
    "AI agent for customer service",
    "AI agents for customer support",
    "RAG-grounded AI support",
    "AI powered customer service",
    "AI customer support",
  ],
  internalLinks: [
    SHARED_LINKS.kb,
    SHARED_LINKS.multiAgent,
    SHARED_LINKS.integrations,
    SHARED_LINKS.caseStudies,
    SHARED_LINKS.pricing,
    SHARED_LINKS.blog,
  ],
  externalLinks: [
    {
      anchor: "Microsoft's RAG documentation for Azure AI Search",
      href: "https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview",
    },
    {
      anchor: "Azure OpenAI on your data",
      href: "https://learn.microsoft.com/azure/ai-foundry/openai/concepts/use-your-data",
    },
  ],
  related: [
    {
      anchor: "Enterprise Knowledge Base Agents",
      href: "/ai-services/enterprise-knowledge-base-agents",
    },
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Strategy & Roadmap", href: PATH.roadmap },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    SHARED_LINKS.docIntel,
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
    SHARED_LINKS.deploy,
  ],
};

export const enterpriseKnowledgePage: AgentPage = {
  catalogId: "ai-knowledge-agent",
  path: PATH.knowledge,
  metaTitle:
    "Enterprise Knowledge Base Agents | Agentic RAG for Internal Knowledge | CloudSwift",
  metaDescription:
    "CloudSwift's enterprise knowledge base agents use agentic RAG to answer employee questions from your internal documentation — accurately, and with governed access control.",
  category: "AI Agent Development",
  title: "Enterprise Knowledge Base Agents",
  heroLede:
    "Give every employee an AI agent that actually knows your company. CloudSwift's enterprise knowledge base agents use agentic RAG to answer from your internal documentation, with governed access control.",
  heroCta: {
    label: "Talk to us about your knowledge base",
    href: "/contact",
  },
  image: "/images/cs/ai-services/enterprise-knowledge-base-agents.webp",
  imageAlt:
    "An enterprise knowledge base agent answers employee questions about leave policy and onboarding from governed sources — policies, product docs, guides, and FAQs.",
  imageCaption:
    "Answers from your docs, with governed access — not a generic chatbot.",
  overview: [
    "An enterprise knowledge base agent is an AI employees can query in ordinary language. It answers from the organisation's real internal knowledge — policies, documentation, past decisions, and product data — instead of inventing a reply.",
    "CloudSwift designs, builds, and integrates the agent, including access controls so people only see what they are allowed to see. It sits on top of the systems you already have, rather than replacing your wiki or document store.",
    "Teams often run this next to our Customer Support Agents when customers and employees need the same source of truth. The agent connects through integrations with your existing tools, and you can review case studies and pricing when you want to see how an engagement is scoped. For the wider operating model, see our AI agent platform. Background on the knowledge problem is in how AI agents reduce knowledge gaps (blog).",
  ],
  challengesIntro:
    "In large organisations, knowledge is scattered across wikis, shared drives, ticketing systems, chat threads, and a few long-serving people. New hires take longer to ramp. Experienced staff answer the same questions again. Documents go stale until someone acts on the old version.",
  challenges: [
    {
      tag: "Findability",
      title: "Stores exist. Answers do not.",
      body: "Classic knowledge systems keep files without making them easy to use. Keyword search returns the wrong document, or ten documents and no decision.",
    },
    {
      tag: "Ramp",
      title: "New hires do not know where to look",
      body: "Onboarding depends on interrupting a mentor. The map of “where truth lives” is tribal, not documented.",
    },
    {
      tag: "Stale content",
      title: "Nobody notices until it hurts",
      body: "Policies drift. Product specs change. People still act on last year's page because search ranked it first.",
    },
    {
      tag: "Access",
      title: "A naive assistant over-shares",
      body: "An unconstrained model on an internal corpus is a permissions incident waiting to happen. Governance has to be designed in, not bolted on.",
    },
  ],
  definition: [
    "An enterprise knowledge base agent is built for a specific purpose: it is linked to your internal knowledge through retrieval, so answers come from what your organisation has actually documented, not from the open internet.",
    "In practice this uses agentic RAG — the agent decides what to search and how to combine sources. Where it helps, a knowledge graph can link related documents and decisions instead of treating each file in isolation.",
    "Access controls limit what each employee can see. Escalation flags gaps instead of guessing. That is the difference between an AI search box and a governed internal knowledge layer. The retrieval pattern aligns with Microsoft's guidance on retrieval-augmented generation and with Azure OpenAI on your data.",
  ],
  benefits: [
    [
      "Faster answers without interrupting a colleague",
      "Employees ask in plain language instead of hunting across five tools.",
    ],
    [
      "One current source of truth",
      "Everyone gets an answer grounded in the latest documentation you have connected.",
    ],
    [
      "Shorter time-to-productive for new hires",
      "People can ask the agent instead of waiting for a mentor to be free.",
    ],
    [
      "Governed access",
      "Sensitive material stays limited to the people who are allowed to see it.",
    ],
    [
      "Visible knowledge gaps",
      "If the agent cannot find an answer, that is a documentation task — not a hallucination.",
    ],
  ],
  deliverIncluded: [
    "Discovery and mapping of internal knowledge sources and access requirements",
    "Custom enterprise knowledge base agent design connected to documentation, wikis, and relevant systems",
    "Retrieval setup, including agentic RAG where it is useful, so answers are grounded in your content",
    "Access control and governance design that respects existing permissions",
    "Integration with internal tools such as your intranet, wiki, or collaboration platform",
    "Testing, QA, and staged rollout",
    "Analytics on usage and knowledge gaps",
  ],
  deliverExcluded: [
    "Ongoing authorship or maintenance of internal documentation, unless scoped separately",
    "Replacement of your existing content or document management system",
    "Guarantees of a specific adoption or accuracy percentage before we assess your knowledge base",
  ],
  techRows: [
    {
      layer: "Large language models",
      role: "Understand questions and generate answers",
      useCase: "Natural-language internal queries",
      benefit: "People ask normally instead of guessing keywords",
    },
    {
      layer: "Agentic RAG",
      role: "Grounds answers in internal documentation",
      useCase: "Pulling from wikis, policies, and past decisions",
      benefit: "Fewer invented answers; sources can be combined on purpose",
    },
    {
      layer: "Knowledge graph / relationship mapping",
      role: "Connects related documents and decisions",
      useCase: "Context an isolated file search would miss",
      benefit: "More complete answers across related policies",
    },
    {
      layer: "Access control / permissions",
      role: "Enforces who can see what",
      useCase: "Respecting existing document and system permissions",
      benefit: "Sensitive information is not exposed broadly",
    },
    {
      layer: "Analytics and monitoring",
      role: "Tracks usage and surfaces gaps",
      useCase: "Unanswered or low-confidence queries",
      benefit: "Shows where documentation needs work",
    },
  ],
  techNote:
    "Retrieval and reasoning replace static indexing. Governance is part of the stack, not a later add-on.",
  industries: [
    {
      label: "SaaS and technology",
      body: "Product documentation that changes with every release — the agent has to keep up, not freeze a snapshot.",
    },
    {
      label: "Finance",
      body: "Policy-heavy, compliance-sensitive knowledge. Strict access controls are part of the agent design.",
    },
    {
      label: "Manufacturing",
      body: "Technical and process documentation spread across teams, often still sitting in older knowledge systems.",
    },
    {
      label: "Professional services",
      body: "Case, policy, and precedent retrieval where governance matters as much as accuracy.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Identify internal knowledge sources, systems, and who needs access to what.",
    },
    {
      title: "Evaluation",
      desc: "Assess documentation quality and coverage so gaps are visible before build.",
    },
    {
      title: "Design",
      desc: "Specify sources, access rules, and how unanswered questions escalate.",
    },
    {
      title: "Build",
      desc: "Create the enterprise knowledge base agent and connect it to documentation and systems.",
    },
    {
      title: "Integration",
      desc: "Connect intranet, wiki, or collaboration platforms the team already uses.",
    },
    {
      title: "Testing",
      desc: "Run real internal questions and permission scenarios before launch.",
    },
    {
      title: "Deployment",
      desc: "Staged rollout, typically starting with one team or department.",
    },
    {
      title: "Optimization",
      desc: "Tune from usage data and the knowledge gaps the agent records.",
    },
  ],
  architecture: [
    { role: "Employee", nodes: ["Intranet", "Chat", "Collaboration tool"] },
    { role: "Channel", nodes: ["Channel layer"] },
    { role: "Agent", nodes: ["Query understanding", "Routing", "Gap detection"] },
    { role: "Model", nodes: ["LLM — understanding and generation"] },
    {
      role: "Retrieval",
      nodes: ["Agentic RAG", "Knowledge graph reasoning"],
    },
    {
      role: "Sources",
      nodes: ["Wikis", "Docs", "Policies", "Past decisions", "ECM systems"],
    },
    { role: "Security", nodes: ["Access controls", "Permissions enforcement"] },
    { role: "Analytics", nodes: ["Usage monitoring", "Knowledge gap detection"] },
    { role: "Handoff", nodes: ["Route to a subject-matter expert when unanswered"] },
  ],
  architectureCaption:
    "Employees query a governed stack: channel, agent, model, agentic RAG, sources, security, analytics, then a human expert if the corpus has no answer.",
  compliance: [
    {
      label: "Existing permissions",
      desc: "The agent honours the access controls already on your documents and systems.",
    },
    {
      label: "Query audit logging",
      desc: "Questions can be logged so security and knowledge teams can see what was asked and what was returned.",
    },
    {
      label: "Data governance",
      desc: "Retention and handling rules follow your organisation's requirements for internal content.",
    },
    {
      label: "Gap handling",
      desc: "Unanswered questions are flagged rather than filled with a guess.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Your access rules, not a search bar with an AI label",
      desc: "We start from the permissions and documentation you already have.",
    },
    {
      idx: "02",
      title: "A frank read of knowledge-base readiness",
      desc: "Gaps are visible before construction starts, so you are not surprised in week six.",
    },
    {
      idx: "03",
      title: "Unanswered questions become a backlog",
      desc: "You can see what the agent cannot answer and fix the corpus over time.",
    },
    {
      idx: "04",
      title: "Scoped to your systems",
      desc: "Each agent is tailored to your stack, permissions, and documentation — not a one-size-fits-all knowledge portal.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "Policies and product documentation live across a wiki, a shared drive, and years of chat threads. Employees lose time hunting, or they interrupt a colleague who has the answer in their head.",
      "An enterprise knowledge base agent connected to those sources can take a plain-language question — a policy detail, a product specification — and return a governed answer instead of a pile of files.",
      "Questions the agent cannot answer are recorded as documentation gaps. The archive becomes something people actually use.",
    ],
  },
  faqs: [
    {
      q: "What is an enterprise knowledge base agent?",
      a: "An AI system connected to your internal documentation and systems that gives employees accurate, governed answers to their questions.",
    },
    {
      q: "How is it different from enterprise content management software?",
      a: "Content management stores, organises, and version-controls documents. A knowledge agent sits on top of that layer and answers questions from it, using retrieval to find and combine relevant information.",
    },
    {
      q: "How is this different from internal search?",
      a: "It understands natural-language questions and returns a grounded answer, rather than a list of documents to sift through.",
    },
    {
      q: "Will it expose sensitive information to the wrong people?",
      a: "It is built with access controls that respect your existing permissions, so employees only see what they are authorised to see.",
    },
    {
      q: "What happens if it does not know an answer?",
      a: "It flags the gap rather than guessing. That also shows where your documentation needs work.",
    },
    {
      q: "Does it replace our wiki or document management system?",
      a: "No. It integrates with your existing systems rather than replacing them.",
    },
    {
      q: "How long does implementation take?",
      a: "Timeline depends on the number and complexity of knowledge sources, and is scoped during discovery.",
    },
    {
      q: "What is agentic RAG?",
      a: "Agentic RAG is retrieval where the agent decides what to search and how to combine sources, instead of running a single keyword lookup. That is how enterprise knowledge base agents answer from wikis, policies, and related documents together.",
    },
    {
      q: "Is this a knowledge base AI agent or enterprise search?",
      a: "A knowledge base AI agent returns a governed answer. Enterprise search returns a list of files. CloudSwift’s enterprise knowledge agents sit on top of your existing content, with access control.",
    },
  ],
  queryVariants: [
    "enterprise knowledge base agents",
    "enterprise knowledge agents",
    "agentic RAG",
    "RAG for enterprise knowledge",
    "RAG for enterprise knowledge base",
    "RAG for enterprise knowledge base agents",
    "AI knowledge agent",
    "knowledge base AI agent",
    "internal knowledge agent",
    "enterprise AI solutions for internal knowledge",
    "governed access control",
  ],
  internalLinks: [
    SHARED_LINKS.cx,
    SHARED_LINKS.multiAgent,
    SHARED_LINKS.integrations,
    SHARED_LINKS.caseStudies,
    SHARED_LINKS.pricing,
    SHARED_LINKS.blog,
  ],
  externalLinks: [
    {
      anchor: "Microsoft's guidance on retrieval-augmented generation",
      href: "https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview",
    },
    {
      anchor: "Azure OpenAI on your data",
      href: "https://learn.microsoft.com/azure/ai-foundry/openai/concepts/use-your-data",
    },
  ],
  related: [
    {
      anchor: "Customer Support Agents",
      href: "/ai-services/customer-support-agents",
    },
    { anchor: "AI Readiness Assessment", href: PATH.readiness },
    SHARED_LINKS.docIntel,
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
    SHARED_LINKS.deploy,
  ],
};

export const modelDeploymentPage: AgentPage = {
  catalogId: "ai-deploy",
  path: PATH.deploy,
  metaTitle: "AI Model Deployment | Production MLOps for AI & ML Models | CloudSwift",
  metaDescription:
    "CloudSwift builds AI model deployment pipelines — production-ready MLOps grounded in your model registry, with the governance of canary rollouts and audit trails and the reliability of standardized serving infrastructure.",
  category: "AI Operations (MLOps)",
  title: "AI Model Deployment",
  h1: "AI Model Deployment That Turns Trained Models Into Production Systems",
  overviewHeading: "How AI model deployment works",
  gtmEvent: "ai_model_deployment_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Model Deployment" },
  ],
  heroLede:
    "Move trained models out of notebooks and into production — with packaging, serving, monitoring, and rollback as a repeatable MLOps workflow, not a one-off script.",
  heroCta: {
    label: "Talk to us about production model deployment",
    href: "/contact",
  },
  image: "/images/cs/ai-services/ai-model-deployment.webp",
  imageAlt:
    "AI model deployment shown as a phone labeled AI connected through four serving chips to live monitoring charts, with an engineer reviewing the production rollout.",
  imageCaption:
    "Package, serve, monitor, roll back — a repeatable path out of the notebook.",
  overview: [
    "The stage of deploying an AI model is when a trained AI or machine learning model goes from development into a real production environment. Rather than remaining only in a notebook or a test bench, the model is linked to the systems and applications that need it — whether that means real-time predictions or scheduled batch jobs.",
    "As part of an MLOps platform workflow, deployment links model development with model serving and model monitoring. At enterprise scale this means a dependable method for packaging, versioning, testing, releasing, monitoring, and rolling back models rather than a separate deployment script for each project. See case studies and pricing when you are ready to scope an engagement.",
    "CloudSwift’s AI Model Deployment service sits in our MLOps practice. Teams that also ship assistants on top of a live model often pair this work with our Customer Support Agents or Enterprise Knowledge Base Agents. Read from notebook to production (blog) if the harder problem is the operating model, not a single endpoint.",
  ],
  challengesIntro:
    "Putting a model together is only half the job. For many organisations the harder part is getting the model into production and keeping it reliable once it is there.",
  challenges: [
    {
      tag: "Drift",
      title: "Notebooks do not survive production traffic",
      body: "The model performs well in development but behaves differently, slows down, or fails when it meets real load.",
    },
    {
      tag: "Process",
      title: "Every team deploys a different way",
      body: "Ad-hoc scripts make releases hard to reproduce, audit, or hand over when the original author moves on.",
    },
    {
      tag: "Ops",
      title: "No path to watch, detect, or roll back",
      body: "Once a model is live there is often no clear procedure for performance, data drift, or reverting a bad release.",
    },
    {
      tag: "Ownership",
      title: "Science and engineering split the runtime",
      body: "Data science and engineering teams do not always have defined responsibilities for who owns a production model.",
    },
    {
      tag: "Audit",
      title: "Compliance cannot see the live version",
      body: "Audit teams have limited knowledge of which model version is running and when it was deployed.",
    },
  ],
  definition: [
    "AI model deployment is the process of taking a trained model, combining it with everything required for it to operate, and incorporating it into a production environment.",
    "The model can be made available via an API when real-time predictions are required, or used in batch-processing jobs that run on a schedule.",
    "Deployment is closely related to both model serving and model monitoring, but the three are not identical. Model serving is the runtime that hosts the model and handles prediction requests. Model monitoring watches what happens after go-live — performance, latency, and data drift. Deployment is what first gets the model into that operational environment. Cloud providers document the same split in Azure Machine Learning deployment, Amazon SageMaker model deployment, and Vertex AI predictions.",
  ],
  benefits: [
    [
      "Faster time-to-value",
      "A repeatable deployment process gets models from development into production without rebuilding the release path each time.",
    ],
    [
      "More reliable production releases",
      "Standardised packaging and testing catch deployment problems before they reach users.",
    ],
    [
      "Better governance",
      "Model versions, approvals, and deployments are tracked in one place instead of tribal knowledge.",
    ],
    [
      "Lower operational effort",
      "Shared MLOps workflows replace per-team custom deployment scripts.",
    ],
    [
      "Traffic that can scale",
      "Deployment architectures can be designed to absorb changes in workload without a rewrite.",
    ],
    [
      "Faster recovery",
      "Monitoring and rollback make it practical to pull a model that starts to underperform.",
    ],
  ],
  deliverIncluded: [
    "Production-ready model packaging and containerization",
    "CI/CD pipeline design for model testing and deployment",
    "Real-time API and batch inference setup",
    "Model versioning and registry integration",
    "Canary, blue-green, and shadow deployment strategies",
    "Model monitoring for performance, latency, and data drift",
    "LLM deployment for large language models and generative AI workloads",
    "Guidance on cloud-based and self-hosted model deployment platform options",
  ],
  deliverExcluded: [
    "Model training or initial model development, unless included as a separate engagement",
    "Ongoing data labeling and annotation",
    "Development of end-user applications that consume the deployed model API",
    "Other activities outside the agreed project scope",
  ],
  techRows: [
    {
      layer: "Containerization — Docker",
      role: "Packages the model and its dependencies together",
      useCase: "Moving models consistently from development to production",
      benefit: "Reproducible environments",
    },
    {
      layer: "Orchestration — Kubernetes",
      role: "Handles scheduling, scaling, and failover",
      useCase: "Production systems with high traffic or multiple models",
      benefit: "Flexible scaling and infrastructure management",
    },
    {
      layer: "Model serving — KServe, Seldon, Triton, Databricks Model Serving",
      role: "Provides the runtime layer for deployed models",
      useCase: "Real-time prediction and inference APIs",
      benefit: "Built for reliable, high-performance inference",
    },
    {
      layer: "Cloud ML platforms — AWS SageMaker, Google Vertex AI, Azure ML",
      role: "Provides managed deployment infrastructure",
      useCase: "Organisations that prefer managed cloud services",
      benefit: "Less infrastructure to manage",
    },
    {
      layer: "Model registry — MLflow and similar tools",
      role: "Tracks model versions, lineage, and approvals",
      useCase: "Model governance and rollback",
      benefit: "Better traceability and control",
    },
    {
      layer: "Monitoring and observability tools",
      role: "Tracks production behaviour and model health",
      useCase: "Detecting drift, latency issues, and performance degradation",
      benefit: "Earlier detection of problems",
    },
  ],
  techNote:
    "Containers and a registry make releases repeatable. Serving and orchestration take the traffic. Monitoring is what tells you when to retrain or roll back.",
  industries: [
    {
      label: "Financial services",
      body: "Fraud, credit, and risk models deployed with the tracking and governance regulated environments require.",
    },
    {
      label: "Healthcare",
      body: "Deployment workflows that include validation and review before models enter clinical or operational systems.",
    },
    {
      label: "Retail and ecommerce",
      body: "Recommendation, pricing, forecasting, and personalisation models operated at production scale.",
    },
    {
      label: "SaaS and technology",
      body: "AI-powered features and LLM applications incorporated into software products and internal platforms.",
    },
    {
      label: "Highly regulated / safety-critical",
      body: "Extra certification and domain-specific procedures beyond a typical MLOps engagement, including perception-style workloads.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "We look at your present models, infrastructure, applications, and current method of deployment.",
    },
    {
      title: "Assessment",
      desc: "We decide if the workload needs real-time or batch inference and establish traffic, performance, security, and compliance requirements.",
    },
    {
      title: "Architecture design",
      desc: "We establish the deployment architecture — containerization, serving infrastructure, orchestration, and the suitable MLOps platform.",
    },
    {
      title: "Pipeline development",
      desc: "We set up the CI/CD workflow for packaging, testing, approving, and releasing models.",
    },
    {
      title: "Integration",
      desc: "We link the deployment workflow to the model registry, cloud infrastructure, and the applications that use the model.",
    },
    {
      title: "Testing",
      desc: "We evaluate performance, latency, scalability, and failure scenarios under realistic conditions.",
    },
    {
      title: "Production deployment",
      desc: "We adopt a suitable rollout strategy — canary, blue-green, or shadow deployment.",
    },
    {
      title: "Optimisation and monitoring",
      desc: "After launch we watch the model and the infrastructure and tune for performance, latency, reliability, and cost.",
    },
  ],
  architecture: [
    { role: "Trained model", nodes: ["Candidate model from development"] },
    {
      role: "Model registry",
      nodes: ["Versioning", "Lineage", "Approvals"],
    },
    {
      role: "Packaging",
      nodes: ["Containerization", "Docker image", "Dependencies"],
    },
    {
      role: "CI/CD pipeline",
      nodes: ["Automated testing", "Release gates"],
    },
    {
      role: "Serving layer",
      nodes: ["Real-time endpoint", "Batch job"],
    },
    {
      role: "Orchestration",
      nodes: ["Kubernetes", "Managed platform autoscaling"],
    },
    {
      role: "Production traffic",
      nodes: ["Predictions for applications"],
    },
    {
      role: "Model monitoring",
      nodes: [
        "Performance",
        "Drift",
        "Latency",
        "Alerts → retrain / rollback",
      ],
    },
  ],
  architectureCaption:
    "Trained model flows through a registry, packaging, CI/CD, serving, and orchestration into production traffic, with monitoring feeding alerts, retraining, and rollback.",
  compliance: [
    {
      label: "Access control",
      desc: "Role-based access so only authorised people can approve or promote a model version.",
    },
    {
      label: "Deployment approvals",
      desc: "Release gates before a model reaches production, with a recorded decision trail.",
    },
    {
      label: "Audit and version tracking",
      desc: "Logs of which version is live, when it was deployed, and who signed it off.",
    },
    {
      label: "Data and residency",
      desc: "Architectures aligned to regulatory, security, and data-residency requirements when those apply. Named certifications such as SOC 2, HIPAA, or ISO 27001 are cited only where they have been formally verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "An MLOps-first approach",
      desc: "Rather than one-off scripts, we create reusable deployment workflows your next model can use.",
    },
    {
      idx: "02",
      title: "Modern AI workloads",
      desc: "Traditional machine learning as well as LLM deployment and generative AI systems.",
    },
    {
      idx: "03",
      title: "Flexible infrastructure",
      desc: "Managed cloud, private infrastructure, or self-hosted environments — chosen for the workload, not a vendor default.",
    },
  ],
  example: {
    disclaimer:
      "This example is given for illustrative purposes and does not refer to a particular customer engagement.",
    body: [
      "A mid-size financial services company had three fraud-detection models running as manually triggered scripts, each deployed a different way depending on who originally built it.",
      "We established a standardised path using containerized models, a shared model registry, and controlled rollout strategies. Releases became consistent, model versions were visible, and monitoring replaced manual checks.",
    ],
  },
  faqs: [
    {
      q: "What is AI model deployment?",
      a: "AI model deployment is the process of moving a trained model into a production environment where it can generate predictions for live traffic or scheduled batch jobs.",
    },
    {
      q: "What are the four deployment models in cloud computing, and how do they relate to AI model deployment?",
      a: "The four cloud deployment models — public, private, hybrid, and multi-cloud — describe where infrastructure lives, and they directly shape how an AI model gets deployed across managed platforms, self-hosted environments, or a mix of both.",
    },
    {
      q: "What's the difference between model deployment and model serving?",
      a: "Model deployment is the overall process of getting a model into production; model serving is specifically the runtime layer that hosts the model and responds to prediction requests.",
    },
    {
      q: "What's the difference between model deployment and MLOps?",
      a: "MLOps is the broader discipline of managing the full ML lifecycle — training, deployment, and monitoring. Model deployment is one stage within MLOps.",
    },
    {
      q: "How is LLM deployment different from traditional ML model deployment?",
      a: "LLM deployment typically involves larger compute and memory requirements, specialized serving frameworks for token-based inference, and different scaling considerations than classical ML models.",
    },
    {
      q: "What is a model deployment platform?",
      a: "A model deployment platform is software (managed or self-hosted) that handles packaging, serving, scaling, and monitoring for models in production — examples include SageMaker, Vertex AI, Azure ML, and Databricks Model Serving.",
    },
    {
      q: "What is model monitoring, and why does it matter after deployment?",
      a: "Model monitoring tracks a deployed model's performance, latency, and data drift over time, so teams can catch accuracy degradation before it affects users.",
    },
    {
      q: "What are the main AI model deployment strategies?",
      a: "Common strategies include canary deployment, blue-green deployment, and shadow deployment.",
    },
    {
      q: "Can AI models be deployed on-premises instead of the cloud?",
      a: "Yes — self-hosted deployment using Kubernetes and open-source serving frameworks such as KServe, Seldon, or Triton is common for regulated industries or data residency requirements.",
    },
    {
      q: "How long does AI model deployment usually take?",
      a: "Timelines vary by model complexity and existing infrastructure; a standardized pipeline typically reduces per-model deployment time from weeks to hours after initial setup.",
    },
    {
      q: "What are the different AI model types relevant to deployment planning?",
      a: "Classical ML models, deep learning models, and large language models each have different deployment considerations around compute, latency, and serving frameworks.",
    },
    {
      q: "What is real-time vs. batch inference?",
      a: "Real-time inference returns predictions immediately via an API call; batch inference processes large volumes of data on a schedule.",
    },
    {
      q: "How do you roll back a deployed AI model?",
      a: "With a model registry and version-controlled deployment pipeline, rollback means redirecting traffic to the previous model version.",
    },
    {
      q: "What is model drift, and how does it relate to deployment?",
      a: "Model drift is when a deployed model's performance degrades because real-world data no longer matches the data it was trained on.",
    },
    {
      q: "Do deployed models need to be retrained regularly?",
      a: "Retraining cadence depends on how quickly the underlying data changes; model monitoring and drift detection typically inform when retraining is needed.",
    },
    {
      q: "What infrastructure is required for AI model deployment?",
      a: "At minimum: a packaging/containerization step, a serving layer, and orchestration for scaling. Managed cloud platforms include those layers; self-hosted environments assemble them piece by piece.",
    },
  ],
  queryVariants: [
    "AI model deployment",
    "MLOps platform",
    "model serving",
    "model monitoring",
    "machine learning model deployment",
    "LLM deployment",
    "AI model deployment platform",
    "AI model deployment tools",
    "MLOps",
    "AI model training",
    "AI model types",
    "model deployment example",
  ],
  internalLinks: [
    SHARED_LINKS.serving,
    SHARED_LINKS.monitoring,
    SHARED_LINKS.caseStudies,
    SHARED_LINKS.pricing,
    SHARED_LINKS.mlopsBlog,
    SHARED_LINKS.cx,
    SHARED_LINKS.kb,
  ],
  externalLinks: [
    {
      anchor: "Azure Machine Learning deployment",
      href: "https://learn.microsoft.com/azure/machine-learning/concept-model-deploy",
    },
    {
      anchor: "Amazon SageMaker model deployment",
      href: "https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html",
    },
    {
      anchor: "Vertex AI predictions",
      href: "https://cloud.google.com/vertex-ai/docs/predictions/overview",
    },
  ],
  related: [
    { anchor: "Model Serving", href: PATH.infra },
    {
      anchor: "Model Monitoring & Observability",
      href: PATH.monitor,
    },
    {
      anchor: "AI Development Services",
      href: PATH.dev,
    },
    {
      anchor: "AI Workflow Automation",
      href: PATH.workflow,
    },
    {
      anchor: "Customer Support Agents",
      href: "/ai-services/customer-support-agents",
    },
    { anchor: "AI Readiness Assessment", href: PATH.readiness },
  ],
};

export const AGENT_PAGES: AgentPage[] = [
  customerSupportPage,
  enterpriseKnowledgePage,
  modelDeploymentPage,
  hrAssistantPage,
  salesAssistantPage,
  modelMonitoringPage,
  workflowAutomationPage,
  enterpriseChatbotsPage,
  documentIntelligencePage,
  aiInfrastructurePage,
  aiDevelopmentServicesPage,
  aiMvpDevelopmentPage,
  chatgptEnterprisePage,
  aiReadinessPage,
  aiStrategyRoadmapPage,
  aiSaasProductDevelopmentPage,
  multiAgentSystemsPage,
];

export function getAgentPageByPath(path: string) {
  return AGENT_PAGES.find((p) => p.path === path);
}

export function getAgentPageByCatalogId(id: string) {
  return AGENT_PAGES.find((p) => p.catalogId === id);
}

export function agentPageMetadata(page: AgentPage): Metadata {
  const url = `${ORIGIN}${page.path}`;
  const ogImage = `${ORIGIN}${page.image}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    keywords: page.queryVariants,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: page.metaTitle,
      description: page.metaDescription,
      siteName: company.name,
      images: [{ url: ogImage, alt: page.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function agentPageJsonLd(page: AgentPage) {
  const url = `${ORIGIN}${page.path}`;
  const orgId = `${ORIGIN}/#organization`;
  const siteId = `${ORIGIN}/#website`;
  const pageId = url;
  const serviceId = `${url}#service`;
  const faqId = `${url}#faq`;
  const imageId = `${url}#primaryimage`;
  const howToId = `${url}#process`;
  const crumbsId = `${url}#breadcrumb`;
  const articleId = `${url}#article`;
  const relatedId = `${url}#related`;
  const crumbs = page.crumbs ?? [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: page.title },
  ];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": crumbsId,
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.href ? { item: `${ORIGIN}${crumb.href}` } : { item: url }),
    })),
  };
  const faqPage = {
    "@type": "FAQPage",
    "@id": faqId,
    url: `${url}#faqs`,
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  const imageMeta = getServiceImageMeta(page.image);
  const imageObject = {
    "@type": "ImageObject",
    "@id": imageId,
    url: `${ORIGIN}${page.image}`,
    contentUrl: `${ORIGIN}${page.image}`,
    name: page.title,
    caption: page.imageCaption ?? page.imageAlt,
    description: page.imageAlt,
    inLanguage: "en-IN",
    ...(imageMeta
      ? { width: imageMeta.width, height: imageMeta.height }
      : {}),
  };
  const service = {
    "@type": "Service",
    "@id": serviceId,
    name: page.title,
    serviceType: page.title,
    description: page.schemaDescription ?? page.metaDescription,
    areaServed: "Global",
    url,
    image: { "@id": imageId },
    provider: { "@type": "Organization", name: company.name },
  };

  if (page.schemaPreset === "document") {
    return {
      "@context": "https://schema.org",
      "@graph": [service, breadcrumb, faqPage, imageObject],
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.name,
        legalName: company.legalName,
        url: ORIGIN,
        logo: `${ORIGIN}${company.logo}`,
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: ORIGIN,
        name: company.name,
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: page.metaTitle,
        headline: page.h1 ?? page.title,
        description: page.metaDescription,
        isPartOf: { "@id": siteId },
        about: { "@id": serviceId },
        primaryImageOfPage: { "@id": imageId },
        inLanguage: "en-IN",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
        keywords: page.queryVariants.join(", "),
        significantLink: page.related.map((link) => `${ORIGIN}${link.href}`),
        breadcrumb: { "@id": crumbsId },
        mainEntity: { "@id": serviceId },
        hasPart: [{ "@id": faqId }, { "@id": howToId }, { "@id": articleId }],
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: page.title,
        serviceType: page.title,
        category: page.category,
        description: page.schemaDescription ?? page.metaDescription,
        url,
        areaServed: "Global",
        provider: {
          "@type": "Organization",
          "@id": orgId,
          name: company.name,
        },
        image: { "@id": imageId },
        mainEntityOfPage: { "@id": pageId },
        termsOfService: `${ORIGIN}/terms-of-service`,
        isRelatedTo: page.related.map((link) => ({
          "@type": "Service",
          name: link.anchor,
          url: `${ORIGIN}${link.href}`,
        })),
      },
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: page.h1 ?? page.title,
        description: page.metaDescription,
        url,
        image: `${ORIGIN}${page.image}`,
        inLanguage: "en-IN",
        author: { "@id": orgId },
        publisher: { "@id": orgId },
        about: page.queryVariants.slice(0, 8),
        keywords: page.queryVariants.join(", "),
        mainEntityOfPage: { "@id": pageId },
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: `${url}#faqs`,
        isPartOf: { "@id": pageId },
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "HowTo",
        "@id": howToId,
        name: `How CloudSwift delivers ${page.title}`,
        description: page.metaDescription,
        step: page.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.desc,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": crumbsId,
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          ...(crumb.href
            ? { item: `${ORIGIN}${crumb.href}` }
            : { item: url }),
        })),
      },
      {
        "@type": "ItemList",
        "@id": relatedId,
        name: `Services related to ${page.title}`,
        itemListElement: page.related.map((link, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: link.anchor,
          url: `${ORIGIN}${link.href}`,
        })),
      },
      imageObject,
    ],
  };
}

export const queryVariantMap = AGENT_PAGES.map((page) => ({
  url: page.path,
  title: page.title,
  primary: page.queryVariants[0],
  intent: "commercial-investigation",
  variants: page.queryVariants,
  mapsTo: {
    h1: page.h1 ?? page.title,
    definition: "#definition",
    process: "#process",
    faqs: "#faqs",
    schema: page.schemaPreset === "document"
      ? ["Service", "FAQPage", "BreadcrumbList"]
      : ["Service", "FAQPage", "HowTo", "WebPage", "TechArticle"],
  },
  gtm: {
    event: page.gtmEvent ?? "agent_page_view",
    content_group: page.category,
    content_group2: page.path,
    primary_query: page.queryVariants[0],
  },
}));
