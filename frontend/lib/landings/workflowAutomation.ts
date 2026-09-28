import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const workflowAutomationPage: AgentPage = {
  catalogId: "ai-workflow-agent",
  path: PATH.workflow,
  metaTitle:
    "AI Workflow Automation | Agentic Workflows for Enterprise Operations | CloudSwift",
  metaDescription:
    "CloudSwift builds AI workflow automation — agentic workflows that connect your tools and handle multi-step decisions, with the governance of enterprise process controls and the reliability of tested, exception-aware automation.",
  category: "AI Agent Development",
  title: "AI Workflow Automation",
  h1: "AI Workflow Automation That Thinks Past a Brittle Script",
  overviewHeading: "How agentic workflows handle processes that Zapier cannot",
  gtmEvent: "ai_workflow_automation_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Workflow Automation" },
  ],
  heroLede:
    "Connect your tools and handle multi-step decisions — agentic workflows with exception paths, not another trigger that breaks when the process changes.",
  heroCta: { label: "Talk to us about workflow automation", href: "/contact" },
  image: "/images/cs/ai-services/ai-workflow-automation.webp",
  imageAlt:
    "AI workflow automation illustration: a live-tasks flowchart from data ingest through AI processing and decision points, with an operator monitoring on a tablet",
  overview: [
    "Most teams already use some automation: a trigger in Zapier, a scheduled report. Traditional workflow automation software only works as long as things happen exactly as designed. If a small part of the process changes, it breaks.",
    "AI workflow automation introduces real decision-making. The system can handle messy, multi-step processes without a person intervening every time something looks slightly different. Some people call these agentic workflows — automation that does not just follow a script, but decides what needs to happen next.",
    "It sits next to intelligent automation (AI plus RPA) and business process automation AI. CloudSwift maps the process, builds the workflow, and connects the tools you already run. Chatbots and assistants often trigger these workflows — see Enterprise Chatbots and AI HR Assistant.",
  ],
  challengesIntro:
    "Almost every business we talk to faces the same set of challenges.",
  challenges: [
    {
      tag: "Silos",
      title: "Work bounces between five tools",
      body: "Someone has to copy and paste data between them.",
    },
    {
      tag: "Brittle",
      title: "The automation you have already breaks",
      body: "It cannot handle variation outside a narrow, predictable pattern.",
    },
    {
      tag: "Repeat",
      title: "Approvals and reporting eat the week",
      body: "Hours that could be spent on actual work.",
    },
    {
      tag: "Capacity",
      title: "Building automations is another full-time job",
      body: "Limited resources, already-full plates.",
    },
    {
      tag: "Scale",
      title: "More work, no more headcount",
      body: "You cannot justify hiring, but the workload still grows.",
    },
  ],
  definition: [
    "AI workflow automation uses artificial intelligence to manage multi-step business processes more autonomously. Unlike older workflow automation tools that use rigid if-this-then-that rules, AI-driven workflows can interpret unstructured data, make judgment calls, and escalate to a human only when true uncertainty arises.",
    "It is closely related to intelligent automation and agentic workflow orchestration. A no-code AI workflow automation platform can still be the builder; the difference is decision-making inside the steps, not only the trigger.",
    "Can you just use ChatGPT to build a workflow? ChatGPT can help draft logic and scripts. It is not designed to run persistent, multi-tool processes your operations require. You still need a dedicated automation platform.",
  ],
  benefits: [
    [
      "Fewer handoffs, less re-entry",
      "Work flows between systems without manual copy-paste.",
    ],
    [
      "Handles complexity",
      "AI can interpret unstructured input that would break rigid rules.",
    ],
    [
      "Time savings",
      "Approvals, reconciliations, and reporting that took days drop to hours.",
    ],
    [
      "Fewer errors",
      "Workflows do not miss steps.",
    ],
    [
      "Scales without proportional hiring",
      "Increase workload without adding headcount at the same rate.",
    ],
    [
      "Clearer ROI",
      "Hours saved and errors avoided often show up faster than teams expect.",
    ],
  ],
  deliverIncluded: [
    "Process mapping — the highest-value areas to automate",
    "AI-powered workflow design and build — multi-step automations that use AI for decisions",
    "Integration with CRM, ERP, support tools, spreadsheets, and other systems you already use",
    "Exception handling that routes uncertain cases to a human instead of failing",
    "Testing against your historical data before launch",
    "Ongoing monitoring for performance and early issue detection",
  ],
  deliverExcluded: [
    "Complete legacy system replacement or foundational rewrites",
    "Custom AI model development",
    "Persistent manual intervention required to run the process",
    "Legally required human sign-off in safety-critical settings — automation supports, it does not replace",
  ],
  techRows: [
    {
      layer: "No-code / low-code automation platforms",
      role: "Visual builders connecting apps without custom code",
      useCase: "Fast automation for teams without a large engineering bench",
      benefit: "Rapid deployment, easier for non-engineers to manage",
    },
    {
      layer: "AI-native automation tools",
      role: "Decision-making inside workflow steps",
      useCase: "Judgment and unstructured data",
      benefit: "Handles messy scenarios traditional tools cannot",
    },
    {
      layer: "RPA platforms",
      role: "UI automation for systems without APIs",
      useCase: "Legacy applications",
      benefit: "Extends existing software instead of replacing it",
    },
    {
      layer: "Agentic workflow orchestration",
      role: "Coordinate multi-step, multi-tool processes with agents",
      useCase: "Complex operations with many decision points",
      benefit: "Fewer manual handoffs",
    },
    {
      layer: "Business process automation suites",
      role: "Workflow design, approvals, and reporting",
      useCase: "Enterprise-wide operational processes",
      benefit: "Integrated BPA for a wide range of tasks",
    },
  ],
  techNote:
    "We use the tools you already have where they fit. The point is agentic workflow design, not a forced platform migration.",
  industries: [
    {
      label: "Financial services",
      body: "Reconciliation, reporting, and approval workflows with accuracy and an audit trail.",
    },
    {
      label: "Healthcare",
      body: "Administrative intake, scheduling, and documentation — not clinical decisions.",
    },
    {
      label: "Customer support",
      body: "Routing, triage, and resolution of common inquiries.",
    },
    {
      label: "Professional services",
      body: "Client onboarding, recurring reports, and internal operations.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Map current manual processes and quantify the cost.",
    },
    {
      title: "Assessment",
      desc: "Identify the best automation opportunities by impact.",
    },
    {
      title: "Design",
      desc: "Architect the workflow, AI decision points, and human intervention zones.",
    },
    {
      title: "Development",
      desc: "Build the automation and connect it to your stack.",
    },
    {
      title: "Integration",
      desc: "Ensure data flow between systems of record and the workflow.",
    },
    {
      title: "Testing",
      desc: "Validate with historical data, including hard edge cases.",
    },
    {
      title: "Deployment",
      desc: "Roll out gradually, starting with lower-risk processes.",
    },
    {
      title: "Optimization",
      desc: "Refine and expand based on live performance.",
    },
  ],
  architecture: [
    { role: "Trigger", nodes: ["Event", "Schedule", "Chatbot / assistant"] },
    { role: "Orchestration", nodes: ["Agentic workflow", "Decision steps"] },
    {
      role: "Systems",
      nodes: ["CRM", "ERP", "Support", "Spreadsheets", "RPA"],
    },
    { role: "Exceptions", nodes: ["Uncertain → human"] },
    { role: "Controls", nodes: ["Permissions", "Logging"] },
    { role: "Outcome", nodes: ["Completed process", "Audit trail"] },
  ],
  architectureCaption:
    "A trigger enters an agentic workflow that calls your systems, routes exceptions to a human, and logs the result.",
  compliance: [
    {
      label: "Permissions",
      desc: "Role-based access on what the workflow can read and write.",
    },
    {
      label: "Logging",
      desc: "A trail of steps taken and who approved exceptions.",
    },
    {
      label: "Human sign-off",
      desc: "Required decisions stay with a person in regulated or safety-critical cases.",
    },
    {
      label: "Testing",
      desc: "Historical-data tests before production, including edge cases.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Intelligent automation, not only triggers",
      desc: "Workflows powered by real decision-making.",
    },
    {
      idx: "02",
      title: "The tools you already use",
      desc: "Integration first — not a costly platform migration.",
    },
    {
      idx: "03",
      title: "AI action and human oversight, both named",
      desc: "A clear line between automated steps and required review.",
    },
  ],
  example: {
    disclaimer:
      "This is a hypothetical scenario to illustrate the potential.",
    body: [
      "A finance team spent two full days each month on manual reconciliation across three systems.",
      "An AI-driven workflow pulled data from all three, resolved minor discrepancies, and routed only the truly complex cases for review. Reconciliation dropped to a few hours of focused work per month. They kept oversight without the heavy lifting.",
    ],
  },
  faqs: [
    {
      q: "What is AI workflow automation?",
      a: "AI workflow automation uses AI to manage multi-step business processes more autonomously, interpreting messy inputs and escalating only when true uncertainty arises.",
    },
    {
      q: "How is AI workflow automation different from workflow automation software like Zapier?",
      a: "Traditional workflow automation tools follow rigid if-this-then-that rules and break when the process varies. AI workflow automation can interpret unstructured data and make judgment calls inside the flow.",
    },
    {
      q: "What is an agentic workflow?",
      a: "An agentic workflow is automation that does not only follow a script — it decides what needs to happen next across tools, with guardrails and human exception paths.",
    },
    {
      q: "What is intelligent automation?",
      a: "Intelligent automation is the intersection of AI and RPA — combining decision-making with the ability to act in systems, including legacy UIs.",
    },
    {
      q: "Can I just use ChatGPT to build a workflow?",
      a: "ChatGPT can help draft logic and scripts, but it is not designed to run persistent, multi-tool operational processes. A dedicated automation platform is still required.",
    },
    {
      q: "What is the difference between AI workflow automation and RPA?",
      a: "RPA automates clicks and forms in systems without APIs. AI workflow automation adds judgment across steps. Many engagements use both.",
    },
    {
      q: "What is a no-code AI workflow automation platform?",
      a: "A visual builder that connects apps without custom code, with AI decision steps inside the flow so non-engineers can still ship automations.",
    },
    {
      q: "What is business process automation AI?",
      a: "BPA suites that use AI inside enterprise workflow design, approvals, and reporting — typically for broader operational processes, not a single Zap.",
    },
    {
      q: "Which processes should not be fully automated?",
      a: "Decisions legally or operationally required to be made by a human — for example medical diagnoses or major financial transactions. Automation can support those steps; it should not replace sign-off.",
    },
    {
      q: "How long does AI workflow automation take to deploy?",
      a: "It depends on integrations and exception paths. We typically start with a lower-risk process, test against historical data, then expand.",
    },
  ],
  queryVariants: [
    "AI workflow automation",
    "workflow automation software",
    "workflow automation tools",
    "intelligent automation",
    "agentic workflow",
    "business process automation AI",
    "no-code AI workflow automation",
    "AI workflow automation platform",
  ],
  internalLinks: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI HR Assistant", href: PATH.hr },
    { anchor: "AI Sales Assistant", href: PATH.sales },
    { anchor: "our Customer Support Agents", href: PATH.support },
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
  ],
  externalLinks: [],
  related: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI HR Assistant", href: PATH.hr },
    { anchor: "AI Sales Assistant", href: PATH.sales },
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "Document Intelligence", href: PATH.docIntel },
    { anchor: "Multi-Agent Systems", href: PATH.multiAgent },
  ],
};
