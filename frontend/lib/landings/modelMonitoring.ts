import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const modelMonitoringPage: AgentPage = {
  catalogId: "ai-monitoring",
  path: PATH.monitor,
  metaTitle:
    "AI Model Monitoring | Model Drift Detection for Production ML | CloudSwift",
  metaDescription:
    "CloudSwift builds AI model monitoring pipelines — drift detection and performance tracking grounded in your production data, with the governance of continuous MLOps and the accuracy of statistically-driven alerting.",
  category: "AI Operations (MLOps)",
  title: "AI Model Monitoring",
  h1: "AI Model Monitoring That Catches Model Drift Before It Costs You",
  overviewHeading: "How model monitoring keeps a live model trustworthy",
  gtmEvent: "ai_model_monitoring_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Model Monitoring" },
  ],
  heroLede:
    "Drift detection and performance tracking on production data — so a live model does not fail quietly in the background.",
  heroCta: { label: "Talk to us about model monitoring", href: "/contact" },
  image: "/images/cs/ai-services/ai-model-monitoring.webp",
  imageAlt:
    "AI model monitoring on a Drift Detection dashboard with accuracy, data-drift, and latency charts, plus alerts for performance drop, bias, and data shift.",
  imageCaption:
    "Catch drift, bias, and latency before a live model quietly fails.",
  overview: [
    "AI model monitoring is the ongoing process of tracking a deployed model's predictions, performance, and input data in production to detect accuracy degradation, model drift, or data quality problems.",
    "It is the stage that follows AI model deployment — where model monitoring becomes the safety net that keeps a live model trustworthy instead of quietly failing. As part of a broader ML model monitoring practice, that means continuous tracking, alerting, and a clear path to retraining or rollback.",
    "CloudSwift sets up drift detection grounded in your production data, including Vertex AI model monitoring, SageMaker Model Monitor, and Azure where you already deploy. Pair this with AI Model Deployment when the model is not in production yet.",
  ],
  challengesIntro:
    "Teams rarely notice a model has degraded until the damage is already visible in a business metric.",
  challenges: [
    {
      tag: "Forget",
      title: "Deployed, then ignored",
      body: "No one is watching how the model performs on live data.",
    },
    {
      tag: "Drift",
      title: "Accuracy drops as the world shifts",
      body: "Real-world data moves away from the training distribution. Model drift detection exists to catch that.",
    },
    {
      tag: "Infra",
      title: "Uptime dashboards miss model quality",
      body: "Latency is green while prediction quality is not. Generic observability is not ML model monitoring.",
    },
    {
      tag: "Alert",
      title: "No threshold, so customers find it first",
      body: "Problems show up as a complaint or a bad outcome, not a dashboard.",
    },
    {
      tag: "Audit",
      title: "No trail for leadership or regulators",
      body: "Nothing proves production models are being actively watched.",
    },
  ],
  definition: [
    "AI model monitoring is the continuous tracking of a deployed model's predictions, performance metrics, and input data to detect when behavior changes or degrades.",
    "It is distinct from AI model deployment, which is getting a model into production, and from model observability, which includes monitoring plus the tooling to investigate why a model is behaving a certain way.",
    "Model drift detection — spotting when incoming data or predictions have shifted from training — is the core mechanism most monitoring is built around. Cloud-native options include Vertex AI model monitoring for teams already on Google Cloud.",
  ],
  benefits: [
    [
      "Early problem detection",
      "Catch accuracy degradation and model drift before it hits users or revenue.",
    ],
    [
      "Faster root-cause analysis",
      "ML model monitoring surfaces which feature or input shifted, not just that something went wrong.",
    ],
    [
      "Regulatory and audit readiness",
      "A continuous trail proves models are governed, not deployed and forgotten.",
    ],
    [
      "Less manual spot-checking",
      "Automated alerting replaces infrequent accuracy reviews.",
    ],
    [
      "Informed retraining",
      "Drift signals tell you when retraining is needed instead of a guessed calendar.",
    ],
    [
      "Protection for AI product quality",
      "For customer-facing and generative features, monitoring catches regressions standard QA will miss.",
    ],
  ],
  deliverIncluded: [
    "Model drift detection — data drift, concept drift, and prediction drift",
    "Performance metric dashboards — accuracy, latency, prediction distribution",
    "Automated alerting against defined thresholds",
    "Integration with existing AI model monitoring tools or a recommended stack",
    "AI model monitoring platform selection and setup, managed or self-hosted",
    "Platform-specific support including Vertex AI model monitoring, Azure AI Foundry, and Amazon SageMaker Model Monitor",
    "Retraining-trigger design tied to monitoring signals",
    "Monitoring for LLM and generative AI outputs, not just classical ML",
  ],
  deliverExcluded: [
    "Initial model deployment — see AI Model Deployment",
    "Model retraining execution itself — monitoring identifies when retraining is needed",
    "General application or infrastructure monitoring unrelated to model behavior",
  ],
  techRows: [
    {
      layer: "Model monitoring platforms",
      role: "Track drift, data quality, and model performance",
      useCase: "Evidently AI, Fiddler AI, Arize AI, WhyLabs",
      benefit: "Model-specific detection generic observability misses",
    },
    {
      layer: "General observability",
      role: "Extend infra monitoring with ML metrics",
      useCase: "Datadog, Prometheus, Grafana",
      benefit: "Single pane across infra and model health",
    },
    {
      layer: "Cloud-native monitoring",
      role: "Managed drift and performance on the deploy platform",
      useCase: "Vertex AI model monitoring, SageMaker Model Monitor, Azure",
      benefit: "Less setup when you already deploy there",
    },
    {
      layer: "Statistical drift methods",
      role: "Quantify data and prediction drift",
      useCase: "PSI, KL divergence, Wasserstein distance",
      benefit: "Statistically grounded alerting, not arbitrary thresholds",
    },
  ],
  techNote:
    "Alerting and incident tooling turns a drift signal into a response — investigate, retrain, or roll back.",
  industries: [
    {
      label: "Financial services",
      body: "Credit, fraud, and risk models with audit-ready drift logs.",
    },
    {
      label: "Healthcare",
      body: "Clinical decision-support models with alerting tied to safety thresholds.",
    },
    {
      label: "Retail and ecommerce",
      body: "Recommendation and pricing models where drift hits revenue.",
    },
    {
      label: "SaaS and technology",
      body: "LLM-powered features for output quality drift as usage evolves.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Inventory deployed models and any monitoring already in place.",
    },
    {
      title: "Assessment",
      desc: "Identify which metrics and drift types matter for each model.",
    },
    {
      title: "Design",
      desc: "Select an AI model monitoring platform and define alerting thresholds.",
    },
    {
      title: "Development",
      desc: "Implement monitoring instrumentation and dashboards.",
    },
    {
      title: "Integration",
      desc: "Connect monitoring to incident-response and retraining workflows.",
    },
    {
      title: "Testing",
      desc: "Validate that alerts fire against simulated drift scenarios.",
    },
    {
      title: "Deployment",
      desc: "Roll out monitoring across production models.",
    },
    {
      title: "Optimization",
      desc: "Tune thresholds to reduce alert fatigue while catching real degradation.",
    },
  ],
  architecture: [
    { role: "Production model", nodes: ["Live serving traffic"] },
    { role: "Logging", nodes: ["Predictions", "Inputs"] },
    {
      role: "Monitoring platform",
      nodes: ["Evidently", "Fiddler", "Arize", "Cloud-native"],
    },
    {
      role: "Detection",
      nodes: ["Data drift", "Concept drift", "Accuracy", "Latency"],
    },
    { role: "Alerting", nodes: ["Threshold breach"] },
    { role: "Response", nodes: ["Investigate", "Retrain", "Rollback"] },
  ],
  architectureCaption:
    "Production predictions are logged into a monitoring platform that detects drift and performance issues, then alerts for retrain or rollback.",
  compliance: [
    {
      label: "Audit trail",
      desc: "Logged alerts and drift events for governance reviews.",
    },
    {
      label: "Access control",
      desc: "Who can view or act on monitoring data is role-based.",
    },
    {
      label: "Documented retraining",
      desc: "Retraining decisions are tied to monitoring signals, not ad hoc judgment.",
    },
    {
      label: "Certifications",
      desc: "SOC 2, HIPAA, or ISO 27001 are cited only where formally verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Statistically grounded drift detection",
      desc: "Not arbitrary thresholds.",
    },
    {
      idx: "02",
      title: "Classical ML and generative outputs",
      desc: "LLM monitoring included, not only accuracy on labels.",
    },
    {
      idx: "03",
      title: "Platform-native or self-hosted",
      desc: "Vertex AI model monitoring, SageMaker, Azure, or dedicated AI model monitoring tools.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A retail company's pricing model had been running for six months with no monitoring. Customer behavior shifted after a seasonal change, and predictions drifted from optimal pricing — visible first as a slow dip in margin.",
      "With drift detection and performance dashboards, the same shift would have triggered an alert within days, in time to retrain before it affected revenue at scale.",
    ],
  },
  faqs: [
    {
      q: "What is AI model monitoring?",
      a: "AI model monitoring is the ongoing process of tracking a deployed model's predictions, performance, and input data in production to detect degradation, drift, or data quality issues.",
    },
    {
      q: "What is model drift, and why does it matter?",
      a: "Model drift is when a model's performance degrades because real-world data or patterns have shifted away from what the model was trained on.",
    },
    {
      q: "What's the difference between model monitoring and model observability?",
      a: "Model monitoring tracks predefined metrics and alerts on threshold breaches; model observability is the broader practice of also investigating why a model is behaving a certain way.",
    },
    {
      q: "What's the difference between data drift and concept drift?",
      a: "Data drift is a change in the input data's distribution; concept drift is a change in the relationship between inputs and the correct output.",
    },
    {
      q: "What is Vertex AI model monitoring?",
      a: "Vertex AI model monitoring is Google Cloud's built-in monitoring capability for models deployed on Vertex AI, tracking training-serving skew and prediction drift natively.",
    },
    {
      q: "How is monitoring generative AI or LLM outputs different from monitoring classical ML models?",
      a: "LLM monitoring often tracks output quality, relevance, and safety signals rather than a single accuracy metric, since generative outputs don't have one correct answer.",
    },
    {
      q: "How often should a monitored model be checked for drift?",
      a: "Most monitoring platforms check continuously or on a rolling basis, with alerts triggered when a statistical threshold is crossed rather than at fixed intervals.",
    },
    {
      q: "What triggers a model retraining after monitoring detects an issue?",
      a: "Typically a drift or performance metric crossing a predefined threshold triggers a review, after which a team decides on retraining, rollback, or another intervention.",
    },
    {
      q: "Can model monitoring work alongside general infrastructure monitoring tools like Datadog?",
      a: "Yes — many teams extend general observability platforms with model-specific metrics, though dedicated ML monitoring tools typically offer deeper drift-detection capabilities.",
    },
    {
      q: "What metrics matter most in AI model monitoring?",
      a: "Common metrics include prediction accuracy over time, data drift scores such as PSI or KL divergence, latency, and precision/recall on labeled samples as they become available.",
    },
    {
      q: "Is AI model monitoring required for regulatory compliance?",
      a: "Requirements vary by industry, but regulated sectors like financial services and healthcare increasingly expect documented, ongoing monitoring of production models.",
    },
    {
      q: "What is an AI model monitoring platform?",
      a: "An AI model monitoring platform is software that tracks a deployed model's performance and drift, and alerts teams when something changes, whether managed, self-hosted, or cloud-native.",
    },
    {
      q: "How can businesses measure the ROI of ML model monitoring?",
      a: "ROI is typically measured by comparing monitoring costs against the cost of undetected model failures, including lost revenue, compliance penalties, and engineering time saved through automated detection.",
    },
    {
      q: "How does ML model monitoring support AI governance?",
      a: "Continuous monitoring creates an auditable record of model behavior over time that governance and compliance teams can point to as evidence a model is being actively overseen.",
    },
  ],
  queryVariants: [
    "AI model monitoring",
    "model monitoring",
    "model drift detection",
    "ML model monitoring",
    "AI model monitoring tools",
    "Vertex AI model monitoring",
    "AI model monitoring platform",
    "AI model monitoring software",
    "AI model performance monitoring",
    "ML monitoring tools",
  ],
  internalLinks: [
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "model serving", href: PATH.infra },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "AI Development Services", href: PATH.dev },
    { anchor: "Model Serving", href: PATH.infra },
    { anchor: "AI Workflow Automation", href: PATH.workflow },
  ],
};
