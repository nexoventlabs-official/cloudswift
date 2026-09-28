/**
 * CloudSwift site content for the Nyro template.
 * Full catalogs live in catalog.json (imported via catalog.ts).
 */

import {
  catalogSolutions,
  catalogTestimonials,
  catalogTeam,
  catalogServices,
  catalogManagedCloud,
  catalogAiServices,
  allServiceItems,
  allManagedItems,
  allAiItems,
} from "./catalog";

export const company = {
  name: "CloudSwift",
  legalName: "CloudSwift Technologies Pvt. Ltd.",
  shortName: "CloudSwift",
  tagline: "Stop Wasting Cloud Spend. Start Scaling Securely.",
  eyebrow: "Strategic IT Transformation",
  description:
    "CloudSwift is a Bengaluru-based Azure Expert MSP delivering cloud migration, Dynamics 365, Microsoft 365 managed services, and AI rollouts for 450+ enterprise clients across India, the Gulf, and the US.",
  about:
    "Founded in 2023 and headquartered in Bengaluru, CloudSwift Technologies designs, migrates, secures, and operates enterprise cloud estates for 450+ clients across India, the UAE, and the US — with a 99.97% uptime SLA and 15-minute critical response.",
  intro:
    "At CloudSwift© we architect, secure, and operate enterprise digital infrastructure so you can focus on growth — not IT headaches.",
  bio: "Founded in 2023, we help enterprises across India, the Gulf, and the US migrate, secure, and run cloud estates — Azure, AWS, GCP, Oracle, Microsoft 365, Dynamics 365, and AI — under one SLA.",
  founded: "2023",
  hq: "Bengaluru, India",
  email: "hello.in@oncloudswift.com",
  enquiryEmail: "enquiry.in@oncloudswift.com",
  emailUs: "sales.us@oncloudswift.co",
  emailUsHello: "hello.us@oncloudswift.co",
  phone: "+91 98455 70066",
  phoneAlt: "+91 91487 06809",
  phoneUs: "+1 (330) 516-7590",
  whatsapp: "https://wa.me/919148706809",
  calendly: "https://calendly.com/havil-richard-oncloudswift/30min",
  website: "https://oncloudswift.com",
  address: "Bengaluru, India",
  addressMumbai: "Mumbai, India",
  addressUs: "Lewes, Delaware, USA",
  socials: {
    linkedin:
      "https://www.linkedin.com/company/cloudswift-technologies-pvt-ltd",
    twitter: "https://x.com/CloudSwiftTech",
    instagram: "https://www.instagram.com/cloudswift_technologies/",
    youtube: "https://www.youtube.com/@CloudSwiftTechnologies",
    github: "https://github.com/Cloudswift-Technologies-Pvt-Ltd",
  },
  trust: [
    "Azure Expert MSP",
    "Microsoft Solutions Partner",
    "AWS Partner",
    "Google Cloud Partner",
    "Oracle Cloud MSP",
    "ISO 27001",
    "SOC 2 Type II",
  ],
  logo: "/images/brand/logo.png",
  logoDark: "/images/brand/logo.png",
  icon: "/images/brand/cloud-icon.png",
};

const colors: Record<string, string> = {
  "microsoft-azure": "#0078D4",
  "microsoft-365": "#C43E1C",
  "dynamics-365": "#0B5CAB",
  "amazon-web-services": "#FF9900",
  "google-cloud-platform": "#4285F4",
  "power-bi": "#F2C811",
};

const capabilityIcons: Record<string, Record<string, string>> = {
  "amazon-web-services": {
    "EC2 & S3": "server",
    "Serverless (Lambda)": "infinity",
    "AWS Security": "shield-check",
    "Database Services": "database",
  },
  "google-cloud-platform": {
    "GKE (Kubernetes)": "container",
    BigQuery: "bar-chart-3",
    "AI/ML Services": "brain-circuit",
    "Cloud Run": "cloud",
  },
  "microsoft-azure": {
    "Virtual Machines & Scale Sets": "server",
    "Azure Kubernetes Service": "container",
    "Azure DevOps pipelines": "git-branch",
    "Security & Compliance Center": "shield-check",
  },
};

const ambientIcons: Record<string, string[]> = {
  "amazon-web-services": ["cloud", "server", "network", "database"],
  "google-cloud-platform": ["cloud", "bar-chart-3", "server", "globe"],
  "microsoft-azure": ["cloud", "server", "shield-check", "network"],
};

