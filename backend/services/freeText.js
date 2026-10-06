/**
 * Free-text handling for V2.
 *
 * Rule from the spec: "Free-text responses shouldn't break the journey.
 * Store the original message and classify it where possible; if confidence
 * is low, flag it for human review."
 *
 * So this module never throws and never decides the journey on its own — it
 * returns a best-effort classification plus a confidence number. The caller
 * accepts the answer above the threshold, or flags the lead for review.
 *
 * Keyword sets are overridable via the `v2FlowConfig` Setting
 * (`freeTextKeywords`), like everything else in V2.
 */

export const DEFAULT_MIN_CONFIDENCE = 0.6;

/** id → keywords. Matched case-insensitively as substrings. */
export const DEFAULT_KEYWORDS = {
  requirement: {
    migration: ['migrat', 'modernis', 'moderniz', 'move to cloud', 'move our', 'move my', 'moving to', 'lift and shift', 'rehost', 'server', 'datacenter exit', 'data centre exit'],
    managed_cloud: ['managed', 'support', 'monitor', 'operations', 'ops', 'maintain', 'day to day', 'noc'],
    finops: ['cost', 'spend', 'finops', 'billing', 'bill', 'optimis', 'optimiz', 'expensive', 'save money', 'reduce'],
    security: ['security', 'secure', 'compliance', 'complian', 'audit', 'soc 2', 'soc2', 'iso 27001', 'identity', 'governance', 'pentest', 'vulnerab'],
    m365: ['m365', 'microsoft 365', 'office 365', 'o365', 'dynamics', 'teams', 'sharepoint', 'exchange', 'outlook', 'licens'],
    ai: ['ai', 'artificial intelligence', 'machine learning', 'copilot', 'chatbot', 'llm', 'gpt', 'automation', 'agent'],
  },
  trigger: {
    active_issue: ['issue', 'problem', 'outage', 'down', 'not working', 'broken', 'slow', 'error', 'failing', 'incident'],
    migration_project: ['migrat', 'project', 'transform', 'modernis', 'moderniz', 'move'],
    cost: ['cost', 'expensive', 'spend', 'budget', 'save', 'reduce', 'billing', 'overspend'],
    security_compliance: ['security', 'compliance', 'audit', 'breach', 'iso', 'soc 2', 'soc2', 'gdpr'],
    new_initiative: ['new', 'expansion', 'expand', 'launch', 'greenfield', 'initiative', 'startup', 'scal'],
    exploring: ['explor', 'research', 'just looking', 'curious', 'information', 'info', 'browsing'],
  },
  timeline: {
    asap_30: ['asap', 'urgent', 'immediately', 'right away', 'this month', '30 days', 'this week', 'now'],
    this_quarter: ['this quarter', 'few weeks', 'soon', 'coming weeks', 'within 3 month'],
    next_quarter: ['next quarter', 'couple of months', '2 month', 'two month', '3 month', 'three month'],
    six_plus: ['6 month', 'six month', '6+', 'next year', 'later', 'long term', 'next fiscal'],
    exploring: ['no timeline', 'not sure', 'unsure', 'just explor', 'no rush', 'no specific'],
  },
  role: {
    owner_approver: ['owner', 'ceo', 'cto', 'cio', 'founder', 'director', 'approve', 'decision maker', 'i decide', 'budget holder', 'head of'],
    technical_lead: ['architect', 'engineer', 'tech lead', 'technical lead', 'devops', 'it manager', 'sysadmin', 'lead the technical'],
    evaluation_team: ['team', 'part of', 'committee', 'evaluating', 'we are looking'],
    research: ['research', 'gathering', 'information', 'student', 'learning', 'curious'],
  },
};

const FIELD_TO_QUESTION = {
  trigger: 'Q1',
  timeline: 'Q2',
  role: 'Q3',
};

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Options for a classifiable field, from config. */
function optionsFor(field, cfg) {
  if (field === 'requirement') return cfg.requirements || [];
  const qid = FIELD_TO_QUESTION[field];
  return qid ? cfg.qualification?.[qid]?.options || [] : [];
}

function keywordsFor(field, cfg) {
  const overrides = cfg.freeTextKeywords || {};
  return { ...(DEFAULT_KEYWORDS[field] || {}), ...(overrides[field] || {}) };
}

