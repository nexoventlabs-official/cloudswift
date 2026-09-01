/**
 * All WhatsApp message content for every flow step.
 * Loaded from DB Settings at runtime; these are the fallback defaults.
 * Use getSetting(key) to override from admin panel.
 */

export const FLOW1_BODY = (name = '') =>
  `Hi${name ? ` ${name}` : ''} — thanks for reaching out to CloudSwift.

Our team works with mid-market companies across India and the GCC on Azure infrastructure, Microsoft 365, and managed cloud.

To connect you with the right person — what's the main challenge you're trying to solve right now?`;

export const FLOW1_BUTTONS = [
  { id: 'topic_azure',   title: 'Azure migration' },
  { id: 'topic_m365',    title: 'Microsoft 365' },
  { id: 'topic_managed', title: 'Managed cloud' },
];

// Flow 1 has 5 options — use a list message since > 3 buttons
export const FLOW1_LIST_SECTIONS = [
  {
    title: 'Select your main challenge',
    rows: [
      { id: 'topic_azure',    title: 'Azure migration or infrastructure', description: 'Move to or optimise Azure' },
      { id: 'topic_m365',     title: 'Microsoft 365 / Dynamics 365',       description: 'Licensing, setup, migration' },
      { id: 'topic_managed',  title: 'Managed cloud support',               description: 'Ongoing managed services' },
      { id: 'topic_security', title: 'Security or compliance',              description: 'Cloud security posture' },
      { id: 'topic_other',    title: 'Something else',                      description: 'Other enquiry' },
    ],
  },
];

export const FLOW2_Q1_BODY = `Got it. And what size is your company — roughly how many employees?`;
export const FLOW2_Q1_BUTTONS = [
  { id: 'size_under_100', title: 'Under 100' },
  { id: 'size_100_500',   title: '100–500' },
  { id: 'size_500_2000',  title: '500–2,000' },
];
export const FLOW2_Q1_EXTRA = { id: 'size_2000_plus', title: '2,000+' };

export const FLOW2_Q2_BODY = `Thanks. Are you currently working with any cloud vendor or MSP?`;
export const FLOW2_Q2_BUTTONS = [
  { id: 'sit_not_working', title: 'Have one, not working' },
  { id: 'sit_first_eval',  title: 'Evaluating for first time' },
  { id: 'sit_switching',   title: 'Looking to switch' },
];

export const FLOW2_Q3_BODY = `One last thing — what's your timeline for making a decision?`;
export const FLOW2_Q3_BUTTONS = [
  { id: 'tl_this_quarter', title: 'This quarter — fast' },
  { id: 'tl_next_quarter', title: 'Next quarter' },
  { id: 'tl_six_months',   title: 'Within 6 months' },
];

// ── Hot lead messages ─────────────────────────────────────────────────────────

export const HOT_PROSPECT_MSG = (name, salesRepName, calendlyLink) =>
  `Thanks ${name} — I've shared your details with ${salesRepName} from our solutions team. She'll reach out within the next few hours.

You can also book a slot directly:
${calendlyLink}

We typically start with a 30-minute call to understand your environment — no pitch, just a conversation.`;

export const HOT_SALES_BRIEF = (lead) =>
  `🔴 Hot lead — ${lead.name || 'Unknown'}, ${lead.company || 'Unknown Company'}

Topic: ${topicLabel(lead.topic)}
Size: ${sizeLabel(lead.companySize)}
Status: ${situationLabel(lead.situation)}
Timeline: ${timelineLabel(lead.timeline)}
Their message: "${lead.firstMessage || '—'}"

Calendly link sent to them.
→ wa.me/${lead.phone}`;

export const PRE_CALL_BRIEF = (lead) =>
  `📋 Pre-call brief — ${lead.name || 'Unknown'}, ${lead.company || 'Unknown'}

Company: ${lead.company || '—'}, ~${sizeLabel(lead.companySize)} employees
Their pain: ${topicLabel(lead.topic)}
Current setup: ${situationLabel(lead.situation)}
Timeline: ${timelineLabel(lead.timeline)}
WhatsApp: wa.me/${lead.phone}

Suggested opening: Ask about their current Azure spend and what's not working with their current provider.`;

