import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const salesAssistantPage: AgentPage = {
  catalogId: "ai-sales-agent",
  path: PATH.sales,
  metaTitle:
    "AI Sales Assistant | Agentic AI Sales Agent for Revenue Teams | CloudSwift",
  metaDescription:
    "CloudSwift builds AI sales assistants — agentic AI sales agents that handle CRM updates, follow-ups, and lead prioritization, with the accuracy of deal-grounded automation and the control your reps actually want.",
  category: "AI Agent Development",
  title: "AI Sales Assistant",
  h1: "AI Sales Assistant That Gives Reps Their Selling Time Back",
  overviewHeading: "How an AI sales assistant takes admin off the pipeline",
  gtmEvent: "ai_sales_assistant_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Sales Assistant" },
  ],
  heroLede:
    "CRM updates, follow-ups, and lead scoring — handled by an agentic AI sales assistant, with the control your reps actually want.",
  heroCta: { label: "Talk to us about sales AI", href: "/contact" },
  image: "/images/cs/ai-services/ai-sales-assistant.webp",
  imageAlt:
    "An AI sales assistant handles CRM records, follow-up email, and lead scoring beside a sales rep so more time goes to selling.",
  imageCaption:
    "CRM, follow-ups, and lead score — the admin a rep should not still be typing.",
  overview: [
    "Sales teams do not lose deals because reps cannot sell — they lose time reps could have spent selling on CRM data entry, follow-up emails, and figuring out which leads are worth a call. An AI sales assistant takes that weight off.",
    "It handles the repetitive parts of the process: logging activity, scoring leads, drafting outreach, summarizing calls, and keeping the pipeline current. Newer tools in this space are agentic AI sales assistants — they do not just suggest the next step; they can take it, within limits you set.",
    "This is not an AI SDR. An AI SDR typically runs outbound prospecting end to end. The assistant sits inside your existing CRM workflow. Teams that also need a customer-facing bot often pair this with Enterprise Chatbots or Customer Support Agents.",
  ],
  challengesIntro:
    "Most sales teams feel this problem long before they name it. A few patterns show up again and again.",
  challenges: [
    {
      tag: "CRM",
      title: "Reps spend more hours updating the CRM than talking to prospects",
      body: "Activity logging eats the week. The assistant is built to make that part of the job disappear.",
    },
    {
      tag: "Leads",
      title: "Good leads sit untouched",
      body: "Nobody got to them in time. Automated scoring and first-touch drafting close that gap.",
    },
    {
      tag: "Follow-up",
      title: "Emails go out late, generic, or not at all",
      body: "An AI sales assistant drafts the message so the rep is not starting from a blank page.",
    },
    {
      tag: "Forecast",
      title: "Pipeline data is inconsistent",
      body: "Managers cannot get a clean read because the data behind it is messy.",
    },
    {
      tag: "Quota",
      title: "Headcount is not an option, quota still climbs",
      body: "An AI sales assistant platform extends a small team's capacity without a dedicated ops hire.",
    },
  ],
  definition: [
    "An AI sales assistant is a tool that supports a human sales rep's day-to-day work using AI. It is not the same as an AI SDR, which typically runs outbound prospecting on its own from start to finish.",
    "Think of it as something that sits inside your existing workflow: it watches deal activity, flags what needs attention, drafts the message, and updates the CRM. An AI sales agent is a broader term that can mean this kind of assistant or a fully autonomous system. “Assistant” still generally implies a human stays in the loop.",
    "An AI sales copilot usually emphasizes working alongside a rep in real time — on a call or while drafting. “Assistant” is often used more broadly to include background automation too. CloudSwift sets the level of autonomy your team wants, including Salesforce, HubSpot, and Pipedrive AI sales assistant setups.",
  ],
  benefits: [
    [
      "Reps get their selling time back",
      "Less CRM upkeep means more time talking to prospects.",
    ],
    [
      "Nothing falls through the cracks",
      "Lead scoring and follow-up reminders catch what a busy rep might miss.",
    ],
    [
      "Cleaner pipeline data",
      "Consistent activity logging makes forecasting less painful.",
    ],
    [
      "Faster response times",
      "Leads get a first touch sooner, which tracks with higher conversion.",
    ],
    [
      "Lower ramp for new reps",
      "An assistant that already knows a good next step shortens the learning curve.",
    ],
    [
      "Scale without adding headcount",
      "A small team can carry a bigger pipeline when the busywork is handled.",
    ],
  ],
  deliverIncluded: [
    "Lead scoring and prioritization based on engagement and fit",
    "Automated CRM updates pulled from calls, emails, and meetings",
    "AI-drafted follow-up emails and outreach sequences",
    "Call and meeting summarization with action items",
    "Deal-risk flagging based on activity patterns",
    "Integration with your existing CRM — Salesforce, HubSpot, Pipedrive, and others",
    "Setup of an AI sales assistant platform suited to your team's workflow",
  ],
  deliverExcluded: [
    "Fully autonomous outbound prospecting (AI SDR — a related but separate service)",
    "Sales strategy or compensation plan design",
    "CRM migration from a legacy system, unless scoped separately",
  ],
  techRows: [
    {
      layer: "CRM-native AI assistants",
      role: "Built into the CRM your team already uses",
      useCase: "Salesforce Einstein, HubSpot Breeze, Pipedrive AI",
      benefit: "Fastest path to adoption — no new login for reps",
    },
    {
      layer: "Conversation intelligence",
      role: "Analyzes calls for talk-time, objections, and next steps",
      useCase: "Coaching and deal-risk detection",
      benefit: "Turns recordings into structured data",
    },
    {
      layer: "Sales engagement with AI",
      role: "Automates and personalizes multi-step outreach",
      useCase: "Follow-up and nurture at scale",
      benefit: "Consistent touchpoints without manual sending",
    },
    {
      layer: "Agentic AI sales assistant tools",
      role: "Take actions within defined guardrails, not just suggestions",
      useCase: "Teams ready to hand off routine tasks",
      benefit: "More time saved than a suggestion-only copilot",
    },
    {
      layer: "General AI copilots",
      role: "Assist across email, calendar, and CRM",
      useCase: "Teams on Microsoft 365 or Google Workspace",
      benefit: "Lower training overhead",
    },
  ],
  techNote:
    "Best AI sales assistant software depends on the CRM you already run. We configure around that stack instead of forcing a migration.",
  industries: [
    {
      label: "SaaS and technology",
      body: "High-velocity pipelines where lead response time is tied to conversion.",
    },
    {
      label: "Real estate",
      body: "Following up with buyer and seller leads faster than a competing agent.",
    },
    {
      label: "Insurance",
      body: "Renewal and cross-sell across a large existing book of business.",
    },
    {
      label: "Financial services",
      body: "Supporting advisors while keeping activity logs audit-ready.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Map the current sales workflow and where time is being lost.",
    },
    {
      title: "Assessment",
      desc: "Evaluate CRM setup and the existing tool stack for integration fit.",
    },
    {
      title: "Design",
      desc: "Choose scoring, drafting, summarization, and CRM automation for the team.",
    },
    {
      title: "Development",
      desc: "Configure the assistant and connect CRM and communication tools.",
    },
    {
      title: "Integration",
      desc: "Roll out to a pilot group of reps before a full team rollout.",
    },
    {
      title: "Testing",
      desc: "Validate lead-scoring accuracy and CRM data quality against real deals.",
    },
    {
      title: "Deployment",
      desc: "Full team rollout with training.",
    },
    {
      title: "Optimization",
      desc: "Tune scoring models and automation rules after 60–90 days.",
    },
  ],
  architecture: [
    { role: "Rep activity", nodes: ["Calls", "Emails", "Meetings"] },
    { role: "AI sales assistant", nodes: ["Watch", "Draft", "Log"] },
    {
      role: "Capabilities",
      nodes: ["Lead scoring", "Summaries", "Follow-up", "CRM auto-update"],
    },
    { role: "CRM", nodes: ["Salesforce", "HubSpot", "Pipedrive"] },
    { role: "Outcome", nodes: ["Clean pipeline", "Forecasting"] },
  ],
  architectureCaption:
    "Rep activity flows through the AI sales assistant into CRM updates, scoring, summaries, and follow-up drafts.",
  compliance: [
    {
      label: "CRM access",
      desc: "Role-based access to CRM data.",
    },
    {
      label: "Activity logs",
      desc: "A record of every automated action the assistant takes.",
    },
    {
      label: "Send guardrails",
      desc: "Configurable limits on what the assistant can send or update without a rep's review.",
    },
    {
      label: "Regulated outbound",
      desc: "Strict consent contexts need a dedicated compliance review beyond standard assistant setup. Named certifications are cited only where verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "The CRM you already have",
      desc: "No forced migration.",
    },
    {
      idx: "02",
      title: "Agentic, not suggestion-only",
      desc: "Built around agentic AI sales assistant capabilities your reps do not have to act on by hand every time.",
    },
    {
      idx: "03",
      title: "Clear boundary with AI SDR",
      desc: "Assistant support versus full outbound automation — you get the level of autonomy the team wants.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A 12-person sales team at a mid-size SaaS company was losing an estimated day per rep, per week, to CRM data entry and follow-up drafting.",
      "After rolling out an AI sales assistant on their existing CRM, reps stopped manually logging call notes and follow-up emails went out within the hour. They did not add headcount. They got existing reps' time back.",
    ],
  },
  faqs: [
    {
      q: "What is an AI sales assistant?",
      a: "An AI sales assistant is software that uses AI to support a sales rep's daily work, automating CRM updates, drafting follow-ups, scoring leads, and summarizing calls.",
    },
    {
      q: "What's the difference between an AI sales assistant and an AI SDR?",
      a: "An AI sales assistant typically supports a human rep's existing workflow, while an AI SDR more often runs outbound prospecting autonomously from start to finish.",
    },
    {
      q: "What's the difference between an AI sales assistant and an AI sales agent?",
      a: "AI sales agent is a broader term spanning assistant-style tools to fully autonomous systems, while assistant usually implies a human stays in the loop.",
    },
    {
      q: "How is AI changing sales?",
      a: "AI is shifting sales work away from manual admin toward more time spent on actual selling, with AI handling the repetitive administrative layer.",
    },
    {
      q: "What are the benefits of using AI in sales?",
      a: "Key benefits include time saved on administrative work, faster lead response times, more consistent CRM data, shorter rep ramp time, and scaling pipeline coverage without proportional headcount growth.",
    },
    {
      q: "Does an AI sales assistant work with my existing CRM?",
      a: "Most AI sales assistants integrate with major CRMs like Salesforce, HubSpot, and Pipedrive, either natively or as a connected tool.",
    },
    {
      q: "What is an agentic AI sales assistant?",
      a: "An agentic AI sales assistant can take actions on its own, such as sending a follow-up or updating a deal stage, within defined guardrails.",
    },
    {
      q: "Is an AI sales assistant the same as an AI sales copilot?",
      a: "They're closely related; copilot usually emphasizes real-time support during a call or while drafting, while assistant is often used more broadly.",
    },
    {
      q: "Can a small sales team benefit from an AI sales assistant?",
      a: "Yes, smaller teams often see the biggest relative benefit since an assistant can extend limited capacity without a dedicated ops person.",
    },
    {
      q: "How long does it take to set up an AI sales assistant?",
      a: "Timelines vary by CRM complexity, but a focused pilot with one team can typically be running within a few weeks.",
    },
    {
      q: "Will an AI sales assistant replace sales reps?",
      a: "Most AI sales assistants are built to support reps rather than replace them, automating administrative work so reps focus on judgment-driven selling.",
    },
    {
      q: "How much can you save by using an AI sales assistant?",
      a: "Savings are typically measured in rep time recovered from CRM entry and follow-up drafting, varying by team size and prior process maturity.",
    },
  ],
  queryVariants: [
    "AI sales assistant",
    "AI sales assistant software",
    "AI sales agent",
    "AI sales tools",
    "agentic AI sales assistant",
    "AI sales assistant platform",
    "AI SDR",
    "AI sales copilot",
    "best AI sales assistant software",
    "Salesforce AI sales assistant",
    "HubSpot AI sales assistant",
    "Pipedrive AI sales assistant",
  ],
  internalLinks: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "our Customer Support Agents", href: PATH.support },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
  ],
  externalLinks: [],
  related: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "Customer Support Agents", href: PATH.support },
    { anchor: "AI HR Assistant", href: PATH.hr },
  ],
};
