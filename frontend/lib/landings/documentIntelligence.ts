import type { AgentPage } from "@/lib/agentPages";
import { PATH } from "./paths";

export const documentIntelligencePage: AgentPage = {
  catalogId: "ai-doc-intelligence",
  path: PATH.docIntel,
  metaTitle: "Document Intelligence | Intelligent Document Processing",
  metaDescription:
    "Document intelligence that turns invoices, contracts, and forms into structured data automatically — platform-agnostic, not tied to any single vendor.",
  category: "Generative AI Solutions",
  title: "Document Intelligence",
  h1: "Document Intelligence That Turns Paperwork Into Structured Data, Automatically",
  overviewHeading: "How document intelligence turns paperwork into structured data",
  gtmEvent: "document_intelligence_page_view",
  crumbs: [
    { name: "Home", href: "/" },
    { name: "AI Services", href: "/ai-services" },
    { name: "Document Intelligence" },
  ],
  heroLede:
    "Invoices, contracts, and forms become structured data automatically — platform-agnostic, not locked to one cloud vendor.",
  heroCta: { label: "Talk to us about document intelligence", href: "/contact" },
  image: "/images/cs/ai-services/document-inteligence.webp",
  imageAlt:
    "Document intelligence illustration: invoices, contracts, and forms being classified and extracted into structured data",
  overview: [
    "Every business runs on documents. Invoices, contracts, claims forms, ID documents, applications — and somewhere along the line, most of that information still gets typed in by hand. Document intelligence, also known as intelligent document processing, is what changes that.",
    "It uses AI to read a document, work out what kind of document it actually is, pull the specific fields that matter, and double-check that what it extracted actually makes sense before any of it touches your systems of record.",
    "This is not locked to one cloud vendor's product. It is a platform-agnostic way of solving the same underlying problem, whatever tools end up doing the work underneath. Related work: AI Workflow Automation, Enterprise Chatbots, AI Model Deployment.",
  ],
  challengesIntro:
    "Most teams that start looking into this recognize the pattern immediately.",
  challenges: [
    {
      tag: "Manual",
      title: "Someone is still keying data from PDFs every day",
      body: "Scans, emailed forms, and attachments get retyped by hand.",
    },
    {
      tag: "Volume",
      title: "Document volume climbs while the team stays the same size",
      body: "The queue grows. Headcount does not.",
    },
    {
      tag: "Errors",
      title: "Manual entry means expensive mistakes",
      body: "A mispaid invoice or a misfiled claim shows up later, and it costs more than the keystroke.",
    },
    {
      tag: "Invisible",
      title: "Files sit unstructured and unsearchable",
      body: "The data inside is what the business needs — reporting cannot see it.",
    },
    {
      tag: "Bottleneck",
      title: "Close, claims, and review slip because of paperwork",
      body: "The bottleneck is the documents, not the people working through them.",
    },
  ],
  definition: [
    "Document intelligence is AI that automatically classifies, extracts, and validates data from documents — and it goes well past what basic OCR ever did.",
    "OCR just turns an image of text into machine-readable text; it has zero idea what it is actually looking at. Document AI and intelligent document processing take it further. They recognize the document type — an invoice versus a contract versus a claims form — pull out whichever fields matter for that type, and flag anything that looks off before anyone trusts it.",
    "That is the distinction people ask about most. OCR reads the page. Document intelligence understands it.",
  ],
  benefits: [
    [
      "Manual data entry mostly goes away",
      "Fields get pulled automatically instead of retyped one at a time.",
    ],
    [
      "Costly errors get caught earlier",
      "Automated validation flags mismatches before a mispayment or a compliance headache.",
    ],
    [
      "PDFs become searchable data",
      "Documents that used to be dead weight can actually be used by your systems.",
    ],
    [
      "Processing scales with volume",
      "You do not have to scale headcount in lockstep with document count.",
    ],
    [
      "Downstream work speeds up",
      "Invoice approvals, claims decisions, and contract reviews move once extraction is not the bottleneck.",
    ],
    [
      "There is a real audit trail",
      "Every extraction and validation step gets logged — more than manual entry ever did.",
    ],
  ],
  deliverIncluded: [
    "Document classification models tuned to your document types",
    "Field-level extraction across structured, semi-structured, and unstructured documents",
    "Automated validation rules that flag anomalies before bad data reaches your systems",
    "Integration with the ERP, CRM, or line-of-business system you already run",
    "Support for platform-native tools (Azure Document Intelligence, Google Document AI, AWS Textract) and open-source or custom extraction models",
    "Ongoing tuning as new document formats or edge cases show up",
  ],
  deliverExcluded: [
    "Building a custom OCR engine from scratch — this configures and extends existing extraction technology",
    "Downstream workflow automation beyond extraction and validation — see AI Workflow Automation",
    "Records management or document storage infrastructure",
  ],
  techRows: [
    {
      layer: "Cloud-native document AI",
      role: "Managed extraction and classification from major clouds",
      useCase: "Azure Document Intelligence, Google Document AI, AWS Textract",
      benefit: "Fast to stand up, models that keep improving",
    },
    {
      layer: "Specialist IDP platforms",
      role: "Purpose-built document processing, often with pre-trained types",
      useCase: "ABBYY, Rossum, Docsumo",
      benefit: "Deep specialization on document-specific extraction",
    },
    {
      layer: "RPA-integrated document processing",
      role: "Extraction folded into broader robotic process automation",
      useCase: "Teams already running UiPath or similar",
      benefit: "One platform for extraction and the resulting action",
    },
    {
      layer: "Open-source and custom models",
      role: "Fine-tuned models for non-standard document types",
      useCase: "Specialized documents off-the-shelf models handle poorly",
      benefit: "Control, and no per-document license cost at scale",
    },
    {
      layer: "Validation and business-rule engines",
      role: "Checks extracted data against expected patterns",
      useCase: "Catching errors before they reach downstream systems",
      benefit: "Turns “probably right” into data you can trust",
    },
  ],
  techNote:
    "The mix is chosen for your documents — cloud-native, specialist IDP, RPA, or custom — not whichever tool is easiest to sell.",
  industries: [
    {
      label: "Insurance",
      body: "Claims forms and policy documents at a volume and accuracy a manual team cannot keep up with.",
    },
    {
      label: "Financial services",
      body: "Invoices, loan applications, and KYC documents with a full audit trail.",
    },
    {
      label: "Legal",
      body: "Key terms and obligations pulled from contracts at scale during review or diligence.",
    },
    {
      label: "Healthcare",
      body: "Patient intake forms and records digitized without sacrificing the accuracy clinical use demands.",
    },
  ],
  steps: [
    {
      title: "Discovery",
      desc: "Find which document types cause the most manual work and where the real volume sits.",
    },
    {
      title: "Assessment",
      desc: "Look at document quality, format variability, and any extraction tooling already in place.",
    },
    {
      title: "Design",
      desc: "Pick the mix of platform-native and custom extraction models for your documents.",
    },
    {
      title: "Development",
      desc: "Build and train classification and extraction models against real document samples.",
    },
    {
      title: "Integration",
      desc: "Connect extracted, validated data to your ERP, CRM, or system of record.",
    },
    {
      title: "Testing",
      desc: "Validate extraction accuracy against a representative sample before anything goes live.",
    },
    {
      title: "Deployment",
      desc: "Roll out gradually, usually starting with the highest-volume document type.",
    },
    {
      title: "Optimization",
      desc: "Retrain as new formats and edge cases show up — because they always do.",
    },
  ],
  architecture: [
    { role: "Incoming", nodes: ["PDF", "Scan", "Image", "Email attachment"] },
    { role: "Pipeline", nodes: ["Document intelligence"] },
    {
      role: "Understand",
      nodes: ["Classification", "Field extraction", "Validation"],
    },
    { role: "Output", nodes: ["Structured data"] },
    { role: "Systems", nodes: ["ERP", "CRM", "Claims", "Contracts"] },
  ],
  architectureCaption:
    "Incoming documents are classified, extracted, and validated before structured data reaches your systems of record.",
  compliance: [
    {
      label: "Role-based access",
      desc: "Who can see sensitive document content is controlled.",
    },
    {
      label: "Audit logs",
      desc: "Every extraction and validation step is recorded.",
    },
    {
      label: "Retention",
      desc: "Configurable data retention aligned to your industry requirements.",
    },
    {
      label: "Human review",
      desc: "Extraction feeds a human-reviewed process. It does not replace the judgment call at the end. Named certifications are cited only where verified.",
    },
  ],
  why: [
    {
      idx: "01",
      title: "Platform-agnostic",
      desc: "You are not locked into one cloud vendor's document AI because that is where the project started.",
    },
    {
      idx: "02",
      title: "Validation, not just extraction",
      desc: "The data you get back is meant to be trustworthy, not just plausible-looking.",
    },
    {
      idx: "03",
      title: "The mix your documents need",
      desc: "Cloud-native, specialist, or custom models — chosen for the documents, not the easiest sale.",
    },
  ],
  example: {
    disclaimer:
      "This example is illustrative and does not represent a specific customer engagement.",
    body: [
      "An insurance company's claims team was manually keying data from hundreds of claims forms a week — the kind of process where a typo would quietly delay a payout or trigger a follow-up nobody needed.",
      "Once they deployed a document intelligence pipeline trained on their specific claims forms, most fields extracted themselves, and built-in validation caught the handful that needed a human look. Nobody stopped reviewing claims. They just stopped spending most of the day typing them in first.",
    ],
  },
  faqs: [
    {
      q: "What is document intelligence?",
      a: "Document intelligence is the use of AI to automatically classify, extract, and validate data from documents, turning unstructured content into structured, usable data.",
    },
    {
      q: "What is intelligent document processing?",
      a: "Intelligent document processing, often abbreviated IDP, is essentially the same concept as document intelligence, using AI to read, classify, and extract data from documents automatically.",
    },
    {
      q: "What's the difference between intelligent document processing and automated document processing?",
      a: "Automated document processing is the broader umbrella including rule-based systems; intelligent document processing specifically uses AI to classify and understand documents, handling variation far better than fixed-rule automation.",
    },
    {
      q: "What are the challenges of implementing intelligent document processing?",
      a: "Common challenges include handling variable or poor-quality documents, achieving trustworthy extraction accuracy, integrating with legacy systems, and the upfront work of training models against specific document types.",
    },
    {
      q: "What's the difference between OCR and intelligent document processing?",
      a: "OCR converts an image of text into machine-readable text without understanding the document; intelligent document processing classifies the document type, extracts relevant fields, and validates the extracted data.",
    },
    {
      q: "What is document AI?",
      a: "Document AI refers to the broader field of using artificial intelligence, including OCR, machine learning, and NLP, to read, interpret, and extract information from documents.",
    },
    {
      q: "Is this the same as Azure Document Intelligence or Google Document AI?",
      a: "No, this service is platform-agnostic and can use Azure, Google, AWS, open-source, or custom extraction models depending on what fits the documents best.",
    },
    {
      q: "What is the best intelligent document processing software?",
      a: "The right choice depends on document types and volume, with cloud-native tools working well for standardized documents and specialist platforms often handling complex or varied sets better.",
    },
    {
      q: "Can document intelligence handle handwritten documents?",
      a: "Modern document intelligence tools can extract handwritten text with reasonable accuracy, though results vary more than typed text, making validation especially important.",
    },
    {
      q: "How accurate is automated document data extraction?",
      a: "Accuracy depends on document quality and consistency, with well-trained models on standardized documents commonly reaching high accuracy and validation rules catching most remaining errors.",
    },
    {
      q: "Does document intelligence work with scanned or low-quality documents?",
      a: "Yes, though accuracy generally improves with cleaner scans, and most modern platforms include preprocessing steps to improve extraction from lower-quality scans.",
    },
    {
      q: "How is document intelligence different from a document management system?",
      a: "A document management system stores and organizes documents, while document intelligence extracts and structures the data inside them, and the two are often used together.",
    },
    {
      q: "What document types can document intelligence process?",
      a: "Common types include invoices, contracts, claims forms, identity documents, receipts, tax forms, and other structured or semi-structured business documents.",
    },
    {
      q: "How long does it take to set up a document intelligence pipeline?",
      a: "Timelines vary based on document variety and volume, but a focused pipeline for one high-volume document type can often go live within a few weeks.",
    },
  ],
  queryVariants: [
    "Document intelligence",
    "Intelligent document processing",
    "document AI",
    "automated document processing",
    "document data extraction",
    "unstructured data extraction",
    "IDP software",
    "IDP solution",
  ],
  internalLinks: [
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Model Deployment", href: PATH.deploy },
  ],
  externalLinks: [],
  related: [
    { anchor: "AI Workflow Automation", href: PATH.workflow },
    { anchor: "Enterprise Chatbots", href: PATH.chatbots },
    { anchor: "AI Model Deployment", href: PATH.deploy },
  ],
};
