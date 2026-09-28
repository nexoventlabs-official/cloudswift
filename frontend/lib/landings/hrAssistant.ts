import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const hrAssistantPage: AgentPage = {
  catalogId: "ai-hr-agent",
  path: PATH.hr,
  metaTitle:
    "AI HR Assistant | AI-Powered HR Chatbot for Employee Support | CloudSwift",
  metaDescription:
    "CloudSwift builds AI HR assistants — AI HR chatbots that answer PTO, benefits, and policy questions instantly, grounded in your HRIS, with the governance of enterprise access controls and the reliability of human-reviewed escalation.",
  category: "AI Agent Development",
  title: "AI HR Assistant",
  h1: "AI HR Assistant for Employee Support That HR Teams Keep",
  overviewHeading: "How an AI HR assistant takes repetitive questions off the desk",
  gtmEvent: "ai_hr_assistant_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI HR Assistant" },
  ],
  heroLede:
    "Give employees instant answers on PTO, benefits, and policy — and give HR back the hours spent answering the same question for the fifteenth time.",
  heroCta: { label: "Talk to us about HR self-service", href: "/contact" },
  image: "/images/cs/ai-services/ai-hr-assistant.webp",
  imageAlt:
    "An AI HR assistant answers employee questions about PTO, benefits, and policy at a shared desk, so HR is not fielding the same requests by hand.",
  imageCaption:
    "Instant answers on PTO, benefits, and policy — with a human handoff when it matters.",
  overview: [
    "Ask any HR team what eats their week, and a chunk of the answer is the same handful of questions — how many PTO days are left, when open enrollment starts, what the policy is on X. An AI HR assistant, often called an HR chatbot, catches those questions before they land on a person's desk.",
    "It gives employees instant answers around the clock, and it gives HR back the time they used to spend answering the same thing again. CloudSwift configures the assistant on your policies and HRIS, with escalation to a real person when the question is sensitive or the answer is not certain.",
    "Teams that also need a customer-facing front door often pair this with our Customer Support Agents. Internal documentation questions that go beyond HR policy sit with Enterprise Knowledge Base Agents.",
  ],
  challengesIntro:
    "A few patterns show up in almost every HR team that looks into an HR chatbot or HR virtual assistant.",
  challenges: [
    {
      tag: "Repeat",
      title: "The same PTO and benefits questions, every week",
      body: "Those tickets take time that could go toward actual HR work — culture, development, complex employee situations.",
    },
    {
      tag: "Hours",
      title: "No answers outside business hours",
      body: "Distributed and shift-based teams wait until someone in HR is free. An AI HR chatbot does not.",
    },
    {
      tag: "Onboard",
      title: "New hires need a person for basic questions",
      body: "First-week questions pile up on whoever happens to be available.",
    },
    {
      tag: "Scale",
      title: "Headcount does not grow with the company",
      body: "Growth and reorgs stretch HR with no easy way to scale support without hiring.",
    },
    {
      tag: "Scatter",
      title: "There is no single front door",
      body: "Questions bounce across email, Slack, and whoever is free. HR self-service is missing.",
    },
  ],
  definition: [
    "An AI HR assistant is a chat-based tool that uses AI to answer employee questions about HR topics: PTO balances, benefits, company policy, onboarding steps, and more.",
    "It is functionally very close to an HR chatbot; the terms are used almost interchangeably. “Assistant” sometimes implies more than answering — kicking off an onboarding workflow or routing a request. An AI assistant still keeps a human owning policy. An AI agent implies more autonomous action. Most HR tools in this space today are assistants.",
    "The core idea is HR self-service: a front door for employees, and time back for HR. An AI recruiting assistant is a separate category — candidate screening and hiring, not ongoing employee support.",
  ],
  benefits: [
    [
      "HR gets hours back every week",
      "Fewer repeat questions land directly on a person's desk.",
    ],
    [
      "Employees get answers instantly",
      "Including outside business hours — not whenever someone in HR has a free minute.",
    ],
    [
      "Onboarding gets smoother",
      "New hires can ask basic questions without waiting on a scheduled call.",
    ],
    [
      "Consistency across the board",
      "Every employee gets the same accurate answer to a policy question.",
    ],
    [
      "HR can focus on HR work",
      "Less repetitive Q&A means more time on culture, development, and complex situations.",
    ],
    [
      "Scales without adding headcount",
      "A growing company can support more employees without HR growing at the same rate.",
    ],
  ],
  deliverIncluded: [
    "Instant answers to PTO, benefits, and policy questions",
    "Onboarding support for common first-week questions",
    "Integration with your existing HRIS and benefits platforms",
    "Escalation routing to the right HR person when the assistant cannot resolve the request",
    "Multi-channel deployment — Slack, Teams, or a standalone chat widget",
    "Setup of AI HR software tailored to your policies and systems",
  ],
  deliverExcluded: [
    "Formal HR case management or investigations",
    "Compensation or benefits plan design",
    "Full HRIS implementation or migration, unless scoped separately",
    "AI recruiting assistant work — candidate screening and hiring workflows",
  ],
  techRows: [
    {
      layer: "Conversational AI platforms",
      role: "Natural-language understanding behind employee questions",
      useCase: "Enterprise-scale employee self-service",
      benefit: "Handles a wide range of phrasing without rigid scripts",
    },
    {
      layer: "HRIS-native assistants",
      role: "Built into the HR platform you already use",
      useCase: "Teams that want AI without adding a new login",
      benefit: "Works with data already in the system",
    },
    {
      layer: "Slack and Microsoft Teams",
      role: "Deliver the assistant where employees already work",
      useCase: "Distributed or hybrid teams",
      benefit: "No separate portal required",
    },
    {
      layer: "HR chatbot builders",
      role: "Configurable platforms for HR-specific workflows",
      useCase: "Custom HR chatbot shaped around your policies",
      benefit: "Flexibility without a generic template",
    },
  ],
  techNote:
    "Recruiting-specific AI assistants — screening and scheduling — are a related category, not this service. See AI recruiting assistant as a separate scope.",
  industries: [
    {
      label: "Healthcare",
      body: "Shift-based staff who need HR answers outside standard office hours.",
    },
    {
      label: "Retail",
      body: "High turnover and onboarding volume without overwhelming a small HR team.",
    },
    {
      label: "Remote and distributed teams",
      body: "Employees across time zones get instant HR support.",
    },
    {
      label: "Professional services",
      body: "HR stays on higher-value work as headcount grows.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Identify the most common employee questions and where HR time currently goes.",
    },
    {
      title: "Assessment",
      desc: "Review your HRIS, benefits platform, and communication channels.",
    },
    {
      title: "Design",
      desc: "Map which questions the assistant handles and which route to a human.",
    },
    {
      title: "Development",
      desc: "Configure the assistant with your policies and integrate HR systems.",
    },
    {
      title: "Integration",
      desc: "Deploy into Slack, Teams, or wherever employees already communicate.",
    },
    {
      title: "Testing",
      desc: "Validate answer accuracy against real policy documents before rollout.",
    },
    {
      title: "Deployment",
      desc: "Company-wide rollout with a clear announcement to employees.",
    },
    {
      title: "Optimization",
      desc: "Review unanswered or escalated questions and expand what the assistant can handle.",
    },
  ],
  architecture: [
    { role: "Employee", nodes: ["Chat", "Slack", "Teams"] },
    { role: "AI HR assistant", nodes: ["Intent", "Policy lookup", "Routing"] },
    {
      role: "Actions",
      nodes: ["Benefits lookup", "PTO balance", "Onboarding guidance"],
    },
    { role: "Escalation", nodes: ["Unresolved → HR person"] },
    { role: "Source of truth", nodes: ["HRIS", "Benefits platform"] },
    { role: "Outcome", nodes: ["Instant answer", "Handoff to HR"] },
  ],
  architectureCaption:
    "Employee questions flow through the AI HR assistant into HRIS-backed answers, with unresolved cases routed to a human.",
  compliance: [
    {
      label: "Access control",
      desc: "Role-based access to employee data so the assistant only sees what it is allowed to see.",
    },
    {
      label: "Conversation logs",
      desc: "Full logs of what was asked and answered for review.",
    },
    {
      label: "Sensitive escalation",
      desc: "Clear paths for anything that should not be handled by AI alone.",
    },
    {
      label: "Policy ownership",
      desc: "HR retains judgment and accountability. Named certifications are cited only where formally verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Beside HR, not around them",
      desc: "Every escalation path leads to a real person.",
    },
    {
      idx: "02",
      title: "Your HRIS, not a new island",
      desc: "Integrates with the HRIS and benefits platforms you already use.",
    },
    {
      idx: "03",
      title: "Your policies, not a generic script",
      desc: "Configured around what you actually publish to employees.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A 200-person company's two-person HR team was fielding the same PTO and benefits questions dozens of times a week.",
      "After rolling out an AI HR assistant connected to their HRIS, most of those routine questions were answered instantly. The HR team stayed available — they just stopped spending the day on questions the assistant could already answer accurately.",
    ],
  },
  faqs: [
    {
      q: "What is an AI HR assistant?",
      a: "An AI HR assistant is a chat-based tool that uses AI to answer employee questions about HR topics like PTO, benefits, and company policy, instantly and around the clock.",
    },
    {
      q: "Is an AI HR assistant the same as an HR chatbot?",
      a: "The terms are largely interchangeable, both describing AI-powered tools that handle routine employee HR questions.",
    },
    {
      q: "Is HR at risk with AI?",
      a: "No. An AI HR assistant is built to support HR teams by handling repetitive questions, not to replace the judgment and complex decision-making HR work requires.",
    },
    {
      q: "What is the best AI tool for HR?",
      a: "The right tool depends on your HRIS, team size, and how much of the work you want automated, ranging from HRIS-native assistants to standalone chatbot platforms.",
    },
    {
      q: "How to use AI for HR work?",
      a: "Most teams start by identifying repetitive employee questions, then deploy an AI HR assistant to handle those directly while routing complex issues to a human.",
    },
    {
      q: "Does an AI HR assistant integrate with my existing HRIS?",
      a: "Most AI HR assistants integrate with major HRIS and benefits platforms, either natively or through a connected tool.",
    },
    {
      q: "Can an AI HR assistant help with employee onboarding?",
      a: "Yes. Many AI HR assistants guide new hires through common first-week questions and can trigger onboarding workflow steps automatically.",
    },
    {
      q: "What's the difference between an AI HR assistant and an AI recruiting assistant?",
      a: "An AI HR assistant handles ongoing employee support, while an AI recruiting assistant focuses on candidate screening, scheduling, and hiring workflows.",
    },
    {
      q: "What happens if the AI HR assistant can't answer a question?",
      a: "It routes the question to the appropriate HR team member, so the assistant handles what it can and escalates the rest.",
    },
    {
      q: "How long does it take to set up an AI HR assistant?",
      a: "Timelines vary by HRIS complexity, but a focused rollout covering common employee questions can typically launch within a few weeks.",
    },
    {
      q: "Will employees actually use an AI HR assistant instead of asking a person?",
      a: "Adoption is usually high when the assistant is fast, accurate, and available where employees already communicate, such as Slack or Teams.",
    },
    {
      q: "Can an AI HR assistant handle sensitive employee situations?",
      a: "No. Sensitive matters like investigations should always be routed to a human HR team member. The assistant is designed for routine, policy-based questions.",
    },
    {
      q: "What role does human review play in an AI HR assistant?",
      a: "Human review covers escalated questions, periodic audits of assistant answers, and ownership of the underlying policy content. The assistant handles volume; HR retains judgment and accountability.",
    },
    {
      q: "How do you prevent an AI HR assistant from sharing incorrect or outdated information?",
      a: "By connecting the assistant directly to current HRIS and policy documents as the source of truth and regularly reviewing flagged or low-confidence answers.",
    },
  ],
  queryVariants: [
    "AI HR assistant",
    "HR chatbot",
    "AI HR software",
    "AI recruiting assistant",
    "HR virtual assistant",
    "AI HR chatbot",
    "HR self-service",
    "employee support chatbot",
  ],
  internalLinks: [
    { anchor: "our Customer Support Agents", href: PATH.support },
    { anchor: "Enterprise Knowledge Base Agents", href: PATH.knowledge },
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
  ],
  externalLinks: [],
  related: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "Enterprise Knowledge Base Agents", href: PATH.knowledge },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "Customer Support Agents", href: PATH.support },
  ],
};
