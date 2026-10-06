/**
 * CloudSwift WhatsApp Flow — V2 configuration (single source of truth).
 *
 * Everything the customer-facing journey says or branches on lives here so it
 * can be tuned WITHOUT touching the engine or re-publishing anything:
 *   - requirement menu
 *   - Q1/Q2/Q3 options and the signal each answer carries
 *   - the dynamic Q4 question per requirement
 *   - routing rules (declarative, evaluated in order)
 *   - nurture + self-serve resources per requirement
 *
 * Deliberate design decisions (per V2 spec):
 *   - NO fixed scoring percentages/weights. Each answer contributes a
 *     qualitative SIGNAL ('high' | 'medium' | 'low') to fit / intent /
 *     urgency, and routing is a list of declarative rules — first match wins.
 *     Sales can reorder/add rules later without a rebuild.
 *   - Company size is NOT a hard override anywhere.
 *   - "Talk to specialist" is a human-intent signal only; it never sets a
 *     commercial route by itself.
 *
 * Runtime overrides: a Setting with key `v2FlowConfig` (JSON object) is
 * deep-merged over this file, so thresholds/copy can be changed from the
 * admin panel or the DB without a deploy.
 */
import Setting from '../models/Setting.js';
import logger from '../services/logger.js';

export const SIGNALS = ['low', 'medium', 'high'];

