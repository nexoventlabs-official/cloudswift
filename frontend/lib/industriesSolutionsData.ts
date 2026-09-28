/**
 * Structured data configuration for the Industries Two-Column Solution Layout & Avanade-Style Detail Template.
 * 
 * You can edit any image path, title, description, or link with a single line change below.
 */

export interface IndustrySolutionCard {
  id: string;
  title: string;
  description: string;
  image: string; // Easily swap this image path in one line
  href: string;  // Redirection destination
}

export interface IndustrySolutionData {
  id: string;
  industryName: string;
  image: string; // Representative image for the card grid landing view
  heroImage: string; // Full-width hero image for detail view
  revolutionHeading: string; // "Accelerate the [Industry] revolution"
  revolutionParagraphs: string[]; // 2-3 flowing paragraphs of domain context
  revolutionImage: string; // Supporting image beside the revolution text
  heading: string; // "Our [Industry] solutions"
  subHeading: string; // Subtitle / active theme
  subTopics: string[]; // Plain list of sub-topics
  cards: IndustrySolutionCard[]; // 3 capability cards
}

export const industriesTopBannerConfig = {
  image: "/images/cs/services/industries main.webp", // Single image for top banner
  badge: "ENTERPRISE ECOSYSTEMS",
  tagline: "Secure, industry-tailored cloud architecture & digital acceleration",
};

