/**
 * CloudSwift WhatsApp chatbot engine — V2.
 *
 * Journey:
 *   A0 requirement picker → A1 (Continue / Talk to specialist)
 *   → Q1 trigger → Q2 timeline → Q3 role → Q4 contextual (dynamic per requirement)
 *   → assessment (Fit / Intent / Urgency)
 *   → HIGH_PRIORITY | NURTURE_REVIEW | LOW_INTENT_SELF_SERVE
 *
 * V2 guarantees implemented here:
 *   · No "500+ employees = HOT" rule anywhere.
 *   · "Talk to specialist" is always available and is a HUMAN-intent signal
 *     only — it alerts the team but never sets a commercial route.
 *   · Q4 changes with the selected requirement.
 *   · Every answer is stored individually (see models/Lead.js).
 *   · Contact details are never requested twice — only missing fields are
 *     asked, and booking collects the slot only.
 *   · Drop-off resumes from the last incomplete step, not the beginning.
 *   · Free text never breaks the journey; low-confidence replies are flagged.
 *   · STOP / UNSUBSCRIBE / CANCEL halts automated follow-ups.
 *   · Human takeover pauses the automation entirely.
 *   · All copy, options, routing rules and nurture content come from config.
 *   · Every funnel milestone (incl. drop-off step) is logged.
 *
 * Questions are sent as WhatsApp list/button messages rather than one fixed
 * published Flow, because Q4 must vary per requirement and the menu must stay
 * configurable without re-publishing anything on Meta.
 */
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Setting from '../models/Setting.js';
import FlowAsset from '../models/FlowAsset.js';
import {
  getConfig, findRequirement, requirementLabel, q4Branch, findOption, toRows, fill,
} from '../config/v2Flow.js';
import { assessLead, routeToScore, routeToLabel, routeLabelText } from './assessment.js';
import { classifyFreeText, isOptOut, isPositiveSignal, isRestart, isMenuCommand } from './freeText.js';
import { logEvent } from './funnel.js';
import { emitLead, emitLeadUpdate, emitMessage } from './eventBus.js';
import logger from './logger.js';
import { sendText, sendButtons, sendList, sendImage, markRead } from './metaCloud.js';
import { sendContactFlow, sendRequirementFlow, sendQualifyFlowV2 } from './flowService.js';

// ── Question plumbing ────────────────────────────────────────────────────────
const Q_ORDER = ['Q1', 'Q2', 'Q3', 'Q4'];
const Q_STEP  = { Q1: 'qualify_q1', Q2: 'qualify_q2', Q3: 'qualify_q3', Q4: 'qualify_q4' };
const STEP_Q  = { qualify_q1: 'Q1', qualify_q2: 'Q2', qualify_q3: 'Q3', qualify_q4: 'Q4' };
const Q_FIELD = { Q1: 'trigger', Q2: 'timeline', Q3: 'role', Q4: 'context' };

// Contact field → Lead property. Used by the "never ask twice" logic.
const CONTACT_FIELD = { full_name: 'name', company: 'company', email: 'email' };
const CONTACT_STEP  = { full_name: 'awaiting_full_name', company: 'awaiting_company', email: 'awaiting_email' };
const STEP_CONTACT  = { awaiting_full_name: 'full_name', awaiting_company: 'company', awaiting_email: 'email' };

// Requirement → legacy `topic`, so V1 dashboards/content keep working.
const REQ_TO_TOPIC = {
  migration: 'azure_migration', managed_cloud: 'managed_cloud', finops: 'other',
  security: 'security', m365: 'm365', ai: 'other', other: 'other',
};

// ── Small helpers ────────────────────────────────────────────────────────────
async function getSetting(key, fallback = '') {
  try { const s = await Setting.findOne({ key }); return s?.value || fallback; }
  catch { return fallback; }
}
async function assetUrl(key) {
  try { const a = await FlowAsset.findOne({ key }); return a?.url || ''; }
  catch { return ''; }
}
function setAwaiting(lead, cfg) {
  const hours = Number(cfg?.safety?.resumeAfterHours ?? 20);
  lead.resumeAt = new Date(Date.now() + hours * 3600 * 1000);
  lead.resumeNudgeSent = false;
}
function clearAwaiting(lead) {
  lead.resumeAt = undefined;
  lead.resumeNudgeSent = false;
}
const titles = (arr = []) => arr.map((b) => b.title);
const looksLikeEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

async function upsertConversation(phone, name, lastMessage) {
  return Conversation.findOneAndUpdate(
    { phone },
    { $set: { name: name || undefined, lastMessage, lastMessageAt: new Date() }, $inc: { unreadCount: 1 } },
    { upsert: true, new: true }
  );
}
async function logMessage(phone, convId, direction, type, body, waMessageId, rawPayload, meta) {
  try {
    const msg = await Message.create({
      phone, conversationId: convId, direction, type,
      body: body || '', waMessageId: waMessageId || '', rawPayload,
      meta: meta || {},
      status: direction === 'inbound' ? 'received' : 'sent',
    });
    emitMessage(msg);
    return msg;
  } catch (err) { logger.warn('logMessage failed', { error: err.message }); }
}
async function logOutbound(conv, phone, body, meta = {}) {
  try {
    let type = 'text';
    if (meta.kind === 'flow') type = 'flow';
    else if (meta.kind === 'buttons' || meta.kind === 'list') type = 'button';
    else if (meta.headerKey && !meta.buttons && !meta.flowCta) type = 'image';
    if (conv?._id) await logMessage(phone, conv._id, 'outbound', type, body, '', null, meta);
    await Conversation.updateOne({ phone }, { $set: { lastMessage: (body || '').slice(0, 120), lastMessageAt: new Date() } });
  } catch {}
}
async function notifySalesRep(text) {
  const repNumber = await getSetting('salesRepWaNumber', process.env.SALES_REP_WA_NUMBER || '');
  if (!repNumber) { logger.warn('Sales rep WA number not configured'); return; }
  try { await sendText(repNumber, text); }
  catch (err) { logger.error('Sales rep notification failed', { error: err.message }); }
}