export const POST_CALL_MSG = (name) =>
  `Hi ${name} — great speaking with you today.

As discussed, I'm sending across:
[1] CloudSwift managed services overview
[2] Case study — similar migration scope
[3] Pricing framework

Our team will send a formal proposal within 48 hours. Any questions in the meantime, just reply here.`;

// ── Warm nurture messages ─────────────────────────────────────────────────────

export const NURTURE_D3 = (name) =>
  `Hi ${name} — just following up from our chat earlier this week.

Happy to answer any questions about Azure managed services or how we've helped companies like yours.

If it's useful, I can send you a one-pager on how we helped a client move their entire infrastructure to Azure in 6 weeks. Worth a look?`;

export const NURTURE_D7 = (name) =>
  `${name} — sending this across in case it's useful.

We worked with a company in a similar situation — a legacy on-prem setup and a hard deadline. If you're in a comparable position, our solutions team would be happy to do a 30-minute infrastructure assessment. No cost, no obligation.

Want me to send their availability?`;

export const NURTURE_D21 = (name) =>
  `${name} — last note from me. If the timing isn't right, no problem at all. When it is, CloudSwift is here.

If you'd like a free cloud infrastructure assessment before you make any decisions, I can set that up at any point. Just reply "yes" and I'll send our team's calendar.

Either way — good luck with whatever you're working on.`;

// ── Cold exit ────────────────────────────────────────────────────────────────

export const COLD_EXIT = (name) =>
  `Thanks for reaching out ${name} — it sounds like the timing might not be right just yet.

If anything changes, we're here. And if you know anyone dealing with Azure migration or managed cloud challenges, we'd love an introduction.

We also offer a free cloud readiness assessment — no obligations. Happy to send that across if useful.

Take care!`;

// ── Label helpers ─────────────────────────────────────────────────────────────

export function topicLabel(t) {
  const map = {
    azure_migration: 'Azure migration or infrastructure',
    m365:            'Microsoft 365 / Dynamics 365',
    managed_cloud:   'Managed cloud support',
    security:        'Security or compliance',
    other:           'Something else',
  };
  return map[t] || t || '—';
}

export function sizeLabel(s) {
  const map = {
    under_100:  'Under 100',
    '100_500':  '100–500',
    '500_2000': '500–2,000',
    '2000_plus':'2,000+',
  };
  return map[s] || s || '—';
}

export function situationLabel(s) {
  const map = {
    not_working: 'Current MSP not working',
    first_eval:  'Evaluating for first time',
    switching:   'Looking to switch providers',
    exploring:   'Just exploring',
  };
  return map[s] || s || '—';
}

export function timelineLabel(t) {
  const map = {
    this_quarter: 'This quarter — moving fast',
    next_quarter: 'Next quarter',
    six_months:   'Within 6 months',
    researching:  'Just researching',
  };
  return map[t] || t || '—';
}

// Button ID → model field value maps
export const TOPIC_MAP = {
  topic_azure:    'azure_migration',
  topic_m365:     'm365',
  topic_managed:  'managed_cloud',
  topic_security: 'security',
  topic_other:    'other',
};

export const SIZE_MAP = {
  size_under_100: 'under_100',
  size_100_500:   '100_500',
  size_500_2000:  '500_2000',
  size_2000_plus: '2000_plus',
};

export const SITUATION_MAP = {
  sit_not_working: 'not_working',
  sit_first_eval:  'first_eval',
  sit_switching:   'switching',
  sit_exploring:   'exploring',
};

export const TIMELINE_MAP = {
  tl_this_quarter: 'this_quarter',
  tl_next_quarter: 'next_quarter',
  tl_six_months:   'six_months',
  tl_researching:  'researching',
};
