import type { OfferingItem } from "@/lib/catalog";

export type Industry = OfferingItem & {
  overview: string[];
  solutionsIntro: string;
};

const genericOverview = (name: string) => [
  `${name} organizations are balancing customer expectations, operational resilience, and the need to modernize responsibly. CloudSwift helps teams turn complex technology estates into secure, measurable platforms for growth.`,
  `We bring together cloud, data, applications, and managed services to address the practical constraints of the sector. Our approach is designed to improve visibility, reduce friction, and create a foundation for continuous change.`,
];

const genericSolutions = (name: string) => [
  `${name} cloud and application modernization`,
  "Data platforms, reporting, and intelligent automation",
  "Security, governance, and compliance foundations",
  "Managed operations and continuous improvement",
];

const industryImages: Record<string, string> = {
  banking: "/images/cs/services/banking.webp",
  education: "/images/cs/services/education.webp",
  healthcare: "/images/cs/services/healthcare.webp",
  insurance: "/images/cs/services/insurance.webp",
  manufacturing: "/images/cs/services/manufacturing.webp",
  "non-profit": "/images/cs/services/none-profit.webp",
  retail: "/images/cs/services/retailindustry.webp",
  security: "/images/cs/services/security.webp",
};

const industry = (
  id: string,
  title: string,
  desc: string,
  overview = genericOverview(title),
  solutions = genericSolutions(title),
  solutionsIntro = "A practical set of capabilities to help your organization modernize with confidence."
): Industry => ({
  id,
  title,
  desc,
  detailedContent: desc,
  image: industryImages[id] || "",
  tags: ["Industry"],
  capabilities: solutions,
  steps: [],
  overview,
  solutionsIntro,
});