/** Send a list question and log it richly for the CRM. */
async function sendQuestionList(conv, lead, { prompt, listButton, sectionTitle, options, headerKey }) {
  const rows = toRows(options);
  await sendList(lead.phone, prompt, String(listButton || 'Select').slice(0, 20), [
    { title: String(sectionTitle || 'Options').slice(0, 24), rows },
  ]);
  await logOutbound(conv, lead.phone, prompt, {
    kind: 'list', headerKey: headerKey || undefined, buttons: rows.map((r) => r.title),
  });
}

// ── Main entry point ────────────────────────────────────────────────────────
export async function handleMessage(msg) {
  const { phone, type, text, selectedId, name, waMessageId, rawPayload, referral, flowResponse } = msg;
  const cfg = await getConfig();

  if (waMessageId) markRead(waMessageId).catch(() => {});

  const preview = text || selectedId || (flowResponse ? '[form submitted]' : '…');
  const conv = await upsertConversation(phone, name, preview);

  let inboundMeta = {};
  if (type === 'button' || type === 'list') inboundMeta = { reply: true, replyTitle: preview };
  else if (type === 'flow') inboundMeta = { reply: true, flowSubmission: flowResponse || {} };
  await logMessage(phone, conv._id, 'inbound', type, preview, waMessageId, rawPayload, inboundMeta);

  // Human takeover — automation stays completely silent.
  if (conv.botPaused) { logger.info('Bot paused (human handling)', { phone }); return; }

  // STOP / UNSUBSCRIBE / CANCEL
  if (type === 'text' && isOptOut(text, cfg)) return optOut(phone, conv, cfg);

  let lead = await Lead.findOne({ phone });

  // Opted-out contacts stay silent unless they clearly restart.
  if (conv.optedOut || lead?.optedOut) {
    if (!(type === 'text' && isRestart(text))) return;
    await Conversation.updateOne({ phone }, { $set: { optedOut: false } });
    if (lead) { lead.optedOut = false; await lead.save(); }
  }

  // ── New contact → entry ────────────────────────────────────────────────
  if (!lead) {
    lead = await Lead.create({
      phone,
      name: name || '',
      profileName: name || '',
      firstMessage: text || '',
      flowStep: 'requirement_sent',
      score: 'NEW',
      entryAt: new Date(),
      channel: hasReferral(referral) ? 'meta_ctwa' : 'direct',
      source: hasReferral(referral) ? 'meta_ad' : 'direct',
      campaign: referral?.headline || referral?.sourceId || '',
      referral: referral || {},
    });
    emitLead(lead);
    await logEvent(lead, 'entry', 'entry', { firstMessage: text || '' });
    return startFlow(lead, conv, cfg);
  }

  // Backfill attribution / profile name if it arrived later.
  let dirty = false;
  if (hasReferral(referral) && !lead.referral?.sourceId && !lead.referral?.sourceUrl) {
    lead.referral = referral; lead.channel = 'meta_ctwa'; lead.source = lead.source || 'meta_ad';
    lead.campaign = lead.campaign || referral?.headline || referral?.sourceId || '';
    dirty = true;
  }
  if (name && !lead.profileName) { lead.profileName = name; dirty = true; }
  if (dirty) await lead.save();

  // ── Global commands (available at any step) ────────────────────────────
  if (selectedId === 'main_menu') return startFlow(lead, conv, cfg);
  // Typed "menu" / "restart" — works at any step, so a contact who gets stuck
  // mid-journey can always get back to the start.
  if (type === 'text' && isMenuCommand(text)) return startFlow(lead, conv, cfg);
  if (selectedId === 'talk_specialist') return handleHumanRequest(lead, conv, cfg);
  if (selectedId === 'retry' || selectedId === 'resume') return resendStep(lead, conv, cfg);
  if (selectedId === 'finish') return handleFinish(lead, conv, cfg);

  // ── Native Flow submissions (contact details only in V2) ───────────────
  if (type === 'flow' && flowResponse) {
    // V2 Requirement Picker Flow
    if (flowResponse.requirement) {
      return handleRequirementReply(lead, conv, cfg, String(flowResponse.requirement), null);
    }
    // V2 Qualification Flow — all four answers arrive together.
    if (flowResponse.trigger || flowResponse.timeline || flowResponse.role || flowResponse.context) {
      return handleQualifyFlowSubmission(lead, conv, cfg, flowResponse);
    }
    if (flowResponse.full_name || flowResponse.company || flowResponse.email) {
      return handleContactSubmission(lead, conv, cfg, flowResponse);
    }
    // Unexpected/legacy submission — keep it, don't break the journey.
    await recordFreeText(lead, JSON.stringify(flowResponse).slice(0, 500), lead.flowStep, null);
    return resendStep(lead, conv, cfg);
  }

  // Positive buying signal during/after nurture or self-serve → escalate.
  const nurtureSteps = ['nurture_consent_sent', 'nurture_active', 'nurture_declined', 'nurture_d3', 'nurture_d7', 'nurture_d21', 'self_serve_sent', 'self_serve_done', 'completed'];
  if (nurtureSteps.includes(lead.flowStep) && type === 'text' && isPositiveSignal(text, cfg)) {
    return escalateFromNurture(lead, conv, cfg, text);
  }

  // ── Route by current step ──────────────────────────────────────────────
  switch (lead.flowStep) {
    case 'requirement_sent':       return handleRequirementReply(lead, conv, cfg, selectedId, text);
    case 'a1_sent_v2':             return handleA1(lead, conv, cfg, selectedId, text);
    case 'qualify_q1':
    case 'qualify_q2':
    case 'qualify_q3':
    case 'qualify_q4':             return handleAnswer(lead, conv, cfg, STEP_Q[lead.flowStep], selectedId, text);
    case 'qualify_q4_text':        return handleQ4Text(lead, conv, cfg, text);
    // Waiting on the native Qualification Flow — a stray text here means the
    // contact typed instead of opening the form, so re-offer it.
    case 'qualify_flow_sent':      return handleInvalid(lead, conv, cfg);
    case 'awaiting_full_name':
    case 'awaiting_company':
    case 'awaiting_email':         return handleContactAnswer(lead, conv, cfg, STEP_CONTACT[lead.flowStep], text);
    case 'contact_flow_sent':      return handleInvalid(lead, conv, cfg);
    case 'high_priority_options':  return handleHighPriorityChoice(lead, conv, cfg, selectedId);
    case 'awaiting_booking_slot':  return handleBookingSlot(lead, conv, cfg, text);
    case 'awaiting_callback_time': return handleCallbackTime(lead, conv, cfg, text);
    case 'nurture_consent_sent':   return handleNurtureConsent(lead, conv, cfg, selectedId);
    case 'self_serve_sent':        return handleSelfServeChoice(lead, conv, cfg, selectedId);
    default:                       return handleGeneral(lead, conv, cfg, preview);
  }
}

