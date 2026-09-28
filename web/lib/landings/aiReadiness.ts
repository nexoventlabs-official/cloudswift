import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const aiReadinessPage: AgentPage = {
  catalogId: "ai-readiness",
  path: PATH.readiness,
  metaTitle: "AI Readiness Assessment | Know If You're Ready to Build",
  metaDescription:
    "CloudSwift's AI readiness assessment evaluates your data, infrastructure, and team before you invest — so you build only where you're actually ready.",
  schemaDescription:
    "CloudSwift's AI readiness assessment evaluates an organization's data quality, technical infrastructure, team skills, and organizational alignment against a specific AI initiative, delivering a prioritized readiness score and a concrete action plan addressing the gaps standing between current state and a successful AI build.",
  schemaPreset: "document",
  category: "AI Consulting & Strategy",
  title: "AI Readiness Assessment",
  h1: "An AI Readiness Assessment That Tells You the Truth Before You Spend the Budget",
  overviewHeading: "How a readiness check stops a six-month surprise",
  gtmEvent: "ai_readiness_assessment_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Readiness Assessment" },
  ],
  heroLede:
    "Data, infrastructure, skills, and alignment — scored against the initiative you actually want to run, before the budget is committed.",
  heroCta: { label: "Talk to us about an AI readiness assessment", href: "/contact" },
  image: "/images/cs/ai-services/ai-readiness-assessment.webp",
  imageAlt:
    "An AI readiness assessment scores whether a company is ready for AI using four checks: data architecture audit, infrastructure health check, skill-gap analysis, and compliance and security review.",
  imageCaption:
    "Ready for AI? Four checks before you commit the budget.",
  overview: [
    "Most AI projects don't fail because the idea was bad — they fail because nobody checked, honestly, whether the organization was ready to pull it off before starting. An AI readiness assessment does that check upfront: looking at your data, your infrastructure, your team's skills, and your actual use case, and giving you a straight answer about where you stand before any real money gets committed.",
    "It's the difference between finding out six months into a build that your data wasn't usable, and finding that out in a week.",
    "If the score says proceed, AI Strategy & Roadmap turns that into a sequenced plan. If gaps show up first, those get named specifically — not a vague “wait.”",
  ],
  challengesIntro:
    "Almost every team that ends up here has run into some version of the same thing:",
  challenges: [
    {
      tag: "Data",
      title: "Leadership wants AI. Nobody checked if the data exists",
      body: "Usable form is the question — not whether a spreadsheet is somewhere.",
    },
    {
      tag: "Stall",
      title: "A previous initiative failed, and nobody knows why",
      body: "Idea, data, team, or infrastructure — they were never separated.",
    },
    {
      tag: "Ready?",
      title: "Enthusiasm, no shared definition of ready",
      body: "IT, data, and the business each mean something different.",
    },
    {
      tag: "Budget",
      title: "Money is about to move with no assessment behind it",
      body: "An allocation without an objective check is a bet, not a plan.",
    },
    {
      tag: "Split",
      title: "Three teams, three opinions, no reconciliation",
      body: "Preparedness is argued, not measured.",
    },
  ],
  definition: [
    "An AI readiness assessment is a structured evaluation of whether an organization has what it needs to successfully build or adopt AI — covering data quality and accessibility, technical infrastructure, team skills and capacity, and organizational alignment around the specific use case in mind.",
    "It's related to, but distinct from, a broader AI maturity assessment, which typically benchmarks an organization's overall AI sophistication across the business rather than evaluating readiness for one specific initiative.",
    "A readiness assessment answers a narrower, more actionable question: are you ready to start this project, right now, and if not, what's actually missing.",
  ],
  benefits: [
    [
      "Budget is not spent finding out the hard way",
      "Unusable data or weak infrastructure shows up in a week, not six months into a build.",
    ],
    [
      "Something objective for leadership",
      "An assessment carries more weight in a budget conversation than internal optimism.",
    ],
    [
      "Specific gaps, not “you're not ready”",
      "The plan is to fix three concrete things — not start over from nothing.",
    ],
    [
      "IT, data, and the business on one picture",
      "That alone resolves a surprising amount of internal disagreement.",
    ],
    [
      "Confirmation when you actually are ready",
      "Sometimes the most useful outcome is removing the doubt that was slowing the decision.",
    ],
  ],
  deliverIncluded: [
    "Evaluation of data quality, accessibility, and volume against the specific use case being considered",
    "Technical infrastructure review — compute, storage, and integration readiness",
    "Team skills and capacity assessment, identifying real gaps versus perceived ones",
    "Organizational readiness review, including stakeholder alignment and change-management considerations",
    "A clear, prioritized readiness score with specific gaps identified, not just a pass/fail verdict",
    "A concrete action plan addressing the highest-priority gaps before any build begins",
  ],
  deliverExcluded: [
    "The actual AI build or development work itself (see AI Strategy & Roadmap or AI Development Services)",
    "Data cleansing or infrastructure remediation execution — the assessment identifies what's needed; fixing it is typically a separate engagement",
    "Ongoing AI governance after initial readiness is established",
  ],
  techRows: [
    {
      layer: "Data quality and profiling",
      role: "Evaluate the actual state of data for the use case",
      useCase: "Clean, complete, and accessible enough — or not",
      benefit: "Evidence instead of assumptions about data quality",
    },
    {
      layer: "Infrastructure and cloud assessment",
      role: "Review compute, storage, and integration against AI load",
      useCase: "Whether current infrastructure can support the intended use case",
      benefit: "Avoids discovering infrastructure gaps mid-build",
    },
    {
      layer: "Readiness scoring frameworks",
      role: "Structured scoring across dimensions",
      useCase: "A consistent, comparable readiness score",
      benefit: "A defensible evaluation rather than a subjective opinion",
    },
    {
      layer: "Stakeholder interviews",
      role: "Capture alignment and skills gaps across teams",
      useCase: "Readiness beyond the purely technical dimension",
      benefit: "Surfaces people and process gaps a technical review would miss",
    },
    {
      layer: "Use case prioritization",
      role: "Rank candidate initiatives by feasibility and value",
      useCase: "Deciding what to assess readiness for first",
      benefit: "Focuses the assessment on what matters most, not everything at once",
    },
  ],
  techNote:
    "The score is for this initiative, not a generic “AI maturity” badge for the whole company.",
  industries: [
    {
      label: "Financial services",
      body: "Readiness against data governance and regulatory requirements before AI initiatives begin.",
    },
    {
      label: "Healthcare",
      body: "Data quality and compliance readiness for clinical or administrative AI use cases.",
    },
    {
      label: "Manufacturing",
      body: "Operational data and infrastructure readiness for predictive maintenance or quality AI.",
    },
    {
      label: "Retail & e-commerce",
      body: "Readiness for personalization or forecasting against existing customer data infrastructure.",
    },
  ],
  steps: [
    {
      title: "Scoping",
      desc: "Define the specific AI use case or initiative the assessment is evaluating readiness for.",
    },
    {
      title: "Data review",
      desc: "Evaluate data quality, accessibility, and volume against what the use case actually needs.",
    },
    {
      title: "Infrastructure review",
      desc: "Assess current technical infrastructure against AI workload requirements.",
    },
    {
      title: "Team and skills",
      desc: "Identify real capability gaps versus what's assumed.",
    },
    {
      title: "Stakeholder interviews",
      desc: "Capture organizational alignment and any internal disagreement about readiness.",
    },
    {
      title: "Scoring",
      desc: "Produce a clear, prioritized readiness score across each dimension.",
    },
    {
      title: "Gap analysis",
      desc: "Name the specific, actionable gaps standing between current state and ready.",
    },
    {
      title: "Roadmap handoff",
      desc: "Deliver a concrete action plan, feeding into AI Strategy & Roadmap if the next step is to move.",
    },
  ],
  architecture: [
    { role: "Input", nodes: ["Candidate AI use case"] },
    {
      role: "Review",
      nodes: ["Data quality", "Infrastructure", "Team skills", "Alignment"],
    },
    { role: "Output", nodes: ["Prioritized score", "Gap analysis"] },
    { role: "Next", nodes: ["Action plan", "Proceed or fix gaps first"] },
  ],
  architectureCaption:
    "Four dimensions scored against one initiative — then a plan, not a pass/fail sticker.",
  compliance: [
    {
      label: "Confidential by default",
      desc: "Sensitive information about internal data and systems stays behind role-based access and clear boundaries.",
    },
    {
      label: "Named gaps, not a leak",
      desc: "The scorecard is for the people who commissioned it.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Honest, including “not yet”",
      desc: "We will tell you when you are not ready rather than invent a reason to start a build.",
    },
    {
      idx: "02",
      title: "Four dimensions, not a tech checklist",
      desc: "Data, infrastructure, team, and organization.",
    },
    {
      idx: "03",
      title: "A path out of the report",
      desc: "The score feeds a plan — it does not sit in a deck nobody acts on.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A mid-size healthcare organization wanted to build an AI tool to help triage patient intake questions, but leadership was split on whether the timing was right.",
      "An AI readiness assessment found the core idea was sound, but patient data was scattered across three disconnected systems with no unified access layer — a real, specific, fixable gap rather than a vague reason to wait. Addressing that one integration issue took a few weeks; the AI project that followed didn't stall the way an earlier, unassessed attempt had.",
    ],
  },
  faqs: [
    {
      q: "What is an AI readiness assessment?",
      a: "An AI readiness assessment is a structured evaluation of whether an organization has the data, infrastructure, skills, and organizational alignment needed to successfully pursue a specific AI initiative.",
    },
    {
      q: "What's the difference between an AI readiness assessment and an AI maturity assessment?",
      a: "A readiness assessment evaluates preparedness for a specific initiative right now, while a maturity assessment typically benchmarks an organization's overall AI sophistication across the business more broadly.",
    },
    {
      q: "How long does an AI readiness assessment take?",
      a: "Timelines vary by organization size and scope, but a focused assessment for one specific use case can often be completed within a couple of weeks.",
    },
    {
      q: "What does an AI readiness assessment actually evaluate?",
      a: "It typically covers data quality and accessibility, technical infrastructure capacity, team skills and capacity, and organizational alignment around the specific AI initiative being considered.",
    },
    {
      q: "What happens if the assessment finds we're not ready?",
      a: "That's a genuinely useful outcome — the assessment identifies specific, actionable gaps to address, rather than leaving the organization to find out the hard way partway through a build.",
    },
    {
      q: "Do we need an AI readiness assessment before every AI project?",
      a: "It's most valuable before a significant initial investment, particularly for an organization's first major AI initiative or one with meaningful budget and risk attached.",
    },
    {
      q: "What is a good AI readiness score, and how is it measured?",
      a: "There's no universal benchmark — a useful readiness score is one that's specific to your use case and clearly identifies which dimensions (data, infrastructure, team, organization) are strong and which need work.",
    },
    {
      q: "Can an AI readiness assessment help us choose which AI use case to pursue first?",
      a: "Yes, readiness assessment often overlaps with use case prioritization, since evaluating readiness against a few candidate use cases naturally surfaces which one is realistically achievable soonest.",
    },
    {
      q: "Who should be involved in an AI readiness assessment internally?",
      a: "Typically IT or data leadership, the business stakeholders who own the use case, and anyone with visibility into current data quality and infrastructure — readiness spans technical and organizational dimensions, so input from both sides matters.",
    },
    {
      q: "Does data quality alone determine AI readiness?",
      a: "No, data quality is a major factor but not the only one — infrastructure capacity, team skills, and organizational alignment around the initiative all matter just as much.",
    },
    {
      q: "How much does an AI readiness assessment cost compared to an AI project?",
      a: "An assessment is typically a small fraction of the cost of a full AI project, which is exactly the point — it's meant to reduce the risk of spending significantly more on an initiative that wasn't actually ready to succeed.",
    },
    {
      q: "What comes after an AI readiness assessment?",
      a: "If the organization is ready, the natural next step is moving into AI Strategy & Roadmap planning or directly into a proof of concept; if gaps were identified, addressing those comes first.",
    },
  ],
  queryVariants: [
    "AI readiness assessment",
    "AI readiness",
    "AI maturity assessment",
    "AI readiness checklist",
    "enterprise AI readiness",
    "AI readiness framework",
    "AI readiness tool",
    "data readiness for AI",
  ],
  internalLinks: [
    { anchor: "AI Strategy & Roadmap", href: PATH.roadmap },
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Strategy & Roadmap", href: PATH.roadmap },
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
};