export const industries: Industry[] = [
  industry(
    "manufacturing",
    "Manufacturing",
    "Modernize production, supply chain, and workforce operations with connected, resilient technology platforms.",
    [
      "Modernization of legacy IT/OT ecosystem through cloud migrations, hybrid infrastructure development, and proper network architecture. The plant floor ecosystem is connected with enterprise-level cloud platforms like Azure, AWS, GCP for better visibility, lesser downtime, and predictive maintenance using analytics.",
      "Industrial networks are protected from ransomware and supply chain attacks using continuous monitoring and zero trust access control protocols. Power BI and Dynamics 365 integrations provide operations managers with real-time dashboards for their manufacturing, inventory, and supply chain performance.",
    ],
    [
      "Plant-floor to cloud integration with secure OT/IT connectivity and industrial network segmentation",
      "Compliance-ready, scalable cloud foundations for industrial workloads and manufacturing ERP systems",
      "Predictive maintenance, asset monitoring, and end-to-end supply chain visibility",
      "Production analytics, industrial automation, and AI-driven demand forecasting",
    ],
    "Solutions related to technology for connectivity, security of OT networks, and IIoT."
  ),
  industry(
    "healthcare",
    "Healthcare",
    "Build secure digital experiences and connected systems that help care teams coordinate better outcomes.",
    [
      "Infrastructure security in hospitals, health care networks and health technology companies that process patients' data, EHRs and clinical apps. HIPAA compliant and DPDP in India cloud infrastructure with controlled access and encryption and implementation of Microsoft 365 and Power BI.",
      "Clinical decision support, diagnostic imaging assistance, and operational analytics driven by AI are complemented by security measures designed to mitigate ransomware and breach-related threats that particularly threaten healthcare.",
    ],
    [
      "Patient data platforms with secure integration and governed access",
      "Compliance-ready cloud foundations for clinical workloads",
      "Care coordination and referral management experiences",
      "Telehealth, patient engagement, and intelligent automation",
    ],
    "Technology solutions for safer data exchange, more coordinated care, and accessible patient experiences."
  ),
  industry(
    "education",
    "Education",
    "Create flexible learning and administration platforms that connect students, educators, and institutions.",
    [
      "Effective IT infrastructure solutions for learning institutions that support remote learning, safeguarding of student information, and collaboration within campus. Implementation of Microsoft 365 and Teams for Education packages, cloud-managed learning management systems, and identity governance solution to protect student and staff data without additional administrative overhead.",
      "Security features protect against phishing and ransomware attacks that are prevalent in the education sector, whereas AI solutions provide adaptive learning, automation, and monitoring of results at costs appropriate for education institutions.",
    ],
    [
      "Learning management platforms with secure identity and governed student access",
      "Compliance-ready cloud foundations for student information systems and staff data protection",
      "Campus collaboration tools and hybrid/remote learning experiences",
      "Adaptive learning technology and administrative process automation",
    ],
    "Educational Technology solutions for safe learning spaces and campus connections."
  ),
  industry(
    "banking",
    "Banking",
    "Strengthen digital banking experiences, data operations, and risk controls across a changing financial landscape.",
    [
      "Consultancy, migration and cybersecurity services for banks and other financial organizations that operate under regulatory compliance constraints. Implementation of landing zones and hybrid cloud environments to satisfy RBI, DPDP and CERT-In compliance norms, along with implementation of core banking solutions and Dynamics 365 finance on a 99.97% uptime SLA basis.",
      "Fraud detection, transactions monitoring, identity governance, and network segmentation based on Zero Trust architecture form the security layer of the platform, where AI helps with risk modeling, credit scoring, and customer support. Every deal relies on the audit trails and reporting that banks are obligated to produce.",
    ],
    [
      "Core banking platforms with secure system integration and governed access control",
      "Compliance-ready cloud foundations aligned to RBI, DPDP, and CERT-In regulations",
      "Real-time fraud detection and transaction monitoring experiences.",
      "Risk modeling, AI-driven credit scoring, and financial service automation",
    ],
    "Financial technology for regulatory compliance and transaction security."
  ),
  industry(
    "retail",
    "Retail",
    "Unify customer, commerce, and supply chain experiences with scalable platforms built for constant change.",
    [
      "Cloud-based technology solution for retail and ecommerce brands to handle seasonal traffic, ensure secure storage of customers’ payments, and consolidate all data within POS, ecommerce, and CRM platforms. Architecture consultation of omnichannel technology, Dynamics 365 and Power BI deployment for analysis of inventory and customer data help retailers stay ahead of the seasonality of sales.",
      "The distributed stores are protected with the PCI-DSS compliant controls, fraud detection, and endpoint protection, whereas demand forecasting based on AI, personalized services, and chatbots for customer service complete the package.",
    ],
    [
        "Omnichannel commerce platforms with unified POS, e-commerce, and CRM data integration",
        "PCI DSS-aligned cloud foundations for secure payment processing and customer data management",
        "Inventory optimization, demand forecasting, and customer behavior analytics",
        "AI-driven personalization, conversational chat support, and in-store automation"
    ],
    "Technological solutions to achieve unified commerce and customer experience personalization."
  ),
  industry(
    "non-profit",
    "Non-Profit",
    "Help mission-led organizations make more impact through efficient operations, trusted data, and accessible services.",
    [
      "Cloud, security, and productivity solutions built specifically for non-profits and NGOs, tailored to non-profit budgeting needs. Microsoft 365 non-profit licensing, protection of donor/constituent data, and scalable cloud systems based on grant cycles.",
      "Our managed services relieve small or non-existent IT teams from daily infrastructure concerns, while our security services protect donor data and financial systems from fraud.",
    ],
    [
        "Donor and constituent relationship management (CRM) platforms with governed data access",
        "Cost-efficient, grant-aligned cloud foundations sized to nonprofit funding cycles",
        "Program tracking, outcome measurement, and impact reporting experiences",
        "Automation and AI tools built for small or non-existent in-house IT teams"
    ],
    "Nonprofit technological tools for efficient processes and meaningful outcomes."
  ),
  industry(
    "insurance",
    "Insurance",
    "Modernize policy, claims, and customer journeys while improving insight, governance, and operational agility.",
    [
      "Cloud computing and consulting services for insurance companies providing policy administration systems, claims processing systems, and customer portal. Migrating legacy system in Microsoft Azure or AWS, Dynamics 365 and Power BI for underwriting and claims analysis, and DPDP compliant data processing.",
      "The combination of automated claims processing, fraud detection and risk management through AI is complemented by managed security services, which safeguard policyholder information through monitoring, encryption and incident response, all at a rate that allows for legacy system integration.",
    ],
    [
        "Policy administration platforms with secure integration and governed data access",
        "Compliance-ready cloud foundations for policyholder data protection and regulatory reporting",
        "Digital claims processing and automated underwriting experiences",
        "AI-driven fraud detection, risk assessment, and predictive underwriting automation"
    ],
    "InsurTech solutions to make claims and underwriting more efficient."
  ),
  industry(
    "security",
    "Security",
    "Build a stronger security posture with connected monitoring, identity, response, and resilience capabilities.",
    [
      "Specialized services in security consulting, security operations, and compliance services for those who need it. Design of Zero Trust architecture, identity and access management (Entra ID, MFA, Conditional Access), SOC-based 24/7 threat detection and incident response with a 15-minute critical-response SLA.",
      "Type II SOC 2 and ISO 27001 provide security framework that is consistent with the framework of CERT-In and DPDP for secure audit and minimization of risk, irrespective of hybrid cloud or multi-cloud infrastructure, from an initial security assessment to comprehensive security operations center.",
    ],
    [
        "Zero-Trust security architecture with governed identity and access management (IAM)",  
        "24/7 threat monitoring, detection, and incident response services",
        "Vulnerability management, penetration testing, and security posture assessments",
        "Compliance advisory and audit support for SOC 2, ISO 27001, CERT-In, and DPDP frameworks"
    ],
    "Solutions to protect against cyber threats and maintain compliance."
  ),
];

export function findIndustry(slug: string) {
  return industries.find((item) => item.id === slug);
}