// ── A0 · Entry / requirement picker ─────────────────────────────────────────
async function startFlow(lead, conv, cfg) {
  lead.flowStep = 'requirement_sent';
  lead.invalidCount = 0;
  setAwaiting(lead, cfg);
  await lead.save();

  // Prefer the published native Requirement Picker Flow; fall back to the
  // list message if it isn't configured or the send fails.
  let sentFlow = false;
  try { sentFlow = await sendRequirementFlow(lead.phone, lead.name || lead.profileName, cfg); }
  catch (e) { logger.warn('Requirement flow send failed, using list', { error: e.message }); }

  if (sentFlow) {
    return logOutbound(conv, lead.phone, cfg.welcome.body, {
      kind: 'flow', headerKey: cfg.welcome.headerKey, flowCta: cfg.welcome.listButton,
    });
  }

  await sendQuestionList(conv, lead, {
    prompt: cfg.welcome.body,
    listButton: cfg.welcome.listButton,
    sectionTitle: cfg.welcome.sectionTitle,
    options: cfg.requirements,
    headerKey: cfg.welcome.headerKey,
  });
}

async function handleRequirementReply(lead, conv, cfg, selectedId, text) {
  let chosen = selectedId ? findRequirement(cfg, selectedId) : null;

  if (!chosen && text) {
    const c = classifyFreeText(text, cfg, { expect: 'requirement' });
    await recordFreeText(lead, text, 'requirement_sent', c);
    if (c.accepted) chosen = findRequirement(cfg, c.value);
  }
  if (!chosen) return handleInvalid(lead, conv, cfg);

  lead.requirement = chosen.id;
  lead.requirementLabel = chosen.label;
  lead.topic = REQ_TO_TOPIC[chosen.id] || 'other';
  lead.requirementSelectedAt = new Date();
  lead.invalidCount = 0;
  lead.flowStep = 'a1_sent_v2';
  setAwaiting(lead, cfg);
  await lead.save();
  emitLeadUpdate(lead);
  await logEvent(lead, 'requirement_selected', 'requirement_sent', { requirement: chosen.id });

  const body = fill(cfg.a1.bodyTemplate, { requirement_label: chosen.label });
  const img = await assetUrl(cfg.welcome.headerKey);
  await sendButtons(lead.phone, body, cfg.a1.buttons, img || '');
  await logOutbound(conv, lead.phone, body, {
    kind: 'buttons', headerKey: img ? cfg.welcome.headerKey : undefined, buttons: titles(cfg.a1.buttons),
  });
}

async function handleA1(lead, conv, cfg, selectedId, text) {
  if (selectedId === 'continue' || (text && /^(continue|yes|ok|start)\b/i.test(text.trim()))) {
    return startQualification(lead, conv, cfg);
  }
  if (text) await recordFreeText(lead, text, 'a1_sent_v2', null);
  return handleInvalid(lead, conv, cfg);
}

// ── Qualification ───────────────────────────────────────────────────────────
async function startQualification(lead, conv, cfg) {
  lead.qualificationStartedAt = lead.qualificationStartedAt || new Date();
  lead.invalidCount = 0;
  await lead.save();
  await logEvent(lead, 'qualification_started', 'qualify_q1');

  // Preferred path: ask Q1–Q4 inside one native Flow. Q4's label/options are
  // passed in, so the contextual question matches the chosen requirement.
  let sentFlow = false;
  try { sentFlow = await sendQualifyFlowV2(lead.phone, cfg, lead.requirement, lead.name || lead.profileName); }
  catch (e) { logger.warn('Qualify flow send failed, using list questions', { error: e.message }); }

  if (sentFlow) {
    lead.flowStep = 'qualify_flow_sent';
    lead.contextQuestionId = `Q4:${lead.requirement}`;
    setAwaiting(lead, cfg);
    await lead.save();
    return logOutbound(conv, lead.phone, cfg.qualification.intro, {
      kind: 'flow', headerKey: 'qualify_header', flowCta: 'Answer questions',
    });
  }

  // Fallback: one list message per question.
  return sendQuestion(lead, conv, cfg, 'Q1');
}

