import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const aiStrategyRoadmapPage: AgentPage = {
  catalogId: "ai-roadmap",
  path: PATH.roadmap,
  metaTitle: "AI Strategy & Roadmap | Use Case Discovery to Execution",
  metaDescription:
    "CloudSwift builds your AI strategy and roadmap — from use case discovery and prioritization to a concrete execution plan your teams can actually follow.",
  schemaDescription:
    "CloudSwift builds AI strategy and roadmaps for enterprises — starting with structured AI use case discovery across the business, prioritizing opportunities by feasibility and impact, and sequencing them into a concrete, executable roadmap with clear phases, dependencies, and ownership.",
  schemaPreset: "document",
  category: "AI Consulting & Strategy",
  title: "AI Strategy & Roadmap",
  h1: "AI Strategy & Roadmap: From Use Case Discovery to a Plan You Can Actually Execute",
  overviewHeading: "How use case discovery becomes a plan teams can run",
  gtmEvent: "ai_strategy_roadmap_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Strategy & Roadmap" },
  ],
  heroLede:
    "Which problems AI can actually solve, in what order, with ownership — including use case discovery, not a separate workshop that dies in a folder.",
  heroCta: { label: "Talk to us about an AI roadmap", href: "/contact" },
  image: "/images/cs/ai-services/ai-strategy-roadmap.webp",
  imageAlt:
    "An AI strategy and roadmap from business goals and AI priorities through use cases to ROI, plotted on a 12-to-24-month path.",
  imageCaption:
    "Use case discovery, sequenced — not a folder of slides labeled strategy.",
  overview: [
    "“We should do something with AI” isn't a strategy — it's a feeling. An actual AI strategy starts by figuring out which specific problems AI could realistically solve for your business, ranks them by what's actually worth pursuing first, and turns that into a roadmap with real sequencing, ownership, and milestones.",
    "That process — often called AI use case discovery — is the foundation everything else gets built on, which is why it's not treated as a separate step here. It's baked directly into how this engagement starts.",
    "AI Readiness Assessment often sits beside this work: ready or not informs how aggressive the sequence can be. Execution typically starts with AI MVP Development or AI Development Services.",
  ],
  challengesIntro:
    "Most teams that come looking for this are dealing with some version of:",
  challenges: [
    {
      tag: "No list",
      title: "Everyone agrees AI matters. Nothing is ordered",
      body: "No shared list of what to build, and in what sequence.",
    },
    {
      tag: "Wishlist",
      title: "Ideas with no way to compare them",
      body: "A handful of AI notions, no objective score.",
    },
    {
      tag: "Scatter",
      title: "Pilots here and there, none tied to priorities",
      body: "Previous AI efforts felt busy, not directed.",
    },
    {
      tag: "Board",
      title: "Leadership wants a roadmap. There isn't one",
      body: "Investors and boards do not fund a feeling.",
    },
    {
      tag: "Silos",
      title: "Every team has its own AI wishlist",
      body: "No process for reconciling them into one plan.",
    },
  ],
  definition: [
    "AI strategy and roadmap planning is the process of identifying where AI can realistically create value for a business, prioritizing those opportunities against feasibility and impact, and sequencing them into a concrete execution plan.",
    "It starts with AI use case discovery — systematically surfacing candidate opportunities across the business, rather than just running with whatever idea someone happened to bring up in a meeting — and moves through prioritization into an actual roadmap: what gets built first, what depends on what, and who owns each piece.",
    "The output isn't a slide deck that sits in a folder; it's a plan teams can actually execute against.",
  ],
  benefits: [
    [
      "A ranked, defensible plan",
      "Resourcing follows impact and feasibility, not whoever argued loudest.",
    ],
    [
      "Opportunities nobody had named yet",
      "A systematic pass across the business finds what ad hoc brainstorming misses.",
    ],
    [
      "Something real for a board",
      "An explicit roadmap instead of a vague commitment to “invest in AI.”",
    ],
    [
      "One set of priorities",
      "Less duplicated or conflicting AI work happening in parallel unnoticed.",
    ],
    [
      "Wins that are actually achievable soon",
      "The sequence front-loads feasibility, not the most ambitious idea that stalls first.",
    ],
  ],
  deliverIncluded: [
    "AI use case discovery — a structured process for surfacing candidate AI opportunities across the business",
    "Use case prioritization, scoring each opportunity against feasibility, impact, and cost",
    "A sequenced roadmap with clear phases, dependencies, and ownership",
    "Alignment workshops bringing business and technical stakeholders to the same shared plan",
    "A business case for the highest-priority initiatives, ready to take to leadership or a board",
    "A framework for revisiting and updating the roadmap as priorities and capabilities evolve",
  ],
  deliverExcluded: [
    "The actual AI build or development work itself (see AI MVP Development or AI Development Services)",
    "AI readiness assessment as a standalone deliverable (see AI Readiness Assessment — findings from one often inform the other)",
    "Ongoing AI governance after the roadmap is set",
  ],
  techRows: [
    {
      layer: "Use case discovery frameworks",
      role: "Systematically surface AI opportunities across the business",
      useCase: "Strategy not built only on whichever ideas came up in a meeting",
      benefit: "Surfaces opportunities ad hoc brainstorming would miss",
    },
    {
      layer: "Prioritization and scoring",
      role: "Rank candidates by feasibility, impact, and cost",
      useCase: "More ideas than budget",
      benefit: "An objective basis for resourcing decisions",
    },
    {
      layer: "Roadmapping and portfolio planning",
      role: "Sequence initiatives into phases with dependencies and ownership",
      useCase: "Turning a ranked list into an execution plan",
      benefit: "A roadmap teams can follow, not just a wishlist",
    },
    {
      layer: "Stakeholder alignment workshops",
      role: "Bring business and technical teams to a shared view",
      useCase: "Competing AI wishlists across departments",
      benefit: "One coherent plan instead of parallel uncoordinated efforts",
    },
    {
      layer: "Business case and ROI framing",
      role: "Package initiatives the way leadership and boards decide",
      useCase: "Securing budget and buy-in",
      benefit: "Turns strategy into something fundable, not just aspirational",
    },
  ],
  techNote:
    "Use case discovery is inside this engagement on purpose — it is not a separate destination page.",
  industries: [
    {
      label: "Financial services",
      body: "Prioritizing AI use cases against regulatory constraints and risk tolerance from the start.",
    },
    {
      label: "Healthcare",
      body: "Sequencing AI initiatives around clinical impact and compliance requirements.",
    },
    {
      label: "Manufacturing",
      body: "Opportunities across operations, quality, and supply chain — then sequenced by feasibility.",
    },
    {
      label: "Retail & e-commerce",
      body: "Customer-facing and operational AI use cases ranked against revenue or efficiency impact.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Surface candidate AI use cases systematically across the business, not just from whoever is in the room.",
    },
    {
      title: "Feasibility assessment",
      desc: "Evaluate each candidate against realistic technical and data constraints.",
    },
    {
      title: "Impact scoring",
      desc: "Rank use cases by expected business value, weighed against effort and cost.",
    },
    {
      title: "Prioritization",
      desc: "Narrow the full list down to a focused set worth actually pursuing first.",
    },
    {
      title: "Roadmap design",
      desc: "Sequence prioritized initiatives into phases with clear dependencies.",
    },
    {
      title: "Stakeholder alignment",
      desc: "Bring business and technical leaders to agreement on the final plan.",
    },
    {
      title: "Business case",
      desc: "Package the roadmap for leadership or board approval.",
    },
    {
      title: "Review cadence",
      desc: "Establish how and when the roadmap gets revisited as things change.",
    },
  ],
  architecture: [
    { role: "Discover", nodes: ["Business-wide use cases"] },
    { role: "Score", nodes: ["Feasibility", "Impact"] },
    { role: "Rank", nodes: ["Prioritized list"] },
    {
      role: "Plan",
      nodes: ["Sequenced roadmap", "Business case", "Alignment"],
    },
    { role: "Execute", nodes: ["AI MVP", "AI Development Services"] },
  ],
  architectureCaption:
    "Discover, score, sequence, then execute — use case discovery is the start of the same engagement, not a side project.",
  compliance: [
    {
      label: "Confidential priorities",
      desc: "Competitive priorities and internal operations stay behind clear confidentiality boundaries.",
    },
    {
      label: "Role-based access",
      desc: "Who sees the ranked list and the business case is controlled throughout.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Discovery that finds more than the popular idea",
      desc: "A pass across the business, not a formalization of whatever was already liked internally.",
    },
    {
      idx: "02",
      title: "Feasibility as well as impact",
      desc: "The roadmap front-loads wins that are actually achievable.",
    },
    {
      idx: "03",
      title: "Built to be executed",
      desc: "Not a slide deck that ends up in a folder nobody opens again.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A manufacturing company had a handful of AI ideas floating around — predictive maintenance, quality inspection, demand forecasting — each championed by a different team, with no way to compare them.",
      "A structured use case discovery and prioritization process scored all three (plus a few nobody had named yet) against feasibility and impact, and the resulting roadmap sequenced predictive maintenance first, since it had the clearest data foundation already in place. Eighteen months later, the other initiatives followed in the order the roadmap laid out, instead of competing for the same resources all at once.",
    ],
  },
  faqs: [
    {
      q: "What is AI strategy and roadmap planning?",
      a: "AI strategy and roadmap planning is the process of identifying where AI can create real value for a business, prioritizing those opportunities, and sequencing them into a concrete, executable plan.",
    },
    {
      q: "What is AI use case discovery?",
      a: "AI use case discovery is a structured process for systematically surfacing candidate AI opportunities across a business, rather than relying on whichever ideas happen to come up informally.",
    },
    {
      q: "Why is use case discovery part of this service instead of a separate offering?",
      a: "Use case discovery is a foundational step within strategy work, not a standalone destination most organizations search for or need in isolation — it feeds directly into prioritization and roadmapping, so it's built into the same engagement.",
    },
    {
      q: "How is AI strategy different from an AI readiness assessment?",
      a: "A readiness assessment evaluates whether an organization is prepared to pursue AI initiatives; AI strategy and roadmap planning decides which specific initiatives to pursue and in what order, often after readiness is established.",
    },
    {
      q: "How long does AI strategy and roadmap planning take?",
      a: "Timelines vary by organization size and scope, but a focused engagement covering discovery through a sequenced roadmap can often be completed within a few weeks to a couple months.",
    },
    {
      q: "How do you prioritize which AI use cases to pursue first?",
      a: "Use cases are typically scored against feasibility (can this realistically be built with available data and infrastructure) and impact (how much value would it actually create), with the highest-scoring, most achievable initiatives sequenced first.",
    },
    {
      q: "Does an AI roadmap need to be updated over time?",
      a: "Yes, priorities and capabilities change, so a good roadmap includes a defined cadence for revisiting and adjusting the plan rather than treating it as fixed indefinitely.",
    },
    {
      q: "Who should be involved in AI strategy and roadmap planning?",
      a: "Both business stakeholders who understand where value could be created and technical leaders who understand what's actually feasible — strategy built by only one side tends to miss either the impact or the reality check.",
    },
    {
      q: "Can AI strategy work identify opportunities we haven't thought of yet?",
      a: "Yes, that's often one of the most valuable outcomes — a systematic discovery process across the business regularly surfaces opportunities that informal brainstorming missed.",
    },
    {
      q: "What does the final roadmap actually include?",
      a: "A sequenced set of prioritized initiatives with clear phases, dependencies, ownership, and a business case for the highest-priority items, ready to guide actual execution.",
    },
    {
      q: "Do we need an AI readiness assessment before AI strategy planning?",
      a: "It's not strictly required, but the two often complement each other — readiness findings can directly inform how realistic and sequenced a roadmap should be.",
    },
    {
      q: "What happens after the AI roadmap is finalized?",
      a: "The roadmap typically moves into execution, starting with the highest-priority initiative, often through an AI MVP to validate the first use case before full-scale development.",
    },
  ],
  queryVariants: [
    "AI strategy consulting",
    "AI roadmap",
    "AI strategy",
    "AI use case discovery",
    "AI use case prioritization",
    "enterprise AI strategy",
    "AI implementation roadmap",
    "AI transformation strategy",
  ],
  internalLinks: [
    { anchor: "AI Readiness Assessment", href: PATH.readiness },
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Readiness Assessment", href: PATH.readiness },
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
};
