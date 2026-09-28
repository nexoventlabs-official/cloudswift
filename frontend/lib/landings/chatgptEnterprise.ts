import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const chatgptEnterprisePage: AgentPage = {
  catalogId: "ai-chatgpt",
  path: PATH.chatgpt,
  metaTitle: "ChatGPT Enterprise Integration | Secure Enterprise Rollout",
  metaDescription:
    "CloudSwift integrates ChatGPT Enterprise into your stack — SSO, data governance, and system connections, done right. Independent of OpenAI.",
  schemaDescription:
    "CloudSwift is an independent integration service that configures ChatGPT Enterprise in your environment — SSO through your identity provider, data governance and retention, and connections to internal systems such as SharePoint, Google Drive, and Slack. CloudSwift is not affiliated with, endorsed by, or a partner of OpenAI; the ChatGPT Enterprise license is purchased directly from OpenAI.",
  schemaPreset: "document",
  category: "Generative AI Solutions",
  title: "ChatGPT Enterprise Integration",
  h1: "ChatGPT Enterprise Integration, Done Properly — Not Just Seats Purchased",
  overviewHeading: "What happens after you buy the seats",
  gtmEvent: "chatgpt_enterprise_integration_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "ChatGPT Enterprise Integration" },
  ],
  heroLede:
    "SSO, data governance, and connections to the tools people already use — an independent rollout of OpenAI's ChatGPT Enterprise, not a license reseller.",
  heroCta: { label: "Talk to us about ChatGPT Enterprise", href: "/contact" },
  image: "/images/cs/ai-services/chatgpt-enterprise-integration.webp",
  imageAlt:
    "ChatGPT Enterprise integration in a private, controlled workspace: role-based access, data-loss prevention, audit logging, and company data that stays inside the business.",
  imageCaption:
    "SSO, DLP, and audit logs — an independent rollout, not seats purchased and left ungoverned.",
  overview: [
    "A lot of companies buy ChatGPT Enterprise seats and stop there — which usually means employees are still using it more or less like the consumer version, just with a company card attached. Real ChatGPT Enterprise integration is the work that happens after the purchase: setting up single sign-on, connecting it to the systems people actually work in, and putting the data governance in place that compliance teams will eventually ask about.",
    "It's the difference between owning the tool and actually running it properly.",
    "CloudSwift is not affiliated with, endorsed by, or a partner of OpenAI. ChatGPT Enterprise is OpenAI's product, purchased directly from OpenAI. This page is an independent integration service. Teams that need a broader conversational layer beyond ChatGPT specifically often look at Enterprise Chatbots; custom features on top of an API sit under AI Development Services.",
  ],
  challengesIntro:
    "Most teams that reach out for this have run into one or more of these:",
  challenges: [
    {
      tag: "Shadow",
      title: "People were already using ChatGPT before anyone approved a plan",
      body: "No visibility into what is being typed into a consumer tool.",
    },
    {
      tag: "SSO",
      title: "IT bought seats. Nobody configured single sign-on",
      body: "Login and access still sit outside normal identity controls.",
    },
    {
      tag: "Policy",
      title: "No retention or governance for what goes into ChatGPT",
      body: "Compliance gets nervous the first time someone asks.",
    },
    {
      tag: "Disconnected",
      title: "ChatGPT is a tab, not part of the work",
      body: "SharePoint, Slack, and internal docs stay copy-paste distance away.",
    },
    {
      tag: "Model",
      title: "Nobody knows how Enterprise security differs from personal ChatGPT",
      body: "The gap is exactly why configuration work exists.",
    },
  ],
  definition: [
    "ChatGPT Enterprise integration means configuring and connecting OpenAI's enterprise ChatGPT plan into your actual environment — not just turning it on. That covers single sign-on through your identity provider, data governance and retention settings, and connections to the internal systems and data sources people need ChatGPT to actually work with.",
    "ChatGPT Enterprise is OpenAI's product. ChatGPT for business more broadly covers OpenAI's paid tiers generally. Integration is the separate work of deploying whichever plan properly inside a specific organization's environment, security posture, and existing tools.",
    "CloudSwift does not sell the license. We deploy and configure the one you already bought — or are about to buy from OpenAI.",
  ],
  benefits: [
    [
      "Closes the shadow AI gap",
      "A governed, visible deployment instead of guessing how people already use consumer ChatGPT.",
    ],
    [
      "SSO like every other enterprise tool",
      "Access is managed in one place, not a login floating outside IT.",
    ],
    [
      "Retention set on purpose",
      "Data policy is deliberate, not whatever the default happens to be when compliance asks.",
    ],
    [
      "Inside the workflow, not a browser tab",
      "SharePoint, Slack, Drive — so people stop copy-pasting in and out.",
    ],
    [
      "A security review before the audit scramble",
      "How ChatGPT Enterprise handles data is mapped to your existing policies first.",
    ],
  ],
  deliverIncluded: [
    "Single sign-on (SSO) configuration through your identity provider",
    "Data governance and retention policy setup, aligned with your compliance requirements",
    "Integration with internal systems — SharePoint, Google Drive, Slack, and other tools your teams already use",
    "Access management and role-based permissions across the organization",
    "A security review covering ChatGPT Enterprise's data handling model and how it fits your existing policies",
    "Employee rollout support and usage guidelines, so adoption doesn't happen ad hoc",
  ],
  deliverExcluded: [
    "The ChatGPT Enterprise license or subscription itself — purchased directly through OpenAI",
    "Building custom AI features on top of the OpenAI API beyond standard ChatGPT Enterprise usage (see AI Development Services)",
    "Ongoing content moderation or usage monitoring as a managed service (available as a separate engagement if needed)",
  ],
  techRows: [
    {
      layer: "Identity providers",
      role: "Power SSO for ChatGPT Enterprise access",
      useCase: "Okta, Microsoft Entra ID, Google Workspace",
      benefit: "One set of credentials, one place to revoke access",
    },
    {
      layer: "Enterprise governance tools",
      role: "Monitor and govern interactions organization-wide",
      useCase: "Microsoft Purview and similar for an audit trail",
      benefit: "Visibility into usage without slowing employees down",
    },
    {
      layer: "Connectors",
      role: "Let ChatGPT pull from and act within existing systems",
      useCase: "SharePoint, Google Drive, Slack",
      benefit: "Part of the workflow, not a separate tab",
    },
    {
      layer: "Data loss prevention",
      role: "Catch sensitive data before it reaches an AI tool inappropriately",
      useCase: "Regulated industries with strict handling rules",
      benefit: "A layer beyond ChatGPT Enterprise's own controls",
    },
    {
      layer: "Usage analytics",
      role: "Track adoption and usage patterns",
      useCase: "Measuring ROI and finding training gaps",
      benefit: "Turns “we bought seats” into “here's how it's actually being used”",
    },
  ],
  techNote:
    "This is configuration and connection work on OpenAI's ChatGPT Enterprise product — not a resale of seats, and not a claim of partnership.",
  industries: [
    {
      label: "Financial services",
      body: "Deploying ChatGPT Enterprise with the data retention and audit trail regulators expect.",
    },
    {
      label: "Healthcare",
      body: "Access and data governance so patient information stays out of AI tools inappropriately.",
    },
    {
      label: "Legal",
      body: "Confidentiality controls legal work requires, configured before rollout.",
    },
    {
      label: "Technology & SaaS",
      body: "Connecting ChatGPT Enterprise to internal engineering and product documentation for day-to-day use.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Understand current ChatGPT usage across the org, including informal or unmanaged use.",
    },
    {
      title: "Assessment",
      desc: "Review your identity provider, existing systems, and compliance requirements.",
    },
    {
      title: "Design",
      desc: "Plan SSO configuration, data governance policy, and which systems need to connect.",
    },
    {
      title: "Development",
      desc: "Configure SSO, connectors, and access controls.",
    },
    {
      title: "Integration",
      desc: "Connect ChatGPT Enterprise to internal systems and data sources.",
    },
    {
      title: "Testing",
      desc: "Validate access controls, data handling, and connector behavior before rollout.",
    },
    {
      title: "Deployment",
      desc: "Roll out to a pilot group before organization-wide launch.",
    },
    {
      title: "Optimization",
      desc: "Review usage patterns and adjust governance or training as adoption grows.",
    },
  ],
  architecture: [
    { role: "People", nodes: ["Employee", "SSO"] },
    { role: "Product", nodes: ["ChatGPT Enterprise (OpenAI)"] },
    {
      role: "Controls",
      nodes: ["Identity provider", "Governance & retention", "DLP"],
    },
    { role: "Systems", nodes: ["SharePoint", "Slack", "Drive"] },
    { role: "Outcome", nodes: ["Governed, auditable usage"] },
  ],
  architectureCaption:
    "Employees arrive through SSO. ChatGPT Enterprise sits behind identity, retention policy, DLP, and the connectors to tools you already run.",
  compliance: [
    {
      label: "Independent of OpenAI",
      desc: "CloudSwift is not affiliated with, endorsed by, or a partner of OpenAI. The license is theirs; the deployment work is ours.",
    },
    {
      label: "Role-based access",
      desc: "Who can use ChatGPT Enterprise is the same identity system as the rest of the company.",
    },
    {
      label: "Documented retention",
      desc: "Data handling policy is explicit, not left at the product default.",
    },
    {
      label: "Audit trail",
      desc: "How ChatGPT Enterprise is configured and used can be shown when security asks.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Independent integration, not a sales channel",
      desc: "The focus is your deployment, not moving OpenAI licenses.",
    },
    {
      idx: "02",
      title: "Messy enterprise systems, on purpose",
      desc: "SSO and connectors into what you already run — not a greenfield demo.",
    },
    {
      idx: "03",
      title: "Governance first",
      desc: "Security and compliance are part of the rollout from day one, not an afterthought.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A mid-size professional services firm had purchased ChatGPT Enterprise seats months earlier, but adoption was scattered — some employees used it constantly, others didn't know it existed, and nobody had set up SSO or a data policy.",
      "After a proper integration — SSO through their existing identity provider, a documented retention policy, and connections to their document management system — usage became visible and governed, and IT finally had an actual answer when compliance asked how ChatGPT was being managed.",
    ],
  },
  faqs: [
    {
      q: "What is ChatGPT Enterprise integration?",
      a: "ChatGPT Enterprise integration is the work of configuring and connecting OpenAI's ChatGPT Enterprise plan into an organization's existing systems — SSO, data governance, and connections to internal tools — beyond just purchasing the license.",
    },
    {
      q: "Is this an official OpenAI service?",
      a: "No, this is an independent integration service. CloudSwift is not affiliated with, endorsed by, or a partner of OpenAI; ChatGPT Enterprise is purchased directly through OpenAI, and this service covers deploying and configuring it properly.",
    },
    {
      q: "What's the difference between ChatGPT Enterprise and ChatGPT for business?",
      a: "ChatGPT Enterprise is OpenAI's specific enterprise-tier plan; “ChatGPT for business” is a broader term that can refer to any of OpenAI's paid business plans, including Team and Enterprise tiers.",
    },
    {
      q: "What's the difference between ChatGPT Enterprise and ChatGPT Team?",
      a: "ChatGPT Enterprise generally offers more advanced security, admin, and compliance controls suited to larger organizations, while ChatGPT Team is designed for smaller teams with lighter administrative needs — the right choice depends on organization size and compliance requirements.",
    },
    {
      q: "Why would a company need integration help if they already have ChatGPT Enterprise seats?",
      a: "Purchasing seats doesn't automatically configure SSO, data governance, or connections to internal systems — those require deliberate setup, which is exactly the gap integration services address.",
    },
    {
      q: "What is shadow AI, and why does it matter?",
      a: "Shadow AI refers to employees using AI tools like ChatGPT informally, without official approval or governance — it matters because it creates data security and compliance blind spots that a proper enterprise deployment is meant to close.",
    },
    {
      q: "Can ChatGPT Enterprise be connected to our internal documents and systems?",
      a: "Yes, ChatGPT Enterprise can be integrated with systems like SharePoint, Google Drive, and Slack, so it can work directly with your existing content instead of operating in isolation.",
    },
    {
      q: "How does ChatGPT Enterprise integration support compliance requirements?",
      a: "Integration typically includes setting explicit data retention and governance policies, configuring access controls, and establishing an audit trail — the documentation most compliance and security reviews require.",
    },
    {
      q: "Does ChatGPT Enterprise integration include the license cost?",
      a: "No, the ChatGPT Enterprise subscription itself is purchased directly through OpenAI; this service covers the deployment, configuration, and integration work, not the underlying license.",
    },
    {
      q: "How long does ChatGPT Enterprise integration typically take?",
      a: "Timelines vary based on organization size and existing systems, but a focused integration covering SSO and core system connections can often be completed within a few weeks.",
    },
    {
      q: "How is ChatGPT Enterprise different from the consumer version of ChatGPT?",
      a: "ChatGPT Enterprise includes enterprise-grade security and privacy controls, centralized admin management, and data handling commitments not included in the consumer product, which is why proper configuration matters for organizational use.",
    },
    {
      q: "What happens to data typed into ChatGPT Enterprise?",
      a: "Data handling depends on OpenAI's enterprise data policies combined with the retention and governance settings configured during integration — a proper deployment makes these settings explicit rather than left at default.",
    },
  ],
  queryVariants: [
    "ChatGPT Enterprise integration",
    "ChatGPT Enterprise",
    "ChatGPT for business",
    "enterprise AI integration",
    "ChatGPT Enterprise deployment",
    "ChatGPT Enterprise security",
    "ChatGPT SSO integration",
    "ChatGPT Enterprise vs Teams",
  ],
  internalLinks: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Infrastructure", href: PATH.infra },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
  externalLinks: [
    {
      anchor: "ChatGPT Enterprise (OpenAI)",
      href: "https://openai.com/chatgpt/enterprise/",
    },
  ],
  related: [
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Infrastructure", href: PATH.infra },
    { anchor: "AI Development Services", href: PATH.dev },
  ],
};