/**
 * The native Qualification Flow returns every answer in one submission.
 * Unknown/absent values simply fall through to the assessment, which handles
 * partial data gracefully.
 */
async function handleQualifyFlowSubmission(lead, conv, cfg, resp) {
  const q = cfg.qualification;
  const take = (options, value) => (findOption(options, value) ? value : '');

  lead.trigger  = take(q.Q1.options, resp.trigger)  || lead.trigger;
  lead.timeline = take(q.Q2.options, resp.timeline) || lead.timeline;
  lead.role     = take(q.Q3.options, resp.role)     || lead.role;

  const branch = q4Branch(cfg, lead.requirement);
  const q4Options = branch?.flowOptions || branch?.options || [];
  const ctx = findOption(q4Options, resp.context);
  if (ctx) {
    lead.contextAnswer = ctx.id;
    lead.contextAnswerLabel = ctx.label || ctx.title || ctx.id;
  } else if (resp.context) {
    lead.contextAnswer = '';
    lead.contextAnswerLabel = String(resp.context).slice(0, 300);
  }

  lead.invalidCount = 0;
  await lead.save();

  // The optional free-text notes field is stored verbatim like any free text.
  const notes = String(resp.notes || '').trim();
  if (notes) {
    await recordFreeText(lead, notes, 'qualify_flow_notes', {
      matched: true, confidence: 1, accepted: true, field: 'notes',
    });
  }

  return runAssessment(lead, conv, cfg);
}

async function sendQuestion(lead, conv, cfg, qid) {
  if (qid === 'Q4') {
    const branch = q4Branch(cfg, lead.requirement);
    if (!branch) return runAssessment(lead, conv, cfg);

    lead.contextQuestionId = `Q4:${lead.requirement}`;
    if (branch.type === 'short-text' || !branch.options?.length) {
      lead.flowStep = 'qualify_q4_text';
      setAwaiting(lead, cfg);
      await lead.save();
      await sendText(lead.phone, branch.prompt);
      return logOutbound(conv, lead.phone, branch.prompt);
    }
    lead.flowStep = 'qualify_q4';
    setAwaiting(lead, cfg);
    await lead.save();
    return sendQuestionList(conv, lead, {
      prompt: branch.prompt,
      listButton: cfg.qualification.Q4.listButton,
      sectionTitle: cfg.qualification.Q4.sectionTitle,
      options: branch.options,
    });
  }

  const q = cfg.qualification[qid];
  lead.flowStep = Q_STEP[qid];
  setAwaiting(lead, cfg);
  await lead.save();
  return sendQuestionList(conv, lead, {
    prompt: q.prompt,
    listButton: q.listButton,
    sectionTitle: q.sectionTitle,
    options: q.options,
  });
}

/** Generic Q1–Q4 answer handler (list selection or free text). */
async function handleAnswer(lead, conv, cfg, qid, selectedId, text) {
  const isQ4 = qid === 'Q4';
  const branch = isQ4 ? q4Branch(cfg, lead.requirement) : null;
  const options = isQ4 ? branch?.options || [] : cfg.qualification[qid].options;
  const field = Q_FIELD[qid];

  let opt = selectedId ? findOption(options, selectedId) : null;

  if (!opt && text) {
    if (isQ4) {
      // Try a label match; otherwise keep the raw answer — Q4 is contextual,
      // so a free-text answer is still useful and must not block the journey.
      const t = text.toLowerCase().trim();
      opt = options.find((o) => t === String(o.label || '').toLowerCase() || t === String(o.title || '').toLowerCase()) || null;
      if (!opt) {
        await recordFreeText(lead, text, lead.flowStep, { matched: false, confidence: 0, accepted: false });
        lead.contextAnswer = '';
        lead.contextAnswerLabel = text.slice(0, 300);
        lead.invalidCount = 0;
        await lead.save();
        return runAssessment(lead, conv, cfg);
      }
    } else {
      const c = classifyFreeText(text, cfg, { expect: field });
      await recordFreeText(lead, text, lead.flowStep, c);
      if (c.accepted) opt = findOption(options, c.value);
    }
  }

  if (!opt) return handleInvalid(lead, conv, cfg);

  if (isQ4) {
    lead.contextAnswer = opt.id;
    lead.contextAnswerLabel = opt.label || opt.title || opt.id;
  } else {
    lead[field] = opt.id;
  }
  lead.invalidCount = 0;
  await lead.save();

  const nextQid = Q_ORDER[Q_ORDER.indexOf(qid) + 1];
  if (!nextQid) return runAssessment(lead, conv, cfg);
  return sendQuestion(lead, conv, cfg, nextQid);
}

/** Q4 for the 'other' requirement (short text). */
async function handleQ4Text(lead, conv, cfg, text) {
  const body = (text || '').trim();
  if (!body) return handleInvalid(lead, conv, cfg);
  lead.contextAnswer = 'free_text';
  lead.contextAnswerLabel = body.slice(0, 300);
  lead.invalidCount = 0;
  await lead.save();
  await recordFreeText(lead, body, 'qualify_q4_text', { matched: true, confidence: 1, accepted: true, field: 'context' });
  return runAssessment(lead, conv, cfg);
}

