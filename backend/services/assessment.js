/**
 * V2 qualification engine — Fit / Intent / Urgency → route.
 *
 * Replaces the V1 scoring rules. Deliberate properties, per the V2 spec:
 *
 *   1. NO fixed percentages or weights. Each answer carries a qualitative
 *      signal ('low' | 'medium' | 'high'). Dimensions are derived from those
 *      signals, and routing is a list of declarative rules (first match wins)
 *      that live in config — so sales can retune without a rebuild.
 *
 *   2. Company size is NOT an override. `companySize` may only ever nudge
 *      `fit` (and only when enrichment provides it); it can never erase
 *      intent or urgency information.
 *
 *   3. A request to talk to a human is NOT a commercial signal. It is
 *      recorded as `humanRequested` and raises a sales alert, but this
 *      function ignores it entirely when computing the route.
 *
 * The three dimensions:
 *   fit     — how well the requirement/environment matches CloudSwift scope
 *             (requirement baseline, refined one step by the Q4 answer)
 *   intent  — evidence of an active problem/project (Q1 trigger + Q3 role)
 *   urgency — how soon action is expected (Q2 timeline)
 */
import { findRequirement, q4Branch, findOption } from '../config/v2Flow.js';

const RANK = { low: 1, medium: 2, high: 3 };
const BY_RANK = { 1: 'low', 2: 'medium', 3: 'high' };

const rank = (s) => RANK[s] || 0;
const clamp = (n) => BY_RANK[Math.min(3, Math.max(1, n))];

/**
 * Combine two signals. Mode is configurable so sales can make intent
 * stricter ('min') or more generous ('max') without touching code.
 * Default 'average' rounds to nearest (ties up).
 */
function combine(a, b, mode = 'average') {
  const ra = rank(a);
  const rb = rank(b);
  if (!ra && !rb) return '';
  if (!ra) return b;
  if (!rb) return a;
  if (mode === 'max') return clamp(Math.max(ra, rb));
  if (mode === 'min') return clamp(Math.min(ra, rb));
  return clamp(Math.round((ra + rb) / 2));
}

/** Requirement baseline fit, refined at most one step by the Q4 answer. */
export function assessFit(lead, cfg) {
  const req = findRequirement(cfg, lead.requirement);
  const baseline = req?.fit || '';
  if (!baseline) return '';

  const branch = q4Branch(cfg, lead.requirement);
  const q4Opt = branch?.options ? findOption(branch.options, lead.contextAnswer) : null;
  const q4Fit = q4Opt?.fit || '';

  let r = rank(baseline);
  if (q4Fit) {
    if (rank(q4Fit) > r) r += 1;        // environment strengthens the fit
    else if (rank(q4Fit) < r) r -= 1;   // "not sure" / weak environment softens it
  }

  // Optional, enrichment-only nudge. Never an override — and only applied
  // when a size is actually known.
  const sizeNudge = cfg.fitSizeNudge || {};
  if (lead.companySize && sizeNudge[lead.companySize]) {
    r += Number(sizeNudge[lead.companySize]) || 0;
  }

  return clamp(r);
}

/** Intent from the enquiry trigger (Q1) and the contact's role (Q3). */
export function assessIntent(lead, cfg) {
  const q = cfg.qualification || {};
  const triggerSignal = findOption(q.Q1?.options, lead.trigger)?.intent || '';
  const roleSignal = findOption(q.Q3?.options, lead.role)?.intent || '';
  return combine(triggerSignal, roleSignal, cfg.intentCombine || 'average');
}

/** Urgency from the timeline (Q2). */
export function assessUrgency(lead, cfg) {
  const q = cfg.qualification || {};
  return findOption(q.Q2?.options, lead.timeline)?.urgency || '';
}

/** Does a computed signal set satisfy a rule's `when` conditions? */
function ruleMatches(when = {}, dims) {
  for (const [dim, accepted] of Object.entries(when)) {
    if (!Array.isArray(accepted) || accepted.length === 0) continue;
    const value = dims[dim];
    if (!value || !accepted.includes(value)) return false;
  }
  return true;
}

/**
 * Full assessment. Returns the three dimensions plus the chosen route and a
 * human-readable reason (shown in the sales brief and stored on the lead).
 *
 * `humanRequested` is intentionally NOT consulted here.
 */
export function assessLead(lead, cfg) {
  const fit = assessFit(lead, cfg);
  const intent = assessIntent(lead, cfg);
  const urgency = assessUrgency(lead, cfg);
  const dims = { fit, intent, urgency };

  const routing = cfg.routing || {};
  for (const rule of routing.rules || []) {
    if (ruleMatches(rule.when, dims)) {
      return { fit, intent, urgency, route: rule.route, reason: rule.reason || '' };
    }
  }

  const fallback = routing.default || { route: 'NURTURE_REVIEW', reason: 'No rule matched' };
  return { fit, intent, urgency, route: fallback.route, reason: fallback.reason || '' };
}

/**
 * Map a V2 route onto the legacy HOT/WARM/COLD score so existing dashboards,
 * filters and CRM labels keep working unchanged.
 */
export function routeToScore(route) {
  switch (route) {
    case 'HIGH_PRIORITY':        return 'HOT';
    case 'NURTURE_REVIEW':       return 'WARM';
    case 'LOW_INTENT_SELF_SERVE':return 'COLD';
    default:                     return 'NEW';
  }
}

/** Conversation label used by the CRM list. */
export function routeToLabel(route) {
  switch (route) {
    case 'HIGH_PRIORITY':        return 'hot';
    case 'NURTURE_REVIEW':       return 'warm';
    case 'LOW_INTENT_SELF_SERVE':return 'cold';
    default:                     return 'none';
  }
}

export function routeLabelText(route) {
  switch (route) {
    case 'HIGH_PRIORITY':        return 'High Priority';
    case 'NURTURE_REVIEW':       return 'Nurture / Review';
    case 'LOW_INTENT_SELF_SERVE':return 'Low Intent / Self-Serve';
    default:                     return 'Unassessed';
  }
}
