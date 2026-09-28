import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const aiInfrastructurePage: AgentPage = {
  catalogId: "ai-infra",
  path: PATH.infra,
  metaTitle: "AI Infrastructure | GPU Compute, Storage & Orchestration",
  metaDescription:
    "CloudSwift builds AI infrastructure — GPU compute, storage, and orchestration designed to train, deploy, and scale AI workloads reliably.",
  schemaDescription:
    "CloudSwift designs GPU compute, high-throughput storage, and orchestration so training, inference, and monitoring run as one system — across cloud, on-premises, or hybrid — with usage tracking that keeps spend explainable.",
  schemaPreset: "document",
  category: "AI Operations (MLOps)",
  title: "AI Infrastructure",
  h1: "AI Infrastructure Built to Handle What Standard IT Wasn't Designed For",
  overviewHeading: "How AI infrastructure differs from the stack you already run",
  gtmEvent: "ai_infrastructure_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "AI Infrastructure" },
  ],
  heroLede:
    "GPU compute, storage, and orchestration built for training and inference — not a general-purpose stack asked to do AI after the fact.",
  heroCta: { label: "Talk to us about AI infrastructure", href: "/contact" },
  image: "/images/cs/ai-services/ai-infrastructure.webp",
  imageAlt:
    "AI infrastructure for training and inference: GPU cluster orchestration, cost optimization, auto-scaling inference, and storage feeding business applications.",
  imageCaption:
    "The specialized layer that trains, serves, and scales AI — not a general IT stack.",
  overview: [
    "Standard IT infrastructure was built for a different kind of workload — web servers, databases, everyday application traffic. AI changes the math entirely. Training a model or running inference at real scale needs GPU compute, high-throughput data pipelines, and orchestration that most general-purpose infrastructure was never designed to handle.",
    "AI infrastructure is that specialized layer: the hardware, software, and networking that actually makes training, deploying, and scaling AI workloads work reliably, instead of falling over the moment demand gets serious.",
    "CloudSwift designs that layer across cloud, on-premises, or hybrid — then ties it to AI Model Deployment when a trained model needs a production path, and to AI Model Monitoring when live traffic has to stay visible.",
  ],
  challengesIntro:
    "Most teams that end up looking into this have run into some combination of:",
  challenges: [
    {
      tag: "Cost",
      title: "GPU bills spike with no explanation",
      body: "Spend climbs, and nobody can point to which job, team, or model is actually using the compute.",
    },
    {
      tag: "Scale",
      title: "App infrastructure buckles under AI load",
      body: "What worked for normal traffic cannot hold a training run or production inference.",
    },
    {
      tag: "Ad hoc",
      title: "Every team builds its own stack",
      body: "No shared standard. Troubleshooting becomes archaeology.",
    },
    {
      tag: "Launch",
      title: "A live feature exposes limits nobody planned for",
      body: "The prototype ran fine. Customers did not.",
    },
    {
      tag: "Skills",
      title: "IT knows infra — not GPU-scale AI",
      body: "Deep general infrastructure experience does not automatically include AI architecture.",
    },
  ],
  definition: [
    "AI infrastructure is the combination of hardware, software, and networking needed to develop, train, deploy, and operate AI models at scale — GPU or TPU compute, storage built for high-throughput data pipelines, and orchestration that ties training, inference, and monitoring together into one working system.",
    "It is meaningfully different from general IT infrastructure mainly because of compute intensity: a single model training run can demand far more concentrated processing power than typical application workloads ever ask for.",
    "The infrastructure underneath has to be built with that in mind from the start, not bolted on after the fact.",
  ],
  benefits: [
    [
      "GPU cost that tracks usage",
      "Spend is visible and explainable instead of an unexplained line item every month.",
    ],
    [
      "Infrastructure that holds in production",
      "The stack scales with real demand once an AI feature moves from prototype to something customers depend on.",
    ],
    [
      "One standard instead of five snowflakes",
      "Teams stop rebuilding the same GPU provisioning and orchestration independently.",
    ],
    [
      "Less time fighting the platform",
      "Purpose-built for AI workloads, so people spend time training and deploying models.",
    ],
  ],
  deliverIncluded: [
    "GPU compute provisioning and management, across cloud, on-premises, or hybrid environments",
    "Storage and data pipeline architecture built for high-throughput AI workloads",
    "Orchestration connecting training, inference, and monitoring into one coherent system",
    "Cost optimization and usage tracking, so GPU spend is visible and explainable",
    "Infrastructure standardization across teams, replacing ad hoc, one-off setups",
    "Support for both model training infrastructure and production inference infrastructure",
  ],
  deliverExcluded: [
    "Model development itself — building the actual ML models or AI features (see AI Development Services)",
    "General, non-AI-specific IT infrastructure management — this service is the AI-workload layer",
    "Ongoing application-level software development beyond the infrastructure layer",
  ],
  techRows: [
    {
      layer: "GPU cloud providers",
      role: "Raw compute for training and inference",
      useCase: "AWS, Google Cloud, Azure, and specialized GPU clouds when you do not want to own hardware",
      benefit: "Scale up or down without capital investment in physical GPUs",
    },
    {
      layer: "On-premises and hybrid",
      role: "Dedicated hardware for residency or cost-at-scale",
      useCase: "Regulated industries or very high, predictable compute demand",
      benefit: "Control over data location and long-term cost predictability",
    },
    {
      layer: "Orchestration platforms",
      role: "Coordinate jobs, serving, and resource allocation",
      useCase: "Kubernetes-based AI infrastructure across multiple models and teams",
      benefit: "Repeatable infrastructure instead of one-off setups per team",
    },
    {
      layer: "High-throughput storage and pipelines",
      role: "Keep GPUs fed with data",
      useCase: "Large-scale training where I/O is the bottleneck",
      benefit: "GPUs spend time computing, not waiting on data",
    },
    {
      layer: "Cost monitoring and optimization",
      role: "Track GPU utilization and spend",
      useCase: "Controlling AI infrastructure costs at scale",
      benefit: "Clear visibility into where compute spend actually goes",
    },
  ],
  techNote:
    "Cloud, on-premises, or hybrid is chosen for residency, cost shape, and how fast demand might change — not whichever GPU cloud is easiest to sell.",
  industries: [
    {
      label: "Financial services",
      body: "Risk modeling and fraud detection workloads, with the audit and access controls regulated environments require.",
    },
    {
      label: "Healthcare",
      body: "Clinical AI workloads with strict data handling and residency requirements.",
    },
    {
      label: "Technology & SaaS",
      body: "Production-grade infrastructure for AI features that have to scale with real user demand.",
    },
    {
      label: "Retail & e-commerce",
      body: "Personalization and forecasting models that need to run continuously at high volume.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Understand current infrastructure, AI workload types, and where the real bottlenecks are.",
    },
    {
      title: "Assessment",
      desc: "Evaluate compute needs, data pipeline requirements, and cloud vs. on-premises tradeoffs.",
    },
    {
      title: "Design",
      desc: "Architect the infrastructure layer, including GPU provisioning strategy and orchestration.",
    },
    {
      title: "Development",
      desc: "Build out the infrastructure, storage, and orchestration components.",
    },
    {
      title: "Integration",
      desc: "Connect the infrastructure to existing systems and AI/ML workflows.",
    },
    {
      title: "Testing",
      desc: "Validate performance and cost under realistic training and inference loads.",
    },
    {
      title: "Deployment",
      desc: "Roll out to production, starting with the highest-priority workload.",
    },
    {
      title: "Optimization",
      desc: "Tune for cost and performance as usage patterns become clear.",
    },
  ],
  architecture: [
    { role: "Workload", nodes: ["Training job", "Inference request"] },
    { role: "Orchestration", nodes: ["Scheduler", "Resource allocation"] },
    {
      role: "Layer",
      nodes: ["GPU / TPU compute", "High-throughput storage", "Cost tracking"],
    },
    { role: "Where it runs", nodes: ["Cloud", "On-premises", "Hybrid"] },
    { role: "Outcome", nodes: ["Trained model", "Live inference", "Usage report"] },
  ],
  architectureCaption:
    "Orchestration sits over GPU compute, storage, and cost tracking — whether that hardware lives in the cloud, on-premises, or both.",
  compliance: [
    {
      label: "Role-based access",
      desc: "Who can provision compute and who can see training data is controlled.",
    },
    {
      label: "Data residency",
      desc: "Options for regulated environments so data and compute stay where policy requires.",
    },
    {
      label: "Visibility",
      desc: "You can see where compute and data actually run — not a black box GPU bill.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Built for AI-scale demand",
      desc: "Not general IT infrastructure retrofitted after a model already exists.",
    },
    {
      idx: "02",
      title: "Cloud, on-prem, or hybrid",
      desc: "The recommendation fits residency, cost, and how fast your compute needs might change.",
    },
    {
      idx: "03",
      title: "Cost visibility, not just provisioning",
      desc: "We do not stand up GPUs and walk away from the bill.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "A growing SaaS company's AI feature worked fine in testing but started buckling under real production traffic — the general-purpose cloud infrastructure it launched on simply was not built for the inference demand a live customer base created.",
      "After rebuilding the infrastructure layer around proper GPU orchestration and a data pipeline designed for the actual throughput needed, the same feature handled production load reliably, and the team finally had visibility into where their GPU spend was going instead of an unexplained monthly bill.",
    ],
  },
  faqs: [
    {
      q: "What is AI infrastructure?",
      a: "AI infrastructure is the combination of hardware, software, and networking needed to develop, train, deploy, and operate AI models at scale, including GPU compute, high-throughput storage, and orchestration.",
    },
    {
      q: "How is AI infrastructure different from regular IT infrastructure?",
      a: "AI infrastructure is built for far more concentrated compute demands, particularly GPU-based processing for training and inference, which standard application-focused IT infrastructure typically isn't designed to handle efficiently.",
    },
    {
      q: "Should we build AI infrastructure on-premises or in the cloud?",
      a: "It depends on factors like data residency requirements, cost predictability at scale, and how quickly your compute needs might change; cloud offers flexibility, while on-premises can offer more control and predictable long-term costs for very high, steady demand.",
    },
    {
      q: "What is an AI infrastructure company?",
      a: "An AI infrastructure company is a provider that designs, builds, or manages the compute, storage, and orchestration systems organizations need to run AI workloads, ranging from GPU cloud providers to infrastructure consulting and engineering services.",
    },
    {
      q: "How much does AI infrastructure cost?",
      a: "Cost depends heavily on compute scale, whether you're using cloud or on-premises hardware, and workload type, but a well-designed infrastructure layer typically includes cost tracking so spend stays visible and explainable rather than unpredictable.",
    },
    {
      q: "What is GPU infrastructure, and why does AI need it specifically?",
      a: "GPU infrastructure refers to compute built around graphics processing units, which handle the parallel processing that AI model training and inference require far more efficiently than standard CPU-based infrastructure.",
    },
    {
      q: "Can existing infrastructure be adapted for AI workloads, or does it need to be rebuilt?",
      a: "It depends on scale — some existing infrastructure can be extended with GPU compute and better orchestration, while infrastructure genuinely built for traditional application workloads often needs a more substantial redesign to handle real AI-scale demand.",
    },
    {
      q: "What is the difference between infrastructure for training models versus running inference?",
      a: "Training typically requires intense, concentrated compute for a defined period, while inference needs infrastructure that can serve predictions reliably and efficiently on an ongoing basis, often with different cost and scaling considerations.",
    },
    {
      q: "Does AI infrastructure work differently for different industries?",
      a: "The core components are similar, but regulated industries like healthcare and financial services often need additional data residency, access control, and audit capabilities layered into the infrastructure.",
    },
    {
      q: "How do you control AI infrastructure costs at scale?",
      a: "Cost control usually comes from a combination of usage tracking and visibility, right-sizing compute for actual workload needs, and choosing the right mix of cloud versus on-premises resources for your specific usage pattern.",
    },
    {
      q: "What is orchestration in the context of AI infrastructure?",
      a: "Orchestration coordinates training jobs, inference serving, and resource allocation across the infrastructure, ensuring workloads run efficiently and infrastructure gets used consistently rather than through one-off, ad hoc setups.",
    },
    {
      q: "How long does it take to build out AI infrastructure?",
      a: "Timelines vary significantly based on scale and complexity, but a focused infrastructure build for one primary workload can often be operational within a few weeks to a couple months.",
    },
  ],
  queryVariants: [
    "AI infrastructure",
    "AI infrastructure company",
    "AI infrastructure services",
    "GPU infrastructure",
    "enterprise AI infrastructure",
    "AI compute infrastructure",
    "MLOps infrastructure",
    "GPU compute",
  ],
  internalLinks: [
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "AI Model Monitoring", href: PATH.monitor },
    { anchor: "AI Development Services", href: PATH.dev },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Model Deployment", href: PATH.deploy },
    { anchor: "AI Model Monitoring", href: PATH.monitor },
    { anchor: "AI Development Services", href: PATH.dev },
    { anchor: "AI SaaS Product Development", href: PATH.saas },
  ],
};