// ── Assessment + routing ────────────────────────────────────────────────────
async function runAssessment(lead, conv, cfg) {
  lead.qualificationCompletedAt = new Date();
  await logEvent(lead, 'qualification_completed', 'assessed', {
    requirement: lead.requirement, trigger: lead.trigger, timeline: lead.timeline,
    role: lead.role, context: lead.contextAnswer || lead.contextAnswerLabel,
  });

  const a = assessLead(lead, cfg);
  lead.fit = a.fit;
  lead.intent = a.intent;
  lead.urgency = a.urgency;
  lead.route = a.route;
  lead.routeReason = a.reason;
  lead.assessedAt = new Date();
  lead.routedAt = new Date();
  lead.score = routeToScore(a.route);          // legacy compatibility
  lead.scoreTimestamp = new Date();
  lead.flowStep = 'assessed';
  await lead.save();
  emitLeadUpdate(lead);

  await Conversation.updateOne(
    { phone: lead.phone },
    { $set: { label: routeToLabel(a.route), leadId: lead._id } }
  );
  await logEvent(lead, 'route_assigned', 'assessed', {
    fit: a.fit, intent: a.intent, urgency: a.urgency, route: a.route, reason: a.reason,
  });
  logger.info('Lead routed', { phone: lead.phone, ...a });

  if (a.route === 'HIGH_PRIORITY') return routeHighPriority(lead, conv, cfg);
  if (a.route === 'NURTURE_REVIEW') return routeNurture(lead, conv, cfg);
  return routeSelfServe(lead, conv, cfg);
}

// ── Route 1 · HIGH_PRIORITY ─────────────────────────────────────────────────
async function routeHighPriority(lead, conv, cfg) {
  lead.status = 'Contacted';
  await lead.save();
  await sendText(lead.phone, cfg.highPriority.intro);
  await logOutbound(conv, lead.phone, cfg.highPriority.intro);
  return askNextContactField(lead, conv, cfg);
}

/** Asks ONLY for fields we don't already have. Never asks twice. */
async function askNextContactField(lead, conv, cfg) {
  const order = cfg.contact.order || ['full_name', 'company', 'email'];
  const missing = order.filter((f) => !String(lead[CONTACT_FIELD[f]] || '').trim());

  if (missing.length === 0) return onContactComplete(lead, conv, cfg);

  // Nothing known at all → one native form is faster than three questions.
  if (missing.length === order.length) {
    let sent = false;
    try { sent = await sendContactFlow(lead.phone, lead.name, cfg); }
    catch (e) { logger.warn('Contact flow send failed', { error: e.message }); }
    if (sent) {
      lead.flowStep = 'contact_flow_sent';
      setAwaiting(lead, cfg);
      await lead.save();
      return logOutbound(conv, lead.phone, cfg.contact.intro, {
        kind: 'flow', headerKey: cfg.contact.headerKey, flowCta: 'Share your details',
      });
    }
  }

  const field = missing[0];
  lead.flowStep = CONTACT_STEP[field];
  setAwaiting(lead, cfg);
  await lead.save();
  const prompt = cfg.contact.prompts[field];
  await sendText(lead.phone, prompt);
  return logOutbound(conv, lead.phone, prompt);
}

async function handleContactAnswer(lead, conv, cfg, field, text) {
  const value = (text || '').trim();
  if (!value) return handleInvalid(lead, conv, cfg);
  if (field === 'email' && !looksLikeEmail(value)) {
    const retry = 'That doesn’t look like a valid email — could you re-send it?';
    await sendText(lead.phone, retry);
    return logOutbound(conv, lead.phone, retry);
  }
  lead[CONTACT_FIELD[field]] = value.slice(0, 160);
  lead.invalidCount = 0;
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne(
    { phone: lead.phone },
    { $set: { name: lead.name || undefined, company: lead.company || undefined } }
  );
  return askNextContactField(lead, conv, cfg);
}

async function handleContactSubmission(lead, conv, cfg, resp) {
  if (resp.full_name && !lead.name) lead.name = String(resp.full_name).slice(0, 120);
  if (resp.company && !lead.company) lead.company = String(resp.company).slice(0, 120);
  if (resp.email && !lead.email) lead.email = String(resp.email).slice(0, 160);
  lead.invalidCount = 0;
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne(
    { phone: lead.phone },
    { $set: { name: lead.name || undefined, company: lead.company || undefined } }
  );
  return askNextContactField(lead, conv, cfg);
}

async function onContactComplete(lead, conv, cfg) {
  await logEvent(lead, 'contact_captured', lead.flowStep);
  await notifySalesRep(buildSalesBrief(lead, cfg));

  // Human-requested leads just wait for a person; only commercially routed
  // HIGH_PRIORITY leads get the booking options.
  if (lead.route !== 'HIGH_PRIORITY') {
    lead.flowStep = 'human_handoff';
    clearAwaiting(lead);
    await lead.save();
    const ack = 'Thanks — a CloudSwift specialist will pick this up shortly.';
    await sendText(lead.phone, ack);
    return logOutbound(conv, lead.phone, ack);
  }

  lead.flowStep = 'high_priority_options';
  setAwaiting(lead, cfg);
  await lead.save();
  const body = fill(cfg.highPriority.nextStepsTemplate, { name: lead.name || 'there' });
  const img = await assetUrl(cfg.highPriority.headerKey);
  await sendButtons(lead.phone, body, cfg.highPriority.buttons, img || '');
  return logOutbound(conv, lead.phone, body, {
    kind: 'buttons', headerKey: img ? cfg.highPriority.headerKey : undefined,
    buttons: titles(cfg.highPriority.buttons),
  });
}