/**
 * Best option match for `text` within one field.
 * Confidence: exact label 0.98 · label contained 0.9 · keyword hits 0.6–0.85.
 * Two near-equal candidates are treated as ambiguous and penalised, which is
 * what pushes genuinely unclear replies below the threshold.
 */
function matchField(text, field, cfg) {
  const options = optionsFor(field, cfg);
  if (!options.length) return null;
  const keywords = keywordsFor(field, cfg);
  const t = norm(text);
  if (!t) return null;

  const scored = [];
  for (const o of options) {
    if (o.id === 'other') continue; // never auto-classify into the catch-all
    const label = norm(o.label || o.title);
    const titleShort = norm(o.title);
    let score = 0;

    if (label && t === label) score = 0.98;
    else if (titleShort && t === titleShort) score = 0.96;
    else if (label && label.length > 3 && t.includes(label)) score = 0.9;
    else {
      const kws = keywords[o.id] || [];
      const hits = kws.filter((k) => k && t.includes(k)).length;
      if (hits > 0) score = Math.min(0.85, 0.6 + 0.1 * (hits - 1));
    }
    if (score > 0) scored.push({ id: o.id, label: o.label || o.title, score });
  }

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const ambiguous = scored.length > 1 && scored[1].score >= best.score - 0.05;
  return {
    field,
    value: best.id,
    label: best.label,
    confidence: ambiguous ? Number((best.score * 0.6).toFixed(2)) : Number(best.score.toFixed(2)),
    ambiguous,
  };
}

/**
 * Classify a free-text message.
 *
 * @param {string} text  raw inbound message
 * @param {object} cfg   effective V2 config
 * @param {object} opts  { expect } — the field the journey is waiting on.
 *                       When set, only that field is considered (far more
 *                       reliable than guessing across all fields).
 * @returns {{matched:boolean, field?:string, value?:string, label?:string,
 *            confidence:number, accepted:boolean, ambiguous?:boolean}}
 */
export function classifyFreeText(text, cfg, { expect } = {}) {
  const minConf = Number(cfg.freeTextMinConfidence ?? DEFAULT_MIN_CONFIDENCE);

  if (expect) {
    const m = matchField(text, expect, cfg);
    if (!m) return { matched: false, confidence: 0, accepted: false };
    return { matched: true, ...m, accepted: m.confidence >= minConf };
  }

  // No specific expectation — try every field and take the strongest.
  let best = null;
  for (const field of ['requirement', 'trigger', 'timeline', 'role']) {
    const m = matchField(text, field, cfg);
    if (m && (!best || m.confidence > best.confidence)) best = m;
  }
  if (!best) return { matched: false, confidence: 0, accepted: false };
  return { matched: true, ...best, accepted: best.confidence >= minConf };
}

/** Opt-out detection (configurable keyword list). */
export function isOptOut(text, cfg) {
  const t = norm(text);
  if (!t) return false;
  const words = cfg.safety?.optOutKeywords || ['stop', 'unsubscribe', 'cancel'];
  return words.some((w) => {
    const k = norm(w);
    return t === k || t === k.replace(/\s/g, '') || t.startsWith(`${k} `);
  });
}

/** Positive buying signal — used to escalate out of nurture. */
export function isPositiveSignal(text, cfg) {
  const t = norm(text);
  if (!t) return false;
  const phrases = cfg.positiveSignals || [
    'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'interested', 'tell me more',
    'book', 'send', 'call me', 'lets talk', "let's talk", 'proposal', 'quote', 'pricing',
  ];
  return phrases.some((p) => t === p || t.includes(p));
}

/** Restart / menu intent on an opted-out or finished conversation. */
export function isRestart(text) {
  return /^(hi|hello|hey|start|menu|restart|hi there)\b/i.test(String(text || '').trim());
}

/**
 * Explicit "take me back to the menu" command, usable at ANY step.
 *
 * Deliberately a strict exact match (not the looser isRestart above) so a
 * greeting typed as an answer to a question isn't mistaken for a restart.
 */
export function isMenuCommand(text) {
  return /^(menu|main menu|restart|start over|reset)$/i.test(String(text || '').trim());
}
