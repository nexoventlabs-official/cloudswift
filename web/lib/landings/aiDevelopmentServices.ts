import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const aiDevelopmentServicesPage: AgentPage = {
  catalogId: "ai-powered-apps",
  path: PATH.dev,
  metaTitle: "AI Development Services | Custom AI Built for Your Data",
  metaDescription:
    "CloudSwift builds custom AI — from a validated MVP through production deployment, grounded in your data with the reliability enterprises need.",
  schemaDescription:
    "CloudSwift designs, builds, and deploys custom AI systems — from an AI readiness assessment and proof of concept through production-grade machine learning models, generative AI integration, and AI agent development — tailored to your specific data, workflows, and existing technology.",
  schemaPreset: "document",
  category: "AI Product Development",
  title: "AI Development Services",
  h1: "AI Development Services That Take an Idea From Proof of Concept to Production",
  overviewHeading: "How custom AI development actually starts",
  gtmEvent: "ai_development_services_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Development Services" },
  ],
  heroLede:
    "Custom AI around your data and workflows — from a cheap proof of concept to a production system, not a generic tool you have to bend the business around.",
  heroCta: { label: "Talk to us about an AI build", href: "/contact" },
  image: "/images/cs/ai-services/ai-development-services.webp",
  imageAlt:
    "AI development services linking multiple AI agents to a smart-logistics robot arm and a supply-chain forecast workstation.",
  imageCaption:
    "Custom AI around your data and workflows — not a generic tool you have to bend around.",
  overview: [
    "Most businesses that want to do something with AI hit the same wall fast. Off-the-shelf tools don't quite fit, and building it in-house means hiring expertise most teams don't have yet. That's the gap AI development services exist for — designing, building, and deploying AI systems around your actual data and workflows instead of forcing a generic tool to work.",
    "Sometimes that means custom AI development for one specific business problem. Sometimes it's generative AI development services for an LLM-powered feature, or broader AI consulting services just to figure out where to start at all.",
    "Either way, the goal is the same: something that actually fits. Related work: AI MVP Development when you only need the validation slice, AI Model Deployment when the system has to go live, and AI Infrastructure when the compute underneath is the blocker.",
  ],
  challengesIntro:
    "Most teams exploring this are dealing with some version of the same thing:",
  challenges: [
    {
      tag: "Skills",
      title: "Leadership wants AI — nobody can lead the build",
      body: "There is no internal ML or AI engineering background to own the work.",
    },
    {
      tag: "Fit",
      title: "Off-the-shelf tools die on the workflow that matters",
      body: "The generic case works. Your specific process does not.",
    },
    {
      tag: "Start",
      title: "Everyone agrees AI should happen “somewhere”",
      body: "Nobody has picked the first use case.",
    },
    {
      tag: "Speed",
      title: "A proof of concept has to happen before a hire",
      body: "There is no time to stand up an internal team first.",
    },
    {
      tag: "Ready?",
      title: "Nobody knows if the data can support the idea",
      body: "Infrastructure and corpus quality are still a question, not a given.",
    },
  ],
  definition: [
    "AI development services cover the design, build, and deployment of a custom AI system — one tailored to your specific data, workflows, and existing technology rather than built around a generic tool.",
    "That might mean a machine learning model trained on your own data, a generative AI feature powered by an LLM, or an AI agent that actually takes action inside your existing systems.",
    "Most engagements start smaller than people expect: a proof of concept validates that the idea works before anyone commits to a full production build. That is a much lower-risk starting point than jumping straight into a six-month engineering project.",
  ],
  benefits: [
    [
      "Built around what you actually have",
      "Not a generic tool you have to adapt the business to fit.",
    ],
    [
      "A faster path to something working",
      "A proof of concept before hiring and ramping an internal ML team.",
    ],
    [
      "Lower risk from day one",
      "The idea is validated before anyone commits to full production scope.",
    ],
    [
      "Expertise without a permanent hire",
      "The AI/ML skill set most companies do not need year-round.",
    ],
    [
      "Cost that scales with scope",
      "A proof of concept usually runs far cheaper than the number people assume “AI development” costs before they ask.",
    ],
    [
      "Production-ready, not a demo",
      "What ships is meant to survive real users, not a slide.",
    ],
  ],
  deliverIncluded: [
    "AI readiness assessment — evaluating your data, infrastructure, and use case before anyone commits to a build",
    "Proof of concept and MVP development to validate an AI idea quickly (see AI MVP Development for the focused version)",
    "Custom machine learning model development trained on your own data",
    "Generative AI and LLM integration, including retrieval-augmented generation for grounding answers in your actual content",
    "AI agent development for systems that take action rather than just generate text",
    "Production deployment and the MLOps practices needed to keep the system reliable once it's live",
    "Integration with your existing software, CRM, or data infrastructure",
  ],
  deliverExcluded: [
    "Ongoing model monitoring and MLOps as a standalone service (see AI Model Monitoring and AI Model Deployment)",
    "General software development that has nothing to do with an AI component",
    "Data collection or labeling at scale, which is its own workstream if your project needs it",
  ],
  techRows: [
    {
      layer: "Large language models",
      role: "Power generative features and conversational interfaces",
      useCase: "OpenAI, Anthropic, and open-source LLMs for chat, summarization, agents",
      benefit: "Capability without training a model from scratch",
    },
    {
      layer: "Retrieval-augmented generation",
      role: "Ground LLM outputs in your documents and data",
      useCase: "Reducing hallucination and keeping answers current",
      benefit: "Answers reflect your real content, not just training data",
    },
    {
      layer: "Custom machine learning models",
      role: "Purpose-built models on your specific data",
      useCase: "Prediction, classification, or forecasting generic tools cannot solve well",
      benefit: "Tailored accuracy for your exact use case",
    },
    {
      layer: "Cloud AI platforms",
      role: "Managed infrastructure for train, deploy, and scale",
      useCase: "AWS, Google Cloud, Azure when you want managed over self-hosted",
      benefit: "Faster time to production, less infrastructure overhead",
    },
    {
      layer: "AI agent frameworks",
      role: "Multi-step actions across connected tools",
      useCase: "Agentic workflows that go beyond answering questions",
      benefit: "Automates tasks, not just generates responses",
    },
  ],
  techNote:
    "The mix is chosen for the problem — custom ML, RAG, an agent, or an LLM feature — not whichever demo is easiest to sell.",
  industries: [
    {
      label: "Healthcare",
      body: "Clinical decision support and administrative automation around strict data handling requirements.",
    },
    {
      label: "Financial services",
      body: "Fraud detection, risk modeling, and document automation with audit-ready development practices.",
    },
    {
      label: "Retail & e-commerce",
      body: "Personalization, demand forecasting, and AI-powered customer experience features.",
    },
    {
      label: "SaaS & technology",
      body: "AI embedded in an existing product — copilots and intelligent automation under the hood.",
    },
  ],
  steps: [
    {
      title: "AI readiness assessment",
      desc: "Confirm the project is viable given your data and infrastructure — no point building on a foundation that isn't there.",
    },
    {
      title: "Discovery",
      desc: "Define the specific problem, success criteria, and scope.",
    },
    {
      title: "Proof of concept",
      desc: "Build fast and cheap to validate that the core idea actually works before anyone commits further.",
    },
    {
      title: "Design",
      desc: "Architect the full solution around what the POC proved.",
    },
    {
      title: "Development",
      desc: "Build the production-grade system, model, or integration.",
    },
    {
      title: "Testing",
      desc: "Validate accuracy, performance, and edge cases before launch.",
    },
    {
      title: "Deployment",
      desc: "Release to production with monitoring in place from day one.",
    },
    {
      title: "Optimization",
      desc: "Refine the system based on real usage data once it is live.",
    },
  ],
  architecture: [
    { role: "Start", nodes: ["Business problem", "Use case"] },
    { role: "Gate", nodes: ["AI readiness assessment"] },
    { role: "Validate", nodes: ["Proof of concept"] },
    {
      role: "Build",
      nodes: ["Custom ML / LLM / agent", "System integration", "MLOps"],
    },
    { role: "Live", nodes: ["Deployed system", "Usage data", "Optimization"] },
  ],
  architectureCaption:
    "Readiness first, then a cheap proof of concept, then a production build with integration and MLOps — not a six-month leap.",
  compliance: [
    {
      label: "Access during the build",
      desc: "Role-based access to your data while the system is being developed.",
    },
    {
      label: "Data handling agreements",
      desc: "Clear boundaries for what we touch and how long we keep it.",
    },
    {
      label: "Training documentation",
      desc: "How any model was trained and validated is written down.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "POC before a six-month commitment",
      desc: "The idea gets validated before you scale, not after.",
    },
    {
      idx: "02",
      title: "Your data and systems",
      desc: "Not a generic AI product you are expected to adapt around.",
    },
    {
      idx: "03",
      title: "Full lifecycle",
      desc: "Readiness assessment through production deployment and what comes after.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A mid-size retailer wanted to add AI-powered product recommendations but had no internal ML team, and wasn't even sure their existing data was good enough to work with.",
      "An AI readiness assessment confirmed the data was usable with some cleanup, and a two-week proof of concept showed a custom recommendation model meaningfully outperforming their existing rule-based system. That POC became the business case for a full production build — instead of months of engineering time getting committed upfront to an idea that hadn't actually been tested yet.",
    ],
  },
  faqs: [
    {
      q: "What are AI development services?",
      a: "AI development services cover the design, build, and deployment of custom AI systems — machine learning models, generative AI features, or AI agents — tailored to a specific business's data and workflows.",
    },
    {
      q: "How much does an AI developer cost?",
      a: "Cost varies widely based on project scope, but a proof of concept is typically far less expensive than a full production build, which is why most engagements start with a smaller POC to validate the idea before committing to larger scope.",
    },
    {
      q: "What types of AI solutions are most beneficial for different industries?",
      a: "It depends heavily on the industry — healthcare often benefits from clinical decision support and administrative automation, financial services from fraud detection and risk modeling, and retail from personalization and demand forecasting, among many other use cases specific to each sector's data and workflows.",
    },
    {
      q: "How does AI integration impact existing business processes?",
      a: "Well-integrated AI typically automates or augments a specific step in an existing process rather than replacing the whole process, which is why starting with a narrow, well-defined use case tends to work better than trying to transform an entire workflow at once.",
    },
    {
      q: "What are the typical timelines for AI project phases?",
      a: "An AI readiness assessment usually takes days to a couple weeks, a proof of concept a few weeks to a couple months depending on complexity, and a full production build anywhere from a couple months to longer depending on scope.",
    },
    {
      q: "How can businesses measure the success of AI implementations?",
      a: "Success is usually measured against the specific metric the project was meant to move — accuracy improvement, time saved, cost reduction, or revenue impact — defined clearly during discovery so there's a concrete way to know if the build actually worked.",
    },
    {
      q: "What is the difference between AI development services and AI consulting services?",
      a: "AI consulting typically covers strategy, readiness assessment, and figuring out where to start; AI development services cover the actual building and deployment of the AI system itself — many engagements include both.",
    },
    {
      q: "What is custom AI development?",
      a: "Custom AI development means building an AI system designed specifically around your data, workflows, and existing technology, rather than adapting an off-the-shelf AI product to fit your use case.",
    },
    {
      q: "Do I need an AI readiness assessment before starting a project?",
      a: "It's strongly recommended — an assessment identifies whether your data and infrastructure can actually support the AI use case you have in mind, which avoids investing in a build that was never going to work with the data available.",
    },
    {
      q: "What is a proof of concept in AI development, and why does it matter?",
      a: "A proof of concept is a fast, limited-scope build meant to validate that an AI idea actually works before committing to full production development, significantly reducing the risk and cost of a project that might not have panned out.",
    },
    {
      q: "Can AI development services build generative AI features specifically?",
      a: "Yes, generative AI development is a common engagement type, covering LLM integration, retrieval-augmented generation for grounding outputs in your own content, and AI agents that take action rather than just generate text.",
    },
    {
      q: "Do you build AI features for existing software products, or only new systems?",
      a: "Both — AI integration into an existing product is one of the most common engagement types, alongside building new standalone AI systems from scratch.",
    },
  ],
  queryVariants: [
    "AI development services",
    "AI consulting services",
    "custom AI development",
    "generative AI development services",
    "machine learning development services",
    "AI software development company",
    "AI agent development services",
    "AI integration services",
  ],
  internalLinks: [
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "AI Model Monitoring", href: PATH.monitor },
    { anchor: "AI Infrastructure", href: PATH.infra },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI MVP Development", href: PATH.mvp },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "AI Model Monitoring", href: PATH.monitor },
    { anchor: "AI Infrastructure", href: PATH.infra },
  ],
};