async function handleHighPriorityChoice(lead, conv, cfg, selectedId) {
  if (selectedId === 'book_call') {
    lead.flowStep = 'awaiting_booking_slot';
    setAwaiting(lead, cfg);
    await lead.save();
    await sendText(lead.phone, cfg.booking.slotPrompt);
    return logOutbound(conv, lead.phone, cfg.booking.slotPrompt);
  }
  if (selectedId === 'req_callback') {
    lead.flowStep = 'awaiting_callback_time';
    setAwaiting(lead, cfg);
    await lead.save();
    await sendText(lead.phone, cfg.booking.callbackPrompt);
    return logOutbound(conv, lead.phone, cfg.booking.callbackPrompt);
  }
  if (selectedId === 'chat_now') {
    const rep = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'our team');
    lead.flowStep = 'human_handoff';
    lead.humanHandoffAt = new Date();
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    // Human takeover — automation stops for this conversation.
    await Conversation.updateOne({ phone: lead.phone }, { $set: { botPaused: true } });
    const body = fill(cfg.booking.chatHandoff, { rep });
    await sendText(lead.phone, body);
    await logOutbound(conv, lead.phone, body);
    await notifySalesRep(`${buildSalesBrief(lead, cfg)}\n\n⚡ Wants to CHAT NOW — bot paused, please jump in.`);
    return logEvent(lead, 'human_handoff', 'high_priority_options', { via: 'chat_now' });
  }
  return handleInvalid(lead, conv, cfg);
}

async function handleBookingSlot(lead, conv, cfg, text) {
  const slot = (text || '').trim();
  if (!slot) return handleInvalid(lead, conv, cfg);
  const rep = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'Our team');

  lead.bookingSlot = slot.slice(0, 200);
  lead.meetingBookedAt = new Date();
  lead.status = 'Contacted';
  lead.flowStep = 'booking_requested';
  clearAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);

  const body = fill(cfg.booking.confirmTemplate, { name: lead.name || 'there', rep, slot: lead.bookingSlot });
  await sendText(lead.phone, body);
  await logOutbound(conv, lead.phone, body);
  await notifySalesRep(`${buildSalesBrief(lead, cfg)}\n\n📅 Requested slot: ${lead.bookingSlot}`);
  return logEvent(lead, 'meeting_booked', 'awaiting_booking_slot', { slot: lead.bookingSlot });
}

async function handleCallbackTime(lead, conv, cfg, text) {
  const when = (text || '').trim();
  if (!when) return handleInvalid(lead, conv, cfg);
  const rep = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'Our team');

  lead.callbackTime = when.slice(0, 200);
  lead.meetingBookedAt = lead.meetingBookedAt || new Date();
  lead.flowStep = 'callback_ack';
  clearAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);

  const body = fill(cfg.booking.callbackAck, { rep });
  await sendText(lead.phone, body);
  await logOutbound(conv, lead.phone, body);
  await notifySalesRep(`${buildSalesBrief(lead, cfg)}\n\n📞 Requested callback: ${lead.callbackTime}`);
  return logEvent(lead, 'meeting_booked', 'awaiting_callback_time', { callbackTime: lead.callbackTime });
}

// ── Route 2 · NURTURE_REVIEW ────────────────────────────────────────────────
async function routeNurture(lead, conv, cfg) {
  lead.status = 'Nurturing';
  lead.flowStep = 'nurture_consent_sent';
  setAwaiting(lead, cfg);
  await lead.save();
  emitLeadUpdate(lead);

  const res = cfg.resources?.[lead.requirement] || cfg.resources?.other || {};
  const checklist = res.checklist || '';
  if (checklist) {
    const img = await assetUrl(cfg.nurtureReview.headerKey);
    if (img) await sendImage(lead.phone, img, checklist);
    else await sendText(lead.phone, checklist);
    await logOutbound(conv, lead.phone, checklist, img ? { headerKey: cfg.nurtureReview.headerKey } : {});
  }

  await sendButtons(lead.phone, cfg.nurtureReview.consentPrompt, cfg.nurtureReview.consentButtons);
  return logOutbound(conv, lead.phone, cfg.nurtureReview.consentPrompt, {
    kind: 'buttons', buttons: titles(cfg.nurtureReview.consentButtons),
  });
}

async function handleNurtureConsent(lead, conv, cfg, selectedId) {
  if (selectedId === 'nurture_yes') {
    const now = Date.now();
    const sched = cfg.nurtureReview.schedule || [{ day: 3 }, { day: 7 }, { day: 21 }];
    lead.nurtureConsent = true;
    lead.status = 'Nurturing';
    lead.flowStep = 'nurture_d3';   // picked up by the scheduler
    lead.nurtureD3At  = new Date(now + (sched[0]?.day ?? 3) * 864e5);
    lead.nurtureD7At  = new Date(now + (sched[1]?.day ?? 7) * 864e5);
    lead.nurtureD21At = new Date(now + (sched[2]?.day ?? 21) * 864e5);
    lead.nurtureD3Sent = lead.nurtureD7Sent = lead.nurtureD21Sent = false;
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    const body = fill(cfg.nurtureReview.consentYes, { name: lead.name || 'there' });
    await sendText(lead.phone, body);
    await logOutbound(conv, lead.phone, body);
    return logEvent(lead, 'nurture_consent', 'nurture_consent_sent', { granted: true });
  }
  if (selectedId === 'nurture_no') {
    lead.nurtureConsent = false;
    lead.flowStep = 'nurture_declined';
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    await sendText(lead.phone, cfg.nurtureReview.consentNo);
    await logOutbound(conv, lead.phone, cfg.nurtureReview.consentNo);
    return logEvent(lead, 'nurture_consent', 'nurture_consent_sent', { granted: false });
  }
  return handleInvalid(lead, conv, cfg);
}