export const V2_CONFIG = {
  version: '2.0',

  /**
   * Published Meta Flow ids used by the V2 journey.
   *
   * Defaults are the real published ids so the journey works on any host
   * without per-environment setup. Precedence: env var → this config →
   * `v2FlowConfig` Setting override. Set an id to '' to force the
   * list-message fallback.
   */
  flows: {
    requirementFlowId: process.env.WA_REQUIREMENT_FLOW_ID || '4577730929132224',
    qualifyFlowId:     process.env.WA_QUALIFY_FLOW_V2_ID  || '4992071007786916',
    contactFlowId:     process.env.WA_CONTACT_FLOW_ID     || '1182014624148414',
  },

  // ── A0 · Entry / requirement picker ───────────────────────────────────────
  welcome: {
    body:
      'Hi 👋 Welcome to CloudSwift.\n\n' +
      "Tell us what you're looking to solve and we'll point you to the right cloud specialist.",
    listButton: 'Choose what you need',
    sectionTitle: 'What do you need help with?',
    headerKey: 'welcome_header',
  },

  /**
   * Requirement menu (WhatsApp list — max 10 rows, 24-char titles).
   * `fit` is the baseline commercial fit for the service line; the Q4 answer
   * can raise or lower it (see questions.Q4.branches[].options[].fit).
   */
  requirements: [
    { id: 'migration',     title: 'Cloud Migration',     label: 'Cloud Migration / Modernisation', description: 'Move, modernise or transform workloads', fit: 'high' },
    { id: 'managed_cloud', title: 'Managed Cloud',       label: 'Managed Cloud / Support',          description: 'Cloud operations, monitoring, support',   fit: 'high' },
    { id: 'finops',        title: 'Cloud Cost / FinOps', label: 'Cloud Cost / FinOps',              description: 'Optimise spend and cost visibility',      fit: 'high' },
    { id: 'security',      title: 'Security/Compliance', label: 'Security / Compliance',            description: 'Security, governance or compliance',      fit: 'high' },
    { id: 'm365',          title: 'Microsoft 365',       label: 'Microsoft 365 / Dynamics',         description: 'Migration, licensing or optimisation',    fit: 'medium' },
    { id: 'ai',            title: 'AI / Automation',     label: 'AI / Automation',                  description: 'Enterprise AI and automation',            fit: 'medium' },
    { id: 'other',         title: 'Something else',      label: 'Something else',                   description: 'Tell us about another requirement',       fit: 'low' },
  ],

  // ── A1 · acknowledge + escape route ───────────────────────────────────────
  a1: {
    // {{requirement_label}} is substituted at send time.
    bodyTemplate: '{{requirement_label}} — understood. I need a few quick details to route this correctly.',
    buttons: [
      { id: 'continue',        title: 'Continue' },
      { id: 'talk_specialist', title: 'Talk to specialist' },
    ],
  },

  // ── Qualification (Q1–Q3 fixed, Q4 dynamic) ───────────────────────────────
  qualification: {
    intro: 'Thanks — a few quick details will help us route this correctly.',

    Q1: {
      field: 'trigger',
      prompt: 'What prompted you to reach out?',
      listButton: 'Select a reason',
      sectionTitle: 'Reason for enquiry',
      options: [
        { id: 'active_issue',        title: 'Active issue',       label: 'Active issue / support problem',    intent: 'high' },
        { id: 'migration_project',   title: 'Migration project',  label: 'Migration / transformation project', intent: 'high' },
        { id: 'cost',                title: 'Cost optimisation',  label: 'Cost optimisation',                  intent: 'medium' },
        { id: 'security_compliance', title: 'Security/compliance',label: 'Security / compliance requirement',  intent: 'high' },
        { id: 'new_initiative',      title: 'New initiative',     label: 'New initiative / expansion',         intent: 'medium' },
        { id: 'exploring',           title: 'Exploring options',  label: 'Exploring options',                  intent: 'low' },
      ],
    },

    Q2: {
      field: 'timeline',
      prompt: 'When do you need this?',
      listButton: 'Select a timeline',
      sectionTitle: 'Timeline',
      options: [
        { id: 'asap_30',      title: 'ASAP / 30 days', label: 'ASAP / within 30 days', urgency: 'high' },
        { id: 'this_quarter', title: 'This quarter',   label: 'This quarter',          urgency: 'high' },
        { id: 'next_quarter', title: 'Next quarter',   label: 'Next quarter',          urgency: 'medium' },
        { id: 'six_plus',     title: '6+ months',      label: '6+ months',             urgency: 'low' },
        { id: 'exploring',    title: 'Just exploring', label: 'Just exploring',        urgency: 'low' },
      ],
    },

    Q3: {
      field: 'role',
      prompt: "What's your role in this?",
      listButton: 'Select your role',
      sectionTitle: 'Your role',
      options: [
        { id: 'owner_approver',  title: 'I approve',        label: 'I own / approve the decision',   intent: 'high' },
        { id: 'technical_lead',  title: 'Technical lead',   label: 'I lead the technical evaluation', intent: 'high' },
        { id: 'evaluation_team', title: 'Evaluation team',  label: "I'm part of the evaluation team", intent: 'medium' },
        { id: 'research',        title: 'Gathering info',   label: "I'm gathering information",       intent: 'low' },
      ],
    },

    /**
     * Q4 — one contextual question, chosen by the selected requirement.
     * `fit` on each option adjusts the commercial fit assessment.
     */
    Q4: {
      field: 'context',
      listButton: 'Select an option',
      sectionTitle: 'Your environment',
      branches: {
        migration: {
          prompt: "What's your current environment?",
          options: [
            { id: 'on_prem',    title: 'On-premises',     label: 'On-premises',          fit: 'high' },
            { id: 'azure',      title: 'Azure',           label: 'Azure',                fit: 'high' },
            { id: 'aws_gcp',    title: 'AWS / GCP',       label: 'AWS / GCP',            fit: 'medium' },
            { id: 'hybrid',     title: 'Hybrid/multi',    label: 'Hybrid / multi-cloud', fit: 'high' },
            { id: 'not_sure',   title: 'Not sure',        label: 'Not sure',             fit: 'low' },
          ],
        },
        managed_cloud: {
          prompt: "What's your current cloud environment?",
          options: [
            { id: 'azure',        title: 'Azure',          label: 'Azure',             fit: 'high' },
            { id: 'aws_gcp',      title: 'AWS / GCP',      label: 'AWS / GCP',         fit: 'medium' },
            { id: 'hybrid',       title: 'Hybrid/multi',   label: 'Hybrid / multi-cloud', fit: 'high' },
            { id: 'onprem_cloud', title: 'On-prem + cloud',label: 'On-prem + cloud',   fit: 'high' },
            { id: 'not_sure',     title: 'Not sure',       label: 'Not sure',          fit: 'low' },
          ],
        },
        finops: {
          prompt: 'Where is most of the cloud spend you want to optimise?',
          options: [
            { id: 'azure',     title: 'Azure',       label: 'Azure',       fit: 'high' },
            { id: 'aws',       title: 'AWS',         label: 'AWS',         fit: 'high' },
            { id: 'gcp',       title: 'GCP',         label: 'GCP',         fit: 'medium' },
            { id: 'multi',     title: 'Multi-cloud', label: 'Multi-cloud', fit: 'high' },
            { id: 'not_sure',  title: 'Not sure',    label: 'Not sure',    fit: 'low' },
          ],
        },
        security: {
          prompt: 'What best describes the requirement?',
          options: [
            { id: 'posture',    title: 'Security posture', label: 'Security posture improvement', fit: 'high' },
            { id: 'compliance', title: 'Compliance/audit', label: 'Compliance / audit',           fit: 'high' },
            { id: 'identity',   title: 'Identity / access',label: 'Identity / access',            fit: 'high' },
            { id: 'governance', title: 'Cloud governance', label: 'Cloud governance',             fit: 'medium' },
            { id: 'not_sure',   title: 'Not sure',         label: 'Not sure',                     fit: 'low' },
          ],
        },
        m365: {
          prompt: 'What do you need help with?',
          options: [
            { id: 'migration',  title: 'Migration',     label: 'Migration',               fit: 'high' },
            { id: 'licensing',  title: 'Licensing',     label: 'Licensing / optimisation', fit: 'medium' },
            { id: 'security',   title: 'Security',      label: 'Security',                 fit: 'high' },
            { id: 'dynamics',   title: 'Dynamics 365',  label: 'Dynamics 365',             fit: 'high' },
            { id: 'support',    title: 'Ongoing support',label: 'Ongoing support',         fit: 'medium' },
          ],
        },
        ai: {
          prompt: 'Where are you with the AI initiative?',
          options: [
            { id: 'defined_use_case', title: 'Defined use case', label: 'Defined use case',            fit: 'high' },
            { id: 'pilot',            title: 'Pilot / PoC',      label: 'Pilot / PoC',                 fit: 'high' },
            { id: 'production',       title: 'Production',       label: 'Production deployment',       fit: 'high' },
            { id: 'identify',         title: 'Need use case',    label: 'Need help identifying a use case', fit: 'medium' },
            { id: 'exploring',        title: 'Exploring',        label: 'Exploring',                   fit: 'low' },
          ],
        },
        other: {
          prompt: 'Which area does this relate to?',
          // The list/text fallback asks for free text; inside the native Flow a
          // radio group is required, so these generic buckets are used there and
          // the Flow's optional notes field captures the detail.
          type: 'short-text',
          flowOptions: [
            { id: 'infrastructure', title: 'Infrastructure',  label: 'Infrastructure',            fit: 'medium' },
            { id: 'applications',   title: 'Applications',    label: 'Applications',              fit: 'medium' },
            { id: 'data',           title: 'Data / analytics',label: 'Data / analytics',          fit: 'medium' },
            { id: 'advisory',       title: 'Advisory',        label: 'Advisory / consulting',     fit: 'low' },
            { id: 'not_sure',       title: 'Not sure',        label: 'Not sure',                  fit: 'low' },
          ],
        },
      },
    },
  },

  /**
   * ── Routing rules ───────────────────────────────────────────────────────
   * Declarative and ordered — the FIRST rule whose conditions all match wins.
   * Conditions list the acceptable signal values for each dimension; omit a
   * dimension to ignore it. No numeric weights are locked in.
   *
   * Sales can safely reorder, add, or remove rules (or override the whole
   * array via the `v2FlowConfig` Setting) as real conversion data arrives.
   */
  routing: {
    rules: [
      {
        route: 'HIGH_PRIORITY',
        reason: 'Strong fit with high intent and near-term urgency',
        when: { fit: ['high', 'medium'], intent: ['high'], urgency: ['high'] },
      },
      {
        route: 'HIGH_PRIORITY',
        reason: 'Strong fit, high intent, decision expected next quarter',
        when: { fit: ['high'], intent: ['high'], urgency: ['medium'] },
      },
      {
        route: 'HIGH_PRIORITY',
        reason: 'Active problem with immediate urgency',
        when: { fit: ['high', 'medium'], urgency: ['high'], intent: ['high', 'medium'] },
      },
      {
        route: 'NURTURE_REVIEW',
        reason: 'Relevant account, meaningful intent, longer timeline',
        when: { fit: ['high', 'medium'], intent: ['high', 'medium'] },
      },
      {
        route: 'NURTURE_REVIEW',
        reason: 'Relevant account with near-term urgency but early-stage intent',
        when: { fit: ['high', 'medium'], urgency: ['high', 'medium'] },
      },
      {
        route: 'LOW_INTENT_SELF_SERVE',
        reason: 'Information gathering with no current project',
        when: { intent: ['low'] },
      },
    ],
    default: { route: 'NURTURE_REVIEW', reason: 'Insufficient signal — queued for review' },
  },

  // ── HIGH_PRIORITY next steps ──────────────────────────────────────────────
  highPriority: {
    intro: 'Thanks — this is exactly what our solutions team handles. Let me get you to the right specialist.',
    nextStepsTemplate: 'Thanks {{name}}. How would you like to move forward?',
    buttons: [
      { id: 'book_call',    title: 'Book a call' },
      { id: 'req_callback', title: 'Request callback' },
      { id: 'chat_now',     title: 'Chat now' },
    ],
    headerKey: 'h2_header',
  },

  // ── NURTURE_REVIEW ────────────────────────────────────────────────────────
  nurtureReview: {
    consentPrompt:
      'Want me to send a few short, useful resources over the next couple of weeks? No spam — just practical material you can share internally.',
    consentButtons: [
      { id: 'nurture_yes', title: 'Yes, send them' },
      { id: 'nurture_no',  title: 'Not right now' },
    ],
    consentYes: "Perfect, {{name}}. I'll send the first one in a few days. Reply \"stop\" any time to pause.",
    consentNo: "No problem at all. Whenever you're ready, just message here and we'll pick it up. 👋",
    headerKey: 'nurture_header',
    // Day offsets for the follow-up sequence (configurable).
    schedule: [
      { day: 3,  key: 'day3' },
      { day: 7,  key: 'day7' },
      { day: 21, key: 'day21' },
    ],
  },

  // ── LOW_INTENT_SELF_SERVE ─────────────────────────────────────────────────
  selfServe: {
    buttons: [
      { id: 'main_menu', title: 'Main menu' },
      { id: 'finish',    title: 'Finish' },
    ],
    finishBody: "Thanks again — good luck with the project. We're here whenever the timing's right. 👋",
    headerKey: 'thank_you_header',
  },

  /**
   * Requirement-specific content. `checklist` is sent on the nurture route,
   * `guide` on the self-serve route, and `nurture.day3/7/21` drive follow-ups.
   */
  resources: {
    migration: {
      checklist:
        'Here’s the migration checklist we use with clients:\n\n' +
        '• Inventory workloads & dependencies\n• Right-size before lift-and-shift\n• Set up landing zones + governance early\n• Plan identity (Entra ID) and networking\n• Model cost before you commit',
      guide: 'Start with a cloud readiness assessment — it maps workloads, dependencies and a right-sized target so you avoid surprise costs.',
      nurture: {
        day3: 'Hi {{name}} — would a one-pager on how we moved a client’s infrastructure to Azure in 6 weeks be useful?',
        day7: '{{name}} — we worked with a company in a similar spot: legacy on-prem, hard deadline. We offer a free 30-minute infrastructure assessment. Want the availability?',
        day21: '{{name}} — last note from me for now. When the timing’s right, CloudSwift is here. Reply "yes" any time for a free cloud readiness assessment.',
      },
    },
    managed_cloud: {
      checklist:
        'Here’s the managed-cloud checklist we use with clients:\n\n' +
        '• Define SLAs and escalation paths\n• Monitoring & alerting baselines\n• Patching & backup cadence\n• Monthly cost optimisation review\n• Runbooks for common incidents',
      guide: 'A good managed-cloud engagement starts with clear SLAs and a monitoring baseline. We can share a sample scope whenever useful.',
      nurture: {
        day3: 'Hi {{name}} — want our managed-cloud SLA and scope template to compare against your current setup?',
        day7: '{{name}} — most teams find gaps in monitoring and backup cadence first. Happy to run a short operations review if useful.',
        day21: '{{name}} — final note for now. Reply "yes" any time and we’ll review your cloud operations at no cost.',
      },
    },
    finops: {
      checklist:
        'Here’s the FinOps checklist we use with clients:\n\n' +
        '• Enforce a tagging baseline (owner, env, cost-centre)\n• Right-size obvious over-provisioning\n• Turn on budgets + anomaly alerts\n• Review commitments only after usage stabilises\n• Make cost a monthly ritual, not a one-off',
      guide: 'Most estates have 15–30% of spend sitting in idle or over-provisioned resources. A tagging baseline plus right-sizing usually finds it fast.',
      nurture: {
        day3: 'Hi {{name}} — want our cloud cost quick-wins checklist? It’s the first 30 days of a FinOps engagement.',
        day7: '{{name}} — we typically surface clear savings within two weeks of getting visibility. Want a free cost review?',
        day21: '{{name}} — last note for now. Reply "yes" any time for a no-cost cloud spend review.',
      },
    },
    security: {
      checklist:
        'Here’s the cloud security checklist we use with clients:\n\n' +
        '• MFA everywhere + conditional access\n• Review identity & privileged access\n• Turn on Defender for Cloud recommendations\n• Centralise logging\n• Run a posture assessment against CIS/NIST',
      guide: 'Quick wins: MFA everywhere, conditional access, and Defender for Cloud. A short posture assessment shows where you stand fast.',
      nurture: {
        day3: 'Hi {{name}} — want our cloud security posture checklist (CIS/NIST aligned)?',
        day7: '{{name}} — if there’s an audit or compliance deadline involved, we can run a short posture assessment. Want details?',
        day21: '{{name}} — final note for now. Reply "yes" any time for a cloud security posture review.',
      },
    },
    m365: {
      checklist:
        'Here’s the Microsoft 365 checklist we use with clients:\n\n' +
        '• Audit licences vs. actual usage\n• Plan identity & conditional access\n• Map data migration (mail, files, Teams)\n• Set retention & compliance policies\n• Train users before cutover',
      guide: 'Begin with a licence + usage audit — most teams over-license, and that alone usually funds the migration.',
      nurture: {
        day3: 'Hi {{name}} — want our Microsoft 365 licence optimisation checklist?',
        day7: '{{name}} — we often free up budget just from licence right-sizing. Want a short usage audit?',
        day21: '{{name}} — last note for now. Reply "yes" any time for a Microsoft 365 licence review.',
      },
    },
    ai: {
      checklist:
        'Here’s the AI readiness checklist we use with clients:\n\n' +
        '• Data classification and access boundaries\n• Grounding sources you can audit\n• Human escalation paths\n• Cost controls on model usage\n• Start with one high-ROI use case',
      guide: 'Start with an AI readiness assessment, then narrow to one high-ROI use case before scaling.',
      nurture: {
        day3: 'Hi {{name}} — want our enterprise AI readiness checklist (data, security and ops)?',
        day7: '{{name}} — most AI pilots stall on data access and grounding. We can run a readiness assessment if useful.',
        day21: '{{name}} — final note for now. Reply "yes" any time for an AI readiness assessment.',
      },
    },
    other: {
      checklist:
        'Here’s a short framing checklist that usually helps:\n\n' +
        '• Clarify the outcome you’re after\n• Note current environment & constraints\n• List must-haves vs. nice-to-haves\n• Set a rough budget & timeline',
      guide: 'Happy to point you in the right direction — tell us a bit more whenever you’re ready.',
      nurture: {
        day3: 'Hi {{name}} — anything specific you’d like us to look into?',
        day7: '{{name}} — happy to set up a short call with a specialist if that’s easier.',
        day21: '{{name}} — last note for now. Message here any time and we’ll pick it up.',
      },
    },
  },

  // ── Safety nets ───────────────────────────────────────────────────────────
  safety: {
    invalidPrompt: "Sorry, I didn't catch that. Please pick one of the options — or I can get you a specialist.",
    invalidButtons: [
      { id: 'retry',           title: 'Try again' },
      { id: 'talk_specialist', title: 'Talk to specialist' },
      { id: 'main_menu',       title: 'Main menu' },
    ],
    resumePromptTemplate: 'Hi {{name}} — want to pick up where we left off? It only takes a moment.',
    resumeButtons: [
      { id: 'resume',    title: 'Continue' },
      { id: 'main_menu', title: 'Main menu' },
    ],
    optOutBody:
      "You're unsubscribed — we won't send you any more automated messages. Message us any time if you'd like to talk. 👋",
    humanRequestAck:
      'Of course — I’m connecting you with a CloudSwift specialist. They’ll pick up this chat shortly. Feel free to add any detail in the meantime.',
    freeTextLowConfidenceAck:
      'Thanks — I’ve passed that to our team so a specialist can take a look and come back to you.',
    optOutKeywords: ['stop', 'unsubscribe', 'cancel', 'opt out', 'optout', 'remove me'],
    resumeAfterHours: 20,
  },

  // ── Contact capture / booking ─────────────────────────────────────────────
  contact: {
    intro: "Thanks — share your business details and we'll connect you with the right CloudSwift specialist.",
    // Asked one at a time, and ONLY when the field isn't already stored.
    prompts: {
      full_name: 'What’s your full name?',
      company: 'Which company are you with?',
      email: 'And your work email?',
    },
    order: ['full_name', 'company', 'email'],
    headerKey: 'hot_lead_header',
  },
  booking: {
    // V2: booking collects ONLY scheduling info — never re-asks identity.
    slotPrompt:
      'Great — what date and time works best for you? (e.g. "Tomorrow 3–5pm" or "Thu 11am")',
    confirmTemplate:
      'Thanks {{name}} 🎉 — {{rep}} will confirm your call for {{slot}} shortly. Talk soon!',
    callbackPrompt: "Sure — when's a good time to call, and on this number?",
    callbackAck: 'Got it 👍 {{rep}} from our solutions team will call you then. If anything changes, just reply here.',
    chatHandoff:
      'Connecting you with {{rep}} now — a real person will pick up this chat shortly. Feel free to type your question in the meantime.',
  },
};

