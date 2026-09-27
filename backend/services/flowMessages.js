/**
 * All WhatsApp copy + button definitions for the CloudSwift lead flow.
 * Flow map: ENTRY → A0 (service picker Flow) → A1 → Q1..Q4 → score → HOT/WARM/COLD → safety nets.
 * Runtime overrides come from DB Settings via getSetting(key) in chatbot.js.
 */

// ── A0 · Service picker (native WhatsApp Flow) ───────────────────────────────
export const WELCOME_BODY = (name = '') =>
  `Hi${name ? ` ${name}` : ''} 👋 Welcome to CloudSwift.

We help mid-market companies across India and the GCC with Azure, Microsoft 365 and managed cloud.

Tap *Choose service* below and we'll connect you with the right specialist.`;

// Service ids == Lead.topic values, so the Flow submission maps straight through.
export const SERVICES = [
  { id: 'azure_migration', title: 'Azure migration',      description: 'Move to or optimise Azure infrastructure', iconKey: 'icon_azure' },
  { id: 'm365',            title: 'Microsoft 365',         description: 'Microsoft 365 / Dynamics 365 licensing & setup', iconKey: 'icon_m365' },
  { id: 'managed_cloud',   title: 'Managed cloud',         description: 'Ongoing managed cloud support', iconKey: 'icon_managed' },
  { id: 'security',        title: 'Security & compliance', description: 'Cloud security posture & compliance', iconKey: 'icon_security' },
  { id: 'other',           title: 'Something else',        description: 'Another enquiry', iconKey: '' },
];

export const VALID_TOPICS = SERVICES.map((s) => s.id);

// ── A1 · Continue or talk to a person ────────────────────────────────────────
export const A1_BODY = `Great choice. I can ask a few quick questions to match you with the right specialist — or connect you to a person straight away.`;
export const A1_BUTTONS = [
  { id: 'a1_continue',    title: 'Continue' },
  { id: 'a1_talk_person', title: 'Talk to a person' },
];

// ── Q1 · Company size ────────────────────────────────────────────────────────
export const Q1_BODY = `First — roughly how many employees does your company have?`;
export const Q1_BUTTONS = [
  { id: 'size_under_100', title: 'Under 100' },
  { id: 'size_100_499',   title: '100–499' },
  { id: 'size_500_plus',  title: '500+' },
];
export const SIZE_MAP = {
  size_under_100: 'under_100',
  size_100_499:   '100_500',
  size_500_plus:  '500_plus',
};

// ── Q2 · Situation ───────────────────────────────────────────────────────────
export const Q2_BODY = `Where are you right now with cloud?`;
export const Q2_BUTTONS = [
  { id: 'sit_researching', title: 'Researching' },
  { id: 'sit_first_eval',  title: 'First evaluation' },
  { id: 'sit_switching',   title: 'Switching / problem' },
];
export const SITUATION_MAP = {
  sit_researching: 'exploring',
  sit_first_eval:  'first_eval',
  sit_switching:   'switching',
};

// ── Q3 · Timeline ────────────────────────────────────────────────────────────
export const Q3_BODY = `What's your timeline for a decision?`;
export const Q3_BUTTONS = [
  { id: 'tl_this_quarter', title: 'This quarter' },
  { id: 'tl_next_quarter', title: 'Next quarter' },
  { id: 'tl_six_months',   title: '6+ months' },
];
export const TIMELINE_MAP = {
  tl_this_quarter: 'this_quarter',
  tl_next_quarter: 'next_quarter',
  tl_six_months:   'six_months',
};

// ── Q4 · Role ────────────────────────────────────────────────────────────────
export const Q4_BODY = `Last one — what's your role in this decision?`;
export const Q4_BUTTONS = [
  { id: 'role_dm',   title: 'Decision-maker' },
  { id: 'role_team', title: 'Evaluating for team' },
];
export const ROLE_MAP = {
  role_dm:   'decision_maker',
  role_team: 'evaluating_team',
};

// ── HOT path ─────────────────────────────────────────────────────────────────
export const A_H_BODY = `Perfect — this is exactly what our solutions team handles. Let me get you to the right person quickly.`;

export const H1_BODY = `Could you share your *name* and *company*? You can type it in one line, e.g. "Ravi, Acme Corp".`;

export const H2_BODY = (name = 'there') =>
  `Thanks ${name}. How would you like to move forward?`;
export const H2_BUTTONS = [
  { id: 'hot_book',     title: 'Book a call' },
  { id: 'hot_callback', title: 'Request a callback' },
  { id: 'hot_chat',     title: 'Chat now' },
];

export const H3_BODY = (salesRepName, calendlyLink) =>
  `Great — you can grab a 30-minute slot with ${salesRepName} here:
${calendlyLink}

It's a conversation about your environment, not a pitch. See you there.`;