// ── Route 3 · LOW_INTENT_SELF_SERVE ─────────────────────────────────────────
async function routeSelfServe(lead, conv, cfg) {
  lead.status = 'Lost';
  lead.flowStep = 'self_serve_sent';
  setAwaiting(lead, cfg);
  await lead.save();
  emitLeadUpdate(lead);

  const res = cfg.resources?.[lead.requirement] || cfg.resources?.other || {};
  const guide = res.guide || '';
  const img = await assetUrl(cfg.selfServe.headerKey);
  await sendButtons(lead.phone, guide || 'Here’s something that should help at this stage.', cfg.selfServe.buttons, img || '');
  return logOutbound(conv, lead.phone, guide, {
    kind: 'buttons', headerKey: img ? cfg.selfServe.headerKey : undefined,
    buttons: titles(cfg.selfServe.buttons),
  });
}

async function handleSelfServeChoice(lead, conv, cfg, selectedId) {
  if (selectedId === 'finish') return handleFinish(lead, conv, cfg);
  if (selectedId === 'main_menu') return startFlow(lead, conv, cfg);
  return handleInvalid(lead, conv, cfg);
}

async function handleFinish(lead, conv, cfg) {
  lead.flowStep = 'self_serve_done';
  clearAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await sendText(lead.phone, cfg.selfServe.finishBody);
  return logOutbound(conv, lead.phone, cfg.selfServe.finishBody);
}

// ── Human request (escape route, always available) ──────────────────────────
async function handleHumanRequest(lead, conv, cfg) {
  lead.humanRequested = true;
  lead.humanRequestedAt = new Date();
  lead.talkToPerson = true;          // legacy flag, no longer used for routing
  lead.invalidCount = 0;
  await lead.save();
  emitLeadUpdate(lead);
  await logEvent(lead, 'human_requested', lead.flowStep);

  await sendText(lead.phone, cfg.safety.humanRequestAck);
  await logOutbound(conv, lead.phone, cfg.safety.humanRequestAck);

  // Alert the team immediately — the human-intent signal matters even before
  // we know whether the account is commercially qualified.
  await notifySalesRep(
    `🙋 HUMAN REQUESTED — ${lead.name || lead.profileName || lead.phone}\n` +
    `${buildSalesBrief(lead, cfg)}\n\nNote: requested a specialist. Not auto-classified as high priority.`
  );

  // Collect only what we still don't know, then wait for a person.
  return askNextContactField(lead, conv, cfg);
}

async function escalateFromNurture(lead, conv, cfg, text) {
  lead.route = 'HIGH_PRIORITY';
  lead.routeReason = 'Positive buying signal during nurture (manual review)';
  lead.score = 'HOT';
  lead.scoreTimestamp = new Date();
  lead.routedAt = new Date();
  lead.needsHumanReview = true;
  lead.reviewReason = 'Escalated from nurture on positive reply';
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { label: 'hot' } });
  await logEvent(lead, 'nurture_escalated', lead.flowStep, { text: (text || '').slice(0, 200) });
  return routeHighPriority(lead, conv, cfg);
}

// ── Safety nets ─────────────────────────────────────────────────────────────
async function handleInvalid(lead, conv, cfg) {
  lead.invalidCount = (lead.invalidCount || 0) + 1;
  setAwaiting(lead, cfg);

  // Repeated failures → stop guessing and get a human involved.
  if (lead.invalidCount >= 3) {
    lead.needsHumanReview = true;
    lead.reviewReason = `Could not interpret replies at ${lead.flowStep}`;
    await lead.save();
    await logEvent(lead, 'free_text_flagged', lead.flowStep, { reason: 'repeated_invalid' });
    await notifySalesRep(
      `⚠️ Needs human review — ${lead.name || lead.phone}\nStuck at: ${lead.flowStep}\n${buildSalesBrief(lead, cfg)}`
    );
    const ack = cfg.safety.freeTextLowConfidenceAck;
    await sendText(lead.phone, ack);
    return logOutbound(conv, lead.phone, ack);
  }

  await lead.save();
  await logEvent(lead, 'invalid_input', lead.flowStep);
  const img = await assetUrl('x1_header');
  await sendButtons(lead.phone, cfg.safety.invalidPrompt, cfg.safety.invalidButtons, img || '');
  return logOutbound(conv, lead.phone, cfg.safety.invalidPrompt, {
    kind: 'buttons', headerKey: img ? 'x1_header' : undefined, buttons: titles(cfg.safety.invalidButtons),
  });
}

/** Store a free-text reply verbatim; flag for review when confidence is low. */
async function recordFreeText(lead, text, atStep, classification) {
  try {
    const entry = {
      text: String(text || '').slice(0, 1000),
      atStep: atStep || '',
      classifiedAs: classification?.matched ? `${classification.field}:${classification.value}` : '',
      confidence: classification?.confidence || 0,
      at: new Date(),
    };
    lead.freeTextLog = [...(lead.freeTextLog || []), entry].slice(-30);
    if (classification && !classification.accepted) {
      lead.needsHumanReview = true;
      lead.reviewReason = `Low-confidence free text at ${atStep}`;
      await logEvent(lead, 'free_text_flagged', atStep, {
        text: entry.text, confidence: entry.confidence,
      });
    }
    await lead.save();
  } catch (err) {
    logger.warn('recordFreeText failed', { error: err.message });
  }
}