export const industriesSolutionsData: IndustrySolutionData[] = [
  {
    id: "manufacturing",
    industryName: "Manufacturing",
    image: "/images/cs/services/manufacturing.webp",
    heroImage: "/images/cs/services/manufacturing.webp",
    revolutionHeading: "Accelerate the manufacturing revolution",
    revolutionParagraphs: [
      "Modern manufacturers are navigating the convergence of IT and operational technology (OT) to build resilient, data-driven production ecosystems. CloudSwift empowers industrial leaders to modernize legacy shop-floor architectures into agile, connected cloud foundations across Azure, AWS, and GCP.",
      "By integrating real-time telemetry, predictive maintenance models, and Zero-Trust network segmentation, we minimize costly equipment downtime and protect critical production lines against ransomware and supply chain disruptions.",
      "Operations managers gain real-time visibility into inventory flows, production KPIs, and supply chain bottlenecks through unified Power BI and Dynamics 365 enterprise dashboards.",
    ],
    revolutionImage: "/images/cs/services/Manuf.webp",
    heading: "Our Manufacturing solutions",
    subHeading: "Modernize production, supply chain & industrial operations",
    subTopics: [
      "Plant-floor to cloud integration & OT/IT connectivity",
      "Industrial network segmentation & Zero Trust security",
      "Predictive maintenance & real-time asset monitoring",
      "AI-driven demand forecasting & supply chain visibility",
      "ERP modernization & cloud landing zones on Azure/AWS",
    ],
    cards: [
      {
        id: "mfg-1",
        title: "Plant-Floor to Cloud Integration",
        description: "Connect plant floor industrial systems to enterprise cloud platforms like Azure, AWS, and GCP with secure OT/IT network architecture for reduced downtime.",
        image: "/images/cs/services/PlantFloortoCloudIntegration- AI.webp",
        href: "/industries/manufacturing",
      },
      {
        id: "mfg-2",
        title: "Predictive Maintenance & Asset Telemetry",
        description: "Deploy IIoT analytics and real-time sensor pipelines to anticipate equipment failures before they occur and streamline maintenance schedules.",
        image: "/images/cs/services/predictive.webp",
        href: "/industries/manufacturing",
      },
      {
        id: "mfg-3",
        title: "Zero-Trust Industrial Cybersecurity",
        description: "Protect manufacturing operations from ransomware and supply chain threats with 24/7 SOC monitoring, micro-segmentation, and governed access.",
        image: "/images/cs/services/ZeroTrustIndustrialCybersecurity.webp",
        href: "/industries/manufacturing",
      },
    ],
  },
  {
    id: "healthcare",
    industryName: "Healthcare",
    image: "/images/cs/services/healthcare.webp",
    heroImage: "/images/cs/services/healthcare.webp",
    revolutionHeading: "Advance modern digital healthcare delivery",
    revolutionParagraphs: [
      "Healthcare providers and life sciences organizations must deliver personalized patient journeys while ensuring strict clinical compliance and absolute data confidentiality. CloudSwift architects HIPAA and DPDP-compliant cloud foundations that unite EHR platforms, telemetry devices, and care teams.",
      "Our clinical integration frameworks streamline communication across physicians, specialists, and patients through unified Microsoft 365 and telehealth collaboration suites, reducing administrative burnout.",
      "We safeguard electronic medical records with continuous Zero-Trust access governance and 24/7 SOC threat detection, mitigating ransomware risks and maintaining reliable patient care 24/7/365.",
    ],
    revolutionImage: "/images/cs/services/Healrhcareindustry.webp",
    heading: "Our Healthcare solutions",
    subHeading: "Digital health foundations & secure patient experiences",
    subTopics: [
      "HIPAA & DPDP compliant clinical cloud infrastructure",
      "EHR & patient data platforms with governed integration",
      "Care coordination & telehealth communication tools",
      "AI-assisted clinical decision support & medical imaging",
      "Hospital cybersecurity & 24/7 ransomware mitigation",
    ],
    cards: [
      {
        id: "health-1",
        title: "Compliant Patient Data Platforms",
        description: "Architect secure, interoperable health data environments compliant with HIPAA, DPDP, and global healthcare privacy frameworks.",
        image: "/images/cs/services/CompliantPatientDataPlatforms-Healthcare.webp",
        href: "/industries/healthcare",
      },
      {
        id: "health-2",
        title: "Care Coordination & Telehealth",
        description: "Enhance physician and patient collaboration with unified Microsoft 365, Teams for Health, and remote care coordination platforms.",
        image: "/images/cs/services/care.webp",
        href: "/industries/healthcare",
      },
      {
        id: "health-3",
        title: "Clinical AI & Diagnostic Assistance",
        description: "Implement responsible AI workflows for diagnostic assistance, automated documentation, and operational bed-management analytics.",
        image: "/images/cs/services/clinicalai.webp",
        href: "/industries/healthcare",
      },
    ],
  },
  {
    id: "banking",
    industryName: "Banking",
    image: "/images/cs/services/banking.webp",
    heroImage: "/images/cs/services/banking.webp",
    revolutionHeading: "Strengthen banking resilience and financial innovation",
    revolutionParagraphs: [
      "Financial institutions operate in a hyper-regulated environment demanding 99.97% uptime, zero transaction loss, and airtight compliance with RBI, DPDP, and CERT-In mandates. CloudSwift engineers secure hybrid cloud landing zones designed specifically for high-throughput banking workloads.",
      "We integrate real-time fraud monitoring, predictive risk modeling, and automated credit scoring systems that process millions of transactions per second with minimal latency.",
      "Through Zero-Trust identity governance, privileged access management, and automated immutable audit logging, financial institutions retain total regulatory readiness across all banking channels.",
    ],
    revolutionImage: "/images/cs/services/Bankingindustry.webp",
    heading: "Our Banking solutions",
    subHeading: "Strengthen digital banking, data operations & risk controls",
    subTopics: [
      "Core banking platforms & hybrid cloud landing zones",
      "RBI, DPDP & CERT-In regulatory compliance frameworks",
      "Real-time fraud detection & AI credit risk modeling",
      "Zero-Trust identity governance & multi-factor protection",
      "Dynamics 365 finance & Power BI executive reporting",
    ],
    cards: [
      {
        id: "bank-1",
        title: "Regulatory-Aligned Cloud Landing Zones",
        description: "Deploy secure hybrid cloud environments engineered to satisfy stringent RBI, DPDP, and international banking compliance norms on a 99.97% uptime SLA.",
        image: "/images/cs/services/RegulatoryAlignedCloudLandingZones-Bank.webp",
        href: "/industries/banking",
      },
      {
        id: "bank-2",
        title: "Fraud Detection & Risk Modeling",
        description: "Harness machine learning models for real-time transaction monitoring, behavioral fraud detection, and automated credit scoring.",
        image: "/images/cs/services/FraudDetection&RiskModeling-Bank.webp",
        href: "/industries/banking",
      },
      {
        id: "bank-3",
        title: "Zero-Trust Financial Governance",
        description: "Safeguard transactions and customer records with privileged identity management, network micro-segmentation, and immutable audit logs.",
        image: "/images/cs/services/zerotrustfinancialgovernance- Bank.webp",
        href: "/industries/banking",
      },
    ],
  },
  {
    id: "retail",
    industryName: "Retail",
    image: "/images/cs/services/retailindustry.webp",
    heroImage: "/images/cs/services/retailindustry.webp",
    revolutionHeading: "Unify omnichannel retail and commerce agility",
    revolutionParagraphs: [
      "Modern retail success hinges on seamless customer journeys across physical stores, e-commerce storefronts, and decentralized supply chains. CloudSwift delivers auto-scaling cloud architectures engineered to handle massive seasonal traffic surges without performance degradation.",
      "We consolidate point-of-sale (POS), CRM, and warehouse inventory data into unified cloud data lakes, enabling automated demand forecasting, real-time stock replenishment, and personalized customer recommendations.",
      "Customer payment data and storefront endpoints are secured under strict PCI-DSS standards with end-to-end encryption, fraud mitigation, and continuous threat monitoring.",
    ],
    revolutionImage: "/images/cs/services/retail.webp",
    heading: "Our Retail solutions",
    subHeading: "Unify omnichannel commerce, customers & supply chains",
    subTopics: [
      "Omnichannel POS, e-commerce & CRM data unification",
      "PCI DSS compliant payment processing cloud foundations",
      "Real-time inventory optimization & demand forecasting",
      "Conversational AI shopping assistants & customer chat",
      "Dynamics 365 & Power BI retail analytics dashboards",
    ],
    cards: [
      {
        id: "retail-1",
        title: "Unified Omnichannel Architecture",
        description: "Consolidate point-of-sale, e-commerce stores, and customer relationship data into a synchronized cloud ecosystem built for high peak seasonal traffic.",
        image: "/images/cs/services/UnifiedOmnichannelArchitecture-Retail.webp",
        href: "/industries/retail",
      },
      {
        id: "retail-2",
        title: "Demand Forecasting & Inventory AI",
        description: "Predict consumer demand trends, automate replenishment triggers, and minimize stockouts across multi-location distribution networks.",
        image: "/images/cs/services/DemandForecasting&InventoryAI.webp",
        href: "/industries/retail",
      },
      {
        id: "retail-3",
        title: "PCI-DSS Compliant Security",
        description: "Protect customer payment credentials and store endpoints with hardened encryption, continuous vulnerability monitoring, and fraud prevention.",
        image: "/images/cs/services/PCI-DSS.webp",
        href: "/industries/retail",
      },
    ],
  },
  {
    id: "insurance",
    industryName: "Insurance",
    image: "/images/cs/services/insurance.webp",
    heroImage: "/images/cs/services/insurance.webp",
    revolutionHeading: "Modernize insurance underwriting and claims agility",
    revolutionParagraphs: [
      "Insurers are modernizing legacy core policy engines to accelerate claims settlement, improve risk pricing accuracy, and deliver intuitive digital customer portals. CloudSwift migrates legacy mainframe and on-premise systems to modern, scalable Azure and AWS architectures.",
      "We implement intelligent document processing and AI-driven underwriting tools that analyze policyholder data rapidly, expediting claim approvals and identifying fraudulent submissions in real time.",
      "Through comprehensive data governance and DPDP compliance frameworks, policyholder records remain secure, encrypted, and audit-ready at all times.",
    ],
    revolutionImage: "/images/cs/services/Insuranceindustry.webp",
    heading: "Our Insurance solutions",
    subHeading: "Modernize policy, claims & underwriting journeys",
    subTopics: [
      "Cloud policy administration & digital claims processing",
      "Automated underwriting & AI-driven risk scoring",
      "DPDP & regulatory compliance data architectures",
      "Policyholder self-service portals & conversational AI",
      "Legacy mainframe modernization to Azure & AWS",
    ],
    cards: [
      {
        id: "ins-1",
        title: "Digital Claims Processing & Automation",
        description: "Accelerate claim lifecycle workflows with intelligent document processing, optical character recognition, and automated payout verification.",
        image: "/images/cs/services/digitalclaim.webp",
        href: "/industries/insurance",
      },
      {
        id: "ins-2",
        title: "AI Underwriting & Risk Assessment",
        description: "Leverage predictive models and Power BI analytics to price policies dynamically and evaluate portfolio risk exposures with greater accuracy.",
        image: "/images/cs/services/aiunder.webp",
        href: "/industries/insurance",
      },
      {
        id: "ins-3",
        title: "Policyholder Data Governance",
        description: "Ensure full DPDP and insurance data regulation adherence through end-to-end data encryption, access governance, and SOC monitoring.",
        image: "/images/cs/services/security.webp",
        href: "/industries/insurance",
      },
    ],
  },
  {
    id: "education",
    industryName: "Education",
    image: "/images/cs/services/education.webp",
    heroImage: "/images/cs/services/education.webp",
    revolutionHeading: "Empower connected learning and campus agility",
    revolutionParagraphs: [
      "Educational institutions require agile digital campuses that support seamless hybrid learning, collaborative classrooms, and secure administration. CloudSwift deploys cloud-managed learning management systems (LMS) and Microsoft 365 Education platforms.",
      "We safeguard sensitive student records and staff credentials against phishing and ransomware with cloud-native identity management (Entra ID) and conditional access policies.",
      "Cost-effective automation and AI tools streamline administrative workflows, student onboarding, and outcome tracking without increasing institutional overhead.",
    ],
    revolutionImage: "/images/cs/services/Educationindustry.webp",
    heading: "Our Education solutions",
    subHeading: "Create agile digital learning & campus administration platforms",
    subTopics: [
      "Cloud-managed learning management systems (LMS)",
      "Microsoft 365 Education & Teams campus collaboration",
      "Student information system (SIS) security & data protection",
      "Adaptive learning tools & automated grading workflows",
      "Campus network segmentation & anti-phishing defense",
    ],
    cards: [
      {
        id: "edu-1",
        title: "Hybrid Learning & Campus Collaboration",
        description: "Implement secure Microsoft 365 Education and Teams platforms to support interactive remote classrooms and seamless faculty collaboration.",
        image: "/images/cs/services/HybridLearning&CampusCollaboration-Edu.webp",
        href: "/industries/education",
      },
      {
        id: "edu-2",
        title: "Student Identity & Access Governance",
        description: "Safeguard student and staff records without administrative overhead using cloud-native identity management and conditional access.",
        image: "/images/cs/services/student.webp",
        href: "/industries/education",
      },
      {
        id: "edu-3",
        title: "Adaptive Learning & Administrative AI",
        description: "Automate administrative paperwork and utilize cost-effective AI solutions to track learning outcomes and support educator productivity.",
        image: "/images/cs/services/adaptive.webp",
        href: "/industries/education",
      },
    ],
  },
  {
    id: "non-profit",
    industryName: "Non-Profit",
    image: "/images/cs/services/none-profit.webp",
    heroImage: "/images/cs/services/none-profit.webp",
    revolutionHeading: "Maximize nonprofit impact and donor trust",
    revolutionParagraphs: [
      "Mission-driven organizations and NGOs require cost-effective, scalable technology platforms that optimize grant funding and protect donor data. CloudSwift configures nonprofit-licensed Microsoft 365 and cloud CRM solutions tailored to nonprofit budgets.",
      "Our managed services relieve lean in-house teams from day-to-day infrastructure maintenance, providing reliable cloud operations that scale dynamically with fundraising campaigns.",
      "We implement robust security controls that safeguard donor financial information and ensure compliance with global data protection standards.",
    ],
    revolutionImage: "/images/cs/services/NGOimage.webp",
    heading: "Our Non-profit solutions",
    subHeading: "Efficient operations, trusted donor data & high community impact",
    subTopics: [
      "Donor and constituent relationship management (CRM)",
      "Grant-aligned, cost-efficient cloud foundations",
      "Program tracking, impact measurement & Power BI reporting",
      "Microsoft 365 non-profit licensing & governance",
      "Managed IT operations for lean in-house teams",
    ],
    cards: [
      {
        id: "np-1",
        title: "Donor & Constituent Management",
        description: "Centralize donor relationships, volunteer communications, and grant tracking with tailored non-profit Microsoft 365 and CRM platforms.",
        image: "/images/cs/services/donor.webp",
        href: "/industries/non-profit",
      },
      {
        id: "np-2",
        title: "Grant-Aligned Cloud Infrastructure",
        description: "Scale cloud infrastructure dynamically around fundraising campaigns and grant cycles while keeping operational costs tightly controlled.",
        image: "/images/cs/services/Grant-Aligned Cloud Infrastructure.webp",
        href: "/industries/non-profit",
      },
      {
        id: "np-3",
        title: "Managed IT & Donor Data Security",
        description: "Relieve in-house teams from daily infrastructure concerns while protecting sensitive donor financial records with enterprise-grade security.",
        image: "/images/cs/services/managedit.webp",
        href: "/industries/non-profit",
      },
    ],
  },
  {
    id: "security",
    industryName: "Security",
    image: "/images/cs/services/Security controls evaluation (1).webp",
    heroImage: "/images/cs/services/Security controls evaluation (1).webp",
    revolutionHeading: "Fortify cyber defense and continuous compliance",
    revolutionParagraphs: [
      "Enterprises face sophisticated multi-vector cyber threats requiring Zero-Trust security postures, proactive vulnerability management, and 24/7 security operations. CloudSwift designs tailored cybersecurity architectures aligned with SOC 2, ISO 27001, CERT-In, and DPDP.",
      "Our dedicated Security Operations Center (SOC) provides continuous threat hunting, SIEM/SOAR automation, and guaranteed 15-minute response times for critical security incidents.",
      "We govern identities across multi-cloud environments through unified Entra ID, Multi-Factor Authentication (MFA), and least-privilege conditional access policies.",
    ],
    revolutionImage: "/images/cs/services/secure.webp",
    heading: "Our Security solutions",
    subHeading: "Enterprise Zero-Trust architecture, monitoring & threat response",
    subTopics: [
      "Zero-Trust security architecture & Entra ID IAM governance",
      "24/7 threat detection & 15-minute critical incident response",
      "Vulnerability management & penetration testing assessments",
      "SOC 2 Type II, ISO 27001, CERT-In & DPDP audit advisory",
      "Managed Cloud & Hybrid Infrastructure Security (SIEM/SOAR)",
    ],
    cards: [
      {
        id: "sec-1",
        title: "24/7 SOC Threat Monitoring & Response",
        description: "Continuous real-time threat hunting and incident response with a guaranteed 15-minute response SLA for critical security anomalies.",
        image: "/images/cs/services/soc.webp",
        href: "/industries/security",
      },
      {
        id: "sec-2",
        title: "Zero-Trust Identity & Access Architecture",
        description: "Implement unified Entra ID, Multi-Factor Authentication, and least-privilege conditional access across multi-cloud environments.",
        image: "/images/cs/services/Zerotrustsecurity 1.webp",
        href: "/industries/security",
      },
      {
        id: "sec-3",
        title: "Compliance & Security Posture Assessment",
        description: "Attain and sustain SOC 2 Type II, ISO 27001, and CERT-In certifications with proactive gap analysis and automated compliance monitoring.",
        image: "/images/cs/services/compliance.webp",
        href: "/industries/security",
      },
    ],
  },
];

export function findIndustrySolution(id: string): IndustrySolutionData | undefined {
  return industriesSolutionsData.find((item) => item.id === id);
}