/** Solutions map into template project cards */
const aiServicesSolution = {
  id: "ai-services",
  title: "AI Services",
  desc: "Build practical AI systems that automate work, connect enterprise knowledge, and move machine learning into production.",
  tags: ["AI", "Automation", "Machine Learning"],
  capabilities: [
    "AI Readiness & Roadmaps",
    "Intelligent Agents",
    "Generative AI Workflows",
    "MLOps & Model Operations",
  ],
  capabilityDescs: {
    "AI Readiness & Roadmaps": "Assess opportunities, data readiness, governance, and the path from experimentation to measurable value.",
    "Intelligent Agents": "Design grounded agents that support customers, employees, and operational teams with the right guardrails.",
    "Generative AI Workflows": "Connect models to enterprise content and business systems to automate high-value workflows.",
    "MLOps & Model Operations": "Deploy, monitor, and improve models with repeatable production practices and responsible oversight.",
  },
  capabilityIcons: {
    "AI Readiness & Roadmaps": "gauge",
    "Intelligent Agents": "bot",
    "Generative AI Workflows": "workflow",
    "MLOps & Model Operations": "brain-circuit",
  },
  ambientIcons: ["brain-circuit", "sparkles", "workflow", "bot"],
  steps: ["Discover", "Design", "Build", "Operate"],
  stepDescs: {},
  logo: "/images/brand/cloud-icon.png",
  cover: "/images/cs/services/aiservice.webp",
};

export const projects = [...catalogSolutions, aiServicesSolution].map((s) => ({
  slug: s.id,
  title: s.title,
  category: s.tags[0] || "Solution",
  date: "2025",
  industry: s.tags.slice(0, 2).join(" / ") || "Enterprise",
  scopeOfWork: s.capabilities.slice(0, 3).join(", "),
  duration: "Ongoing",
  description: s.desc,
  challenge: s.desc,
  goal: `Deliver ${s.title} with clear governance, security, and measurable outcomes.`,
  solution: `${s.steps.join(" → ")}. Capabilities include ${s.capabilities.join(", ")}.`,
  capabilities: s.capabilities,
  capabilityDescs: s.capabilityDescs,
  capabilityIcons: capabilityIcons[s.id] ?? {},
  ambientIcons: ambientIcons[s.id] ?? [],
  steps: s.steps,
  stepDescs: s.stepDescs,
  coverImage: s.cover,
  logoImage: s.logo,
  logo: s.title,
  websiteUrl: `/solutions/${s.id}`,
  color: colors[s.id] || "#888888",
}));

/** Home services list — 4 hubs linking into full catalogs */
export const services = [
  {
    id: "01",
    title: "Enterprise Services",
    description: `${allServiceItems.length} services across applications, infrastructure, security, workplace, advisory, and transformation.`,
    href: "/services",
    tags: ["Applications", "Infrastructure", "Security"],
  },
  {
    id: "02",
    title: "Managed Cloud",
    description: `${allManagedItems.length} managed offerings — Azure, AWS, GCP, Microsoft 365, Oracle, private cloud, security, and data centre.`,
    href: "/managed-cloud",
    tags: ["Azure", "AWS", "GCP"],
  },
  {
    id: "03",
    title: "AI Services",
    description: `${allAiItems.length} AI services from readiness and agents to generative AI, product builds, and MLOps.`,
    href: "/ai-services",
    tags: ["Agents", "Generative AI", "MLOps"],
  },
  {
    id: "04",
    title: "Platform Solutions",
    description: `${catalogSolutions.length} enterprise platforms — Azure, AWS, GCP, Dynamics 365, Microsoft 365, and Power BI.`,
    href: "/solutions",
    tags: ["Microsoft 365", "Dynamics 365", "Power BI"],
  },
];

export const testimonials = catalogTestimonials.slice(0, 5).map((t, i) => ({
  id: String(i + 1),
  name: t.init,
  title: `${t.name}, ${t.role}`,
  quote: t.quote,
  date: i < 3 ? "2024" : "2025",
}));

export const faqs = [
  {
    id: "01",
    question: "What makes CloudSwift a trusted cloud partner?",
    answer:
      "CloudSwift Technologies is a recipient of the Microsoft Certified Azure Expert MSP accreditation, which is the highest level within the Microsoft partner network, held by less than 100 partners globally, along with experience with AWS and Google Cloud.",
  },
  {
    id: "02",
    question: "How quickly does CloudSwift respond to critical incidents?",
    answer:
      "Critical (P1) incidents receive an engineer response within 15 minutes, 24/7/365 — with a 99.97% uptime SLA and ~87% first-call resolution across 450+ enterprise clients.",
  },
  {
    id: "03",
    question: "What service catalogs do you offer?",
    answer: `We publish full catalogs for Enterprise Services (${allServiceItems.length}), Managed Cloud (${allManagedItems.length}), AI Services (${allAiItems.length}), and Solutions (${catalogSolutions.length}). Browse /services, /managed-cloud, /ai-services, and /solutions.`,
  },
  {
    id: "04",
    question: "Which regions does CloudSwift serve?",
    answer:
      "Headquartered in Bengaluru with offices in Mumbai and Delaware (US). We serve enterprises across India, the Middle East (Gulf), and North America.",
  },
];

export const stats = [
  { number: 450, label: "Enterprises We Support", showBadge: true },
  { number: 200, label: "Cloud Migrations Done", showBadge: true },
  { number: 15, label: "Min Critical Response", showBadge: true },
  { number: 87, label: "Percent First-Call Fix", showBadge: true },
];

export const team = catalogTeam;

export const blogCategories = [
  "Cloud Migration",
  "Azure",
  "Microsoft 365",
  "AI",
  "Security",
  "FinOps",
];

export {
  catalogServices,
  catalogManagedCloud,
  catalogAiServices,
  catalogSolutions,
};