/** Resume from the last incomplete step — never restart from the beginning. */
async function resendStep(lead, conv, cfg) {
  lead.invalidCount = 0;
  setAwaiting(lead, cfg);
  await lead.save();

  switch (lead.flowStep) {
    case 'requirement_sent':       return startFlow(lead, conv, cfg);
    case 'a1_sent_v2': {
      const body = fill(cfg.a1.bodyTemplate, { requirement_label: requirementLabel(cfg, lead.requirement) });
      await sendButtons(lead.phone, body, cfg.a1.buttons);
      return logOutbound(conv, lead.phone, body, { kind: 'buttons', buttons: titles(cfg.a1.buttons) });
    }
    case 'qualify_flow_sent':      return startQualification(lead, conv, cfg);
    case 'qualify_q1':             return sendQuestion(lead, conv, cfg, 'Q1');
    case 'qualify_q2':             return sendQuestion(lead, conv, cfg, 'Q2');
    case 'qualify_q3':             return sendQuestion(lead, conv, cfg, 'Q3');
    case 'qualify_q4':
    case 'qualify_q4_text':        return sendQuestion(lead, conv, cfg, 'Q4');
    case 'awaiting_full_name':
    case 'awaiting_company':
    case 'awaiting_email':
    case 'contact_flow_sent':      return askNextContactField(lead, conv, cfg);
    case 'high_priority_options':  return onContactComplete(lead, conv, cfg);
    case 'awaiting_booking_slot':  { await sendText(lead.phone, cfg.booking.slotPrompt); return logOutbound(conv, lead.phone, cfg.booking.slotPrompt); }
    case 'awaiting_callback_time': { await sendText(lead.phone, cfg.booking.callbackPrompt); return logOutbound(conv, lead.phone, cfg.booking.callbackPrompt); }
    case 'nurture_consent_sent':   return routeNurture(lead, conv, cfg);
    case 'self_serve_sent':        return routeSelfServe(lead, conv, cfg);
    default:                       return startFlow(lead, conv, cfg);
  }
}

async function optOut(phone, conv, cfg) {
  await Conversation.updateOne({ phone }, { $set: { optedOut: true } });
  const lead = await Lead.findOne({ phone });
  if (lead) {
    lead.optedOut = true;
    lead.nurtureConsent = false;
    lead.nurtureD3Sent = lead.nurtureD7Sent = lead.nurtureD21Sent = true; // cancel pending
    clearAwaiting(lead);
    lead.flowStep = 'opted_out';
    await lead.save();
    emitLeadUpdate(lead);
    await logEvent(lead, 'opted_out', 'opted_out');
  }
  await sendText(phone, cfg.safety.optOutBody);
  if (conv?._id) await logMessage(phone, conv._id, 'outbound', 'text', cfg.safety.optOutBody, '', null, {});
  logger.info('Contact opted out', { phone });
}

async function handleGeneral(lead, conv, cfg, preview) {
  if (preview) await recordFreeText(lead, preview, lead.flowStep || 'general', null);
  await notifySalesRep(
    `💬 Message from ${lead.name || lead.phone} (${routeLabelText(lead.route)}) — "${preview}"\n→ wa.me/${lead.phone}`
  );
  const body = 'Thanks — our team will follow up with you shortly.';
  await sendButtons(lead.phone, body, [{ id: 'main_menu', title: 'Main menu' }]);
  return logOutbound(conv, lead.phone, body, { kind: 'buttons', buttons: ['Main menu'] });
}

// ── Sales brief (every stored signal, per the V2 spec) ──────────────────────
export function buildSalesBrief(lead, cfg) {
  const req = cfg ? requirementLabel(cfg, lead.requirement) : lead.requirementLabel;
  const label = (id, options) => findOption(options, id)?.label || id || '—';
  const q = cfg?.qualification || {};
  return [
    `${routeLabelText(lead.route)} — ${lead.name || lead.profileName || 'Unknown'}, ${lead.company || 'Unknown company'}`,
    lead.email ? `Email: ${lead.email}` : null,
    `WhatsApp: ${lead.phone}`,
    `Source: ${lead.source || lead.channel || 'unknown'}${lead.campaign ? ` (${lead.campaign})` : ''}`,
    `Requirement: ${req || '—'}`,
    `Trigger: ${label(lead.trigger, q.Q1?.options)}`,
    `Timeline: ${label(lead.timeline, q.Q2?.options)}`,
    `Role: ${label(lead.role, q.Q3?.options)}`,
    `Context: ${lead.contextAnswerLabel || lead.contextAnswer || '—'}`,
    `Fit: ${lead.fit || '—'} · Intent: ${lead.intent || '—'} · Urgency: ${lead.urgency || '—'}`,
    `Route: ${routeLabelText(lead.route)}${lead.routeReason ? ` — ${lead.routeReason}` : ''}`,
    lead.humanRequested ? 'Requested a specialist: yes' : null,
    lead.bookingSlot ? `Requested slot: ${lead.bookingSlot}` : null,
    lead.callbackTime ? `Callback: ${lead.callbackTime}` : null,
    lead.needsHumanReview ? `⚠️ Needs review: ${lead.reviewReason || 'flagged'}` : null,
    `First message: "${lead.firstMessage || '—'}"`,
    `→ wa.me/${lead.phone}`,
  ].filter(Boolean).join('\n');
}

// ── Utilities ───────────────────────────────────────────────────────────────
function hasReferral(r) { return Boolean(r && (r.sourceId || r.sourceUrl || r.headline)); }

// ── Delivery receipts ───────────────────────────────────────────────────────
export async function handleStatus(status) {
  try {
    const { id, status: s } = status;
    if (id && s) await Message.findOneAndUpdate({ waMessageId: id }, { $set: { status: s } });
  } catch {}
}