export const H4_BODY = `Sure — when's a good time to call, and on this number? (e.g. "Tomorrow 3–5pm, same number")`;

export const H11_BODY = (salesRepName) =>
  `Got it 👍 ${salesRepName} from our solutions team will call you then. If anything changes, just reply here.`;

export const HOT_CHAT_HANDOFF = (salesRepName) =>
  `Connecting you with ${salesRepName} now — a real person will pick up this chat shortly. Feel free to type your question in the meantime.`;

export const HOT_SALES_BRIEF = (lead, action = '') =>
  `🔴 HOT lead — ${lead.name || 'Unknown'}, ${lead.company || 'Unknown Company'}
${lead.email ? `Email: ${lead.email}\n` : ''}
Service: ${topicLabel(lead.topic)}
Size: ${sizeLabel(lead.companySize)}
Situation: ${situationLabel(lead.situation)}
Timeline: ${timelineLabel(lead.timeline)}
Role: ${roleLabel(lead.role)}
${lead.talkToPerson ? 'Requested: talk to a person\n' : ''}${action ? `Action: ${action}\n` : ''}${lead.callbackTime ? `Callback: ${lead.callbackTime}\n` : ''}Source: ${channelLabel(lead.channel)}${lead.referral?.headline ? ` — "${lead.referral.headline}"` : ''}
First message: "${lead.firstMessage || '—'}"

→ wa.me/${lead.phone}`;

// ── WARM path ────────────────────────────────────────────────────────────────
export const A_W_BODY = (topic) =>
  `Thanks — based on what you've shared, here's a quick ${topicShort(topic)} checklist we use with clients:

${TOPIC_CHECKLIST[topic] || TOPIC_CHECKLIST.default}`;

export const N1_BODY = `Want me to send a few short, useful resources over the next couple of weeks? No spam — just practical material you can share internally.`;
export const N1_BUTTONS = [
  { id: 'warm_yes', title: 'Yes, send them' },
  { id: 'warm_no',  title: 'Not right now' },
];

export const WARM_CONFIRM = (name = 'there') =>
  `Perfect, ${name}. I'll send the first one in a few days. Reply "stop" any time to pause.`;

export const X6_BODY = `No problem at all. Whenever you're ready, just message here and we'll pick it up. 👋`;

// ── COLD path ────────────────────────────────────────────────────────────────
export const A_C_BODY = (topic) =>
  `Thanks for reaching out. Here's a short ${topicShort(topic)} guide that should help you at this stage:

${TOPIC_GUIDE[topic] || TOPIC_GUIDE.default}`;
export const COLD_BUTTONS = [
  { id: 'cold_menu',   title: 'Back to menu' },
  { id: 'cold_finish', title: 'Finish' },
];
export const COLD_FINISH_BODY = `Thanks again — good luck with the project. We're here whenever the timing's right. 👋`;

// ── Post-call follow-up (admin-triggered from Leads page) ────────────────────
export const POST_CALL_MSG = (name = 'there') =>
  `Hi ${name} — great speaking with you today.

As discussed, I'm sending across:
[1] CloudSwift managed services overview
[2] A relevant case study
[3] Our pricing framework

We'll follow up with a formal proposal within 48 hours. Any questions in the meantime, just reply here.`;

// ── Nurture ──────────────────────────────────────────────────────────────────
export const NURTURE_D3 = (name = 'there') =>
  `Hi ${name} — following up from earlier. Happy to answer any Azure or managed-cloud questions.

Would a one-pager on how we moved a client's infrastructure to Azure in 6 weeks be useful?`;

export const NURTURE_D7 = (name = 'there') =>
  `${name} — sharing this in case it helps. We worked with a company in a similar spot — legacy on-prem, hard deadline. If that's you, our team offers a free 30-minute infrastructure assessment. Want the availability?`;

export const NURTURE_D21 = (name = 'there') =>
  `${name} — last note from me for now. If the timing isn't right, no problem. When it is, CloudSwift is here.

Reply "yes" any time for a free cloud readiness assessment.`;

// ── Safety nets ──────────────────────────────────────────────────────────────
export const X1_BODY = `Sorry, I didn't catch that. Please tap one of the options — or I can get you a person.`;
export const X1_BUTTONS = [
  { id: 'x_retry',       title: 'Try again' },
  { id: 'a1_talk_person',title: 'Talk to a person' },
  { id: 'x_menu',        title: 'Main menu' },
];

export const X2_RESUME_BODY = (name = 'there') =>
  `Hi ${name} — want to pick up where we left off? It only takes a moment.`;
export const X2_RESUME_BUTTONS = [
  { id: 'x_resume', title: 'Continue' },
  { id: 'x_menu',   title: 'Main menu' },
];