// ── Runtime override support ────────────────────────────────────────────────
function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

/** Deep-merge `override` onto `base` (arrays are replaced, not merged). */
export function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    out[k] = isPlainObject(v) && isPlainObject(base[k]) ? deepMerge(base[k], v) : v;
  }
  return out;
}

let _cache = null;
let _cacheAt = 0;
const CACHE_MS = 60 * 1000;

/**
 * Effective config = this file deep-merged with the `v2FlowConfig` Setting.
 * Cached for a minute so the hot path doesn't hit Mongo on every message.
 */
export async function getConfig({ fresh = false } = {}) {
  if (!fresh && _cache && Date.now() - _cacheAt < CACHE_MS) return _cache;
  let cfg = V2_CONFIG;
  try {
    const s = await Setting.findOne({ key: 'v2FlowConfig' });
    let val = s?.value;
    if (typeof val === 'string') {
      try { val = JSON.parse(val); } catch { val = null; }
    }
    if (isPlainObject(val)) cfg = deepMerge(V2_CONFIG, val);
  } catch (err) {
    logger.warn('v2FlowConfig override load failed — using defaults', { error: err.message });
  }
  _cache = cfg;
  _cacheAt = Date.now();
  return cfg;
}

export function clearConfigCache() {
  _cache = null;
  _cacheAt = 0;
}

// ── Lookup helpers ──────────────────────────────────────────────────────────
export function findRequirement(cfg, id) {
  return (cfg.requirements || []).find((r) => r.id === id) || null;
}
export function requirementLabel(cfg, id) {
  return findRequirement(cfg, id)?.label || 'Your requirement';
}
export function q4Branch(cfg, requirementId) {
  const b = cfg.qualification?.Q4?.branches || {};
  return b[requirementId] || b.other || null;
}
export function findOption(options, id) {
  return (options || []).find((o) => o.id === id) || null;
}
/** WhatsApp list rows (title ≤ 24 chars, description ≤ 72). */
export function toRows(options) {
  return (options || []).slice(0, 10).map((o) => ({
    id: o.id,
    title: String(o.title || o.label || o.id).slice(0, 24),
    description: o.description ? String(o.description).slice(0, 72) : undefined,
  }));
}
export function fill(template, vars = {}) {
  return String(template || '').replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : ''
  );
}

export default V2_CONFIG;