export const X3_STOP_BODY = `You're unsubscribed — we won't send you any more automated messages. Message us any time if you'd like to talk. 👋`;

// ── Per-topic content ────────────────────────────────────────────────────────
export const TOPIC_CHECKLIST = {
  azure_migration:
    `• Inventory current workloads & dependencies
• Right-size before you lift-and-shift
• Set up landing zones + governance early
• Plan identity (Entra ID) and networking
• Model cost with the Azure pricing calculator`,
  m365:
    `• Audit current licences vs. actual usage
• Plan identity & conditional access
• Map data migration (mail, files, Teams)
• Set retention & compliance policies
• Train users before cutover`,
  managed_cloud:
    `• Define SLAs and escalation paths
• Set up monitoring & alerting baselines
• Establish patching & backup cadence
• Review cost optimisation monthly
• Document runbooks for common incidents`,
  security:
    `• Enable MFA everywhere + conditional access
• Review identity & privileged access
• Turn on Defender for Cloud recommendations
• Set up centralised logging
• Run a posture assessment against CIS/NIST`,
  other:
    `• Clarify the outcome you're after
• Note current environment & constraints
• List must-haves vs. nice-to-haves
• Set a rough budget & timeline`,
  default:
    `• Clarify the outcome you're after
• Note current environment & constraints
• List must-haves vs. nice-to-haves
• Set a rough budget & timeline`,
};

export const TOPIC_GUIDE = {
  azure_migration:
    `Start with a cloud readiness assessment — it maps workloads, dependencies and a right-sized target so you avoid surprise costs. Happy to send a template when you're ready.`,
  m365:
    `Begin with a licence + usage audit — most teams over-license. That alone usually frees budget for the migration itself.`,
  managed_cloud:
    `A good managed-cloud engagement starts with clear SLAs and a monitoring baseline. We can share a sample scope whenever it's useful.`,
  security:
    `Quick wins: MFA everywhere, conditional access, and Defender for Cloud. A short posture assessment shows where you stand fast.`,
  other:
    `Happy to point you in the right direction — just tell us a bit more whenever you're ready.`,
  default:
    `Happy to point you in the right direction — just tell us a bit more whenever you're ready.`,
};

// ── Label helpers ────────────────────────────────────────────────────────────
export function topicLabel(t) {
  return ({
    azure_migration: 'Azure migration or infrastructure',
    m365:            'Microsoft 365 / Dynamics 365',
    managed_cloud:   'Managed cloud support',
    security:        'Security or compliance',
    other:           'Something else',
  })[t] || t || '—';
}
export function topicShort(t) {
  return ({
    azure_migration: 'Azure migration',
    m365:            'Microsoft 365',
    managed_cloud:   'managed cloud',
    security:        'cloud security',
    other:           'cloud',
  })[t] || 'cloud';
}
export function sizeLabel(s) {
  return ({
    under_100: 'Under 100', '100_500': '100–499', '500_plus': '500+',
    '500_2000': '500–2,000', '2000_plus': '2,000+',
  })[s] || s || '—';
}
export function situationLabel(s) {
  return ({
    not_working: 'Provider not working', first_eval: 'First evaluation',
    switching: 'Switching / problem', exploring: 'Researching',
  })[s] || s || '—';
}
export function timelineLabel(t) {
  return ({
    this_quarter: 'This quarter', next_quarter: 'Next quarter',
    six_months: 'Within 6 months', researching: 'Just researching',
  })[t] || t || '—';
}
export function roleLabel(r) {
  return ({ decision_maker: 'Decision-maker', evaluating_team: 'Evaluating for team' })[r] || r || '—';
}
export function channelLabel(c) {
  return ({
    meta_ctwa: 'Meta ad (WhatsApp)', google_ad: 'Google ad', organic: 'Organic',
    cold_email: 'Cold email', referral: 'Referral', direct: 'Direct', unknown: 'Unknown',
  })[c] || c || 'Unknown';
}

// ── STOP keyword detection ───────────────────────────────────────────────────
const STOP_WORDS = ['stop', 'unsubscribe', 'cancel', 'opt out', 'optout', 'remove me'];
export function isStopKeyword(text = '') {
  const t = (text || '').toLowerCase().trim();
  return STOP_WORDS.some((w) => t === w || t === w.replace(' ', ''));
}

// ── Positive reply detection (nurture re-entry) ──────────────────────────────
export function isPositiveReply(text = '') {
  const t = (text || '').toLowerCase().trim();
  return ['yes', 'yeah', 'sure', 'ok', 'okay', 'interested', 'tell me more', 'book', 'send', 'yes please']
    .some((p) => t.includes(p));
}
