/**
 * CloudSwift WhatsApp chatbot engine.
 *
 * Flow: ENTRY → A0 (service picker Flow) → A1 → Q1..Q4 → score → HOT/WARM/COLD
 * Safety nets: X1 invalid input · X2 drop-off resume (nurture cron) · X3 STOP · X4 human takeover.
 */
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Setting from '../models/Setting.js';
import FlowAsset from '../models/FlowAsset.js';
import { scoreLead } from './scoring.js';
import { emitLead, emitLeadUpdate, emitMessage } from './eventBus.js';
import logger from './logger.js';
import { sendText, sendButtons, sendImage, markRead } from './metaCloud.js';
import { sendServiceFlow, sendQualifyFlow, sendContactFlow, sendBookingFlow } from './flowService.js';
import {
  WELCOME_BODY, VALID_TOPICS,
  A1_BODY, A1_BUTTONS,
  Q1_BODY, Q1_BUTTONS, SIZE_MAP,
  Q2_BODY, Q2_BUTTONS, SITUATION_MAP,
  Q3_BODY, Q3_BUTTONS, TIMELINE_MAP,
  Q4_BODY, Q4_BUTTONS, ROLE_MAP,
  A_H_BODY, H1_BODY, H2_BODY, H2_BUTTONS, H3_BODY, H4_BODY, H11_BODY,
  HOT_CHAT_HANDOFF, HOT_SALES_BRIEF,
  A_W_BODY, N1_BODY, N1_BUTTONS, WARM_CONFIRM, X6_BODY,
  A_C_BODY, COLD_BUTTONS, COLD_FINISH_BODY,
  X1_BODY, X1_BUTTONS, X3_STOP_BODY,
  GENERAL_BODY, GENERAL_BUTTONS, BOOKING_CONFIRM,
  isStopKeyword, isPositiveReply,
} from './flowMessages.js';

const RESUME_HOURS = Number(process.env.RESUME_HOURS || 20);

// ── Small helpers ─────────────────────────────────────────────────────────────
async function getSetting(key, fallback = '') {
  try { const s = await Setting.findOne({ key }); return s?.value || fallback; }
  catch { return fallback; }
}
async function assetUrl(key) {
  try { const a = await FlowAsset.findOne({ key }); return a?.url || ''; }
  catch { return ''; }
}
function setAwaiting(lead) {
  lead.resumeAt = new Date(Date.now() + RESUME_HOURS * 3600 * 1000);
  lead.resumeNudgeSent = false;
}
function clearAwaiting(lead) {
  lead.resumeAt = undefined;
  lead.resumeNudgeSent = false;
}

async function upsertConversation(phone, name, lastMessage) {
  return Conversation.findOneAndUpdate(
    { phone },
    { $set: { name: name || undefined, lastMessage, lastMessageAt: new Date() }, $inc: { unreadCount: 1 } },
    { upsert: true, new: true }
  );
}
async function logMessage(phone, convId, direction, type, body, waMessageId, rawPayload) {
  try {
    const msg = await Message.create({
      phone, conversationId: convId, direction, type,
      body: body || '', waMessageId: waMessageId || '', rawPayload,
      status: direction === 'inbound' ? 'received' : 'sent',
    });
    emitMessage(msg);
    return msg;
  } catch (err) { logger.warn('logMessage failed', { error: err.message }); }
}
async function notifySalesRep(text) {
  const repNumber = await getSetting('salesRepWaNumber', process.env.SALES_REP_WA_NUMBER || '');
  if (!repNumber) { logger.warn('Sales rep WA number not configured'); return; }
  try { await sendText(repNumber, text); }
  catch (err) { logger.error('Sales rep notification failed', { error: err.message }); }
}

// ── Main entry point ────────────────────────────────────────────────────────
export async function handleMessage(msg) {
  const { phone, type, text, selectedId, name, waMessageId, rawPayload, referral, flowResponse } = msg;

  if (waMessageId) markRead(waMessageId).catch(() => {});

  const preview = text || selectedId || (flowResponse ? '[flow submitted]' : '…');
  const conv = await upsertConversation(phone, name, preview);
  await logMessage(phone, conv._id, 'inbound', type, preview, waMessageId, rawPayload);

  // X4 · Human takeover — bot stays silent
  if (conv.botPaused) { logger.info('Bot paused (human handling)', { phone }); return; }

  // X3 · STOP / opt-out
  if (type === 'text' && isStopKeyword(text)) { return optOut(phone, conv); }

  let lead = await Lead.findOne({ phone });

  // Opted-out contact: stay silent unless they clearly restart
  if (conv.optedOut || lead?.optedOut) {
    const restart = type === 'text' && /^(hi|hello|start|menu|hey)\b/i.test((text || '').trim());
    if (!restart) return;
    await Conversation.updateOne({ phone }, { $set: { optedOut: false } });
    if (lead) { lead.optedOut = false; await lead.save(); }
  }

  // ── New contact → ENTRY ─────────────────────────────────────────────────
  if (!lead) {
    lead = await Lead.create({
      phone,
      name: name || '',
      firstMessage: text || '',
      flowStep: 'entry',
      score: 'NEW',
      channel: hasReferral(referral) ? 'meta_ctwa' : 'direct',
      referral: referral || {},
    });
    emitLead(lead);
    return startFlow(lead, conv);
  }

  // Capture ad referral if it arrived on a later message and wasn't stored
  if (hasReferral(referral) && !lead.referral?.sourceId && !lead.referral?.sourceUrl) {
    lead.referral = referral;
    lead.channel = 'meta_ctwa';
    await lead.save();
  }

  // ── Global commands (work at any step) ──────────────────────────────────
  if (selectedId === 'x_menu' || selectedId === 'cold_menu') return startFlow(lead, conv);
  if (selectedId === 'a1_talk_person') { lead.talkToPerson = true; await lead.save(); return goHot(lead, conv, 'Requested a person'); }
  if (selectedId === 'x_retry' || selectedId === 'x_resume') return resendStep(lead, conv);

  // ── Flow submission ────────────────────────────────────────────────────
  if (type === 'flow' && flowResponse) {
    // Booking form: business_name / phone_number ; contact form: company + email/full_name
    // qualification: size/situation/timeline/role ; service picker: service
    if (flowResponse.business_name || flowResponse.phone_number || flowResponse.whatsapp_number) {
      return handleBookingSubmission(lead, conv, flowResponse);
    }
    if (flowResponse.email || flowResponse.full_name) {
      return handleContactSubmission(lead, conv, flowResponse);
    }
    if (flowResponse.company_size || flowResponse.situation || flowResponse.timeline || flowResponse.role) {
      return handleQualifySubmission(lead, conv, flowResponse);
    }
    return handleServiceSelection(lead, conv, flowResponse);
  }

  // Nurture re-entry: a positive reply during/after nurture → escalate to HOT
  if (['warm_checklist', 'n1_sent', 'nurture_d3', 'nurture_d7', 'nurture_d21', 'warm_declined'].includes(lead.flowStep)
      && type === 'text' && isPositiveReply(text)) {
    return goHot(lead, conv, 'Positive reply during nurture');
  }

  // ── Route by current step ────────────────────────────────────────────────
  switch (lead.flowStep) {
    case 'entry':
    case 'a0_sent':                return handleInvalid(lead, conv, 'a0');
    case 'a1_sent':                return handleA1(lead, conv, selectedId);
    case 'qualify_sent':           return handleInvalid(lead, conv, 'qualify');
    case 'q1_sent':                return handleQ1(lead, conv, selectedId);
    case 'q2_sent':                return handleQ2(lead, conv, selectedId);
    case 'q3_sent':                return handleQ3(lead, conv, selectedId);
    case 'q4_sent':                return handleQ4(lead, conv, selectedId);
    case 'awaiting_name_company':  return handleNameCompany(lead, conv, text);
    case 'h2_sent':                return handleH2(lead, conv, selectedId);
    case 'awaiting_booking':       return handleInvalid(lead, conv, 'booking');
    case 'awaiting_callback_time': return handleCallbackTime(lead, conv, text);
    case 'n1_sent':                return handleN1(lead, conv, selectedId);
    case 'cold_guide':             return handleCold(lead, conv, selectedId);
    default:                       return handleGeneral(lead, conv, preview);
  }
}

// ── ENTRY / restart ───────────────────────────────────────────────────────
async function startFlow(lead, conv) {
  lead.flowStep = 'a0_sent';
  lead.invalidCount = 0;
  setAwaiting(lead);
  await lead.save();
  const sent = await sendServiceFlow(lead.phone, lead.name);
  if (!sent) {
    // Fallback if the Flow isn't configured — plain text prompt
    await sendText(lead.phone, WELCOME_BODY(lead.name) + '\n\nReply with the service you need: Azure, Microsoft 365, Managed cloud, Security, or Other.');
  }
  await logOutbound(conv, lead.phone, '[A0 service picker sent]');
}

// ── A0 · service selected in the Flow ───────────────────────────────────────
async function handleServiceSelection(lead, conv, flowResponse) {
  const service = String(flowResponse.service || flowResponse.topic || flowResponse.selected_service || '').trim();
  if (!VALID_TOPICS.includes(service)) return handleInvalid(lead, conv, 'a0');

  lead.topic = service;
  lead.flowStep = 'a1_sent';
  lead.invalidCount = 0;
  setAwaiting(lead);
  await lead.save();
  await sendA1(lead.phone);
  await logOutbound(conv, lead.phone, A1_BODY);
}

// Send the A1 (Continue / Talk to a person) message with its optional image header
async function sendA1(phone) {
  const img = await assetUrl('a1_header');
  return sendButtons(phone, A1_BODY, A1_BUTTONS, img || '');
}
// H2 (Book / Callback / Chat) with optional image header
async function sendH2(phone, name) {
  const img = await assetUrl('h2_header');
  return sendButtons(phone, H2_BODY(name || 'there'), H2_BUTTONS, img || '');
}
// N1 (warm nurture permission) with optional image header
async function sendN1(phone) {
  const img = await assetUrl('n1_header');
  return sendButtons(phone, N1_BODY, N1_BUTTONS, img || '');
}

// ── A1 · Continue / Talk to a person ─────────────────────────────────────────
async function handleA1(lead, conv, selectedId) {
  if (selectedId === 'a1_continue') {
    // Send the qualification Flow (size + conditional situation/timeline/role in one form).
    // 500+ hides the rest inside the Flow and we skip to HOT on submit. Buttons are the fallback.
    let sentFlow = false;
    try { sentFlow = await sendQualifyFlow(lead.phone, lead.name); }
    catch (e) { logger.warn('Qualify flow send failed, falling back to buttons', { error: e.message }); }
    lead.invalidCount = 0;
    if (sentFlow) {
      lead.flowStep = 'qualify_sent';
      setAwaiting(lead);
      await lead.save();
      return logOutbound(conv, lead.phone, '[qualification flow sent]');
    }
    lead.flowStep = 'q1_sent';
    setAwaiting(lead);
    await lead.save();
    await sendButtons(lead.phone, Q1_BODY, Q1_BUTTONS);
    return logOutbound(conv, lead.phone, Q1_BODY);
  }
  // a1_talk_person handled globally
  return handleInvalid(lead, conv, 'a1');
}

// ── Qualification Flow submission (all 4 answers at once) ────────────────────
async function handleQualifySubmission(lead, conv, resp) {
  const sizes  = ['under_100', '100_500', '500_plus'];
  const sits   = ['exploring', 'first_eval', 'switching'];
  const times  = ['this_quarter', 'next_quarter', 'six_months'];
  const roles  = ['decision_maker', 'evaluating_team'];

  if (sizes.includes(resp.company_size)) lead.companySize = resp.company_size;
  lead.invalidCount = 0;

  // 500+ hid the rest of the questions inside the flow → skip straight to HOT
  if (lead.companySize === '500_plus') {
    await lead.save();
    return goHot(lead, conv, 'Enterprise (500+) — skipped Q2-Q4');
  }

  if (sits.includes(resp.situation))  lead.situation = resp.situation;
  if (times.includes(resp.timeline))  lead.timeline  = resp.timeline;
  if (roles.includes(resp.role))      lead.role      = resp.role;

  if (!lead.companySize || !lead.situation || !lead.timeline || !lead.role) {
    return handleInvalid(lead, conv, 'qualify');
  }

  lead.invalidCount = 0;
  const score = scoreLead({
    companySize: lead.companySize, situation: lead.situation,
    timeline: lead.timeline, role: lead.role, talkToPerson: lead.talkToPerson,
  });
  lead.score = score;
  lead.scoreTimestamp = new Date();
  lead.flowStep = 'scored';
  await lead.save();
  emitLeadUpdate(lead);

  if (score === 'HOT')  return goHot(lead, conv, 'Qualified HOT (flow)');
  if (score === 'WARM') return goWarm(lead, conv);
  return goCold(lead, conv);
}

// ── Q1 · company size (500+ short-circuits to HOT) ───────────────────────────
async function handleQ1(lead, conv, selectedId) {
  const size = SIZE_MAP[selectedId];
  if (!size) return handleInvalid(lead, conv, 'q1');
  lead.companySize = size;
  lead.invalidCount = 0;
  // 500+ → skip the rest of the questions and go straight to HOT
  if (size === '500_plus') { await lead.save(); return goHot(lead, conv, 'Enterprise (500+) — skipped Q2-Q4'); }

  // Otherwise collect situation/timeline/role via the multi-screen Flow (buttons fallback)
  let sentFlow = false;
  try { sentFlow = await sendQualifyFlow(lead.phone, lead.name); }
  catch (e) { logger.warn('Qualify flow send failed, falling back to buttons', { error: e.message }); }
  if (sentFlow) {
    lead.flowStep = 'qualify_sent';
    setAwaiting(lead);
    await lead.save();
    return logOutbound(conv, lead.phone, '[qualification flow sent]');
  }
  lead.flowStep = 'q2_sent';
  setAwaiting(lead);
  await lead.save();
  await sendButtons(lead.phone, Q2_BODY, Q2_BUTTONS);
  return logOutbound(conv, lead.phone, Q2_BODY);
}

// ── Q2 · situation ───────────────────────────────────────────────────────────
async function handleQ2(lead, conv, selectedId) {
  const situation = SITUATION_MAP[selectedId];
  if (!situation) return handleInvalid(lead, conv, 'q2');
  lead.situation = situation;
  lead.invalidCount = 0;
  lead.flowStep = 'q3_sent';
  setAwaiting(lead);
  await lead.save();
  await sendButtons(lead.phone, Q3_BODY, Q3_BUTTONS);
  return logOutbound(conv, lead.phone, Q3_BODY);
}

// ── Q3 · timeline ────────────────────────────────────────────────────────────
async function handleQ3(lead, conv, selectedId) {
  const timeline = TIMELINE_MAP[selectedId];
  if (!timeline) return handleInvalid(lead, conv, 'q3');
  lead.timeline = timeline;
  lead.invalidCount = 0;
  lead.flowStep = 'q4_sent';
  setAwaiting(lead);
  await lead.save();
  await sendButtons(lead.phone, Q4_BODY, Q4_BUTTONS);
  return logOutbound(conv, lead.phone, Q4_BODY);
}

// ── Q4 · role → score ────────────────────────────────────────────────────────
async function handleQ4(lead, conv, selectedId) {
  const role = ROLE_MAP[selectedId];
  if (!role) return handleInvalid(lead, conv, 'q4');
  lead.role = role;
  lead.invalidCount = 0;

  const score = scoreLead({
    companySize: lead.companySize, situation: lead.situation,
    timeline: lead.timeline, role: lead.role, talkToPerson: lead.talkToPerson,
  });
  lead.score = score;
  lead.scoreTimestamp = new Date();
  lead.flowStep = 'scored';
  await lead.save();
  emitLeadUpdate(lead);

  if (score === 'HOT')  return goHot(lead, conv, 'Qualified HOT');
  if (score === 'WARM') return goWarm(lead, conv);
  return goCold(lead, conv);
}

// ── HOT path ─────────────────────────────────────────────────────────────────
async function goHot(lead, conv, reason = '') {
  lead.score = 'HOT';
  lead.scoreTimestamp = new Date();
  lead.status = 'Contacted';
  lead.flowStep = 'awaiting_name_company';
  setAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { label: 'hot', leadId: lead._id } });

  await sendText(lead.phone, A_H_BODY);
  // Collect name + company + email via a native form flow; fall back to a text prompt
  let sentForm = false;
  try { sentForm = await sendContactFlow(lead.phone, lead.name); }
  catch (e) { logger.warn('Contact flow send failed, falling back to text', { error: e.message }); }
  if (!sentForm) {
    const img = await assetUrl('hot_lead_header');
    if (img) await sendImage(lead.phone, img, H1_BODY);
    else     await sendText(lead.phone, H1_BODY);
  }
  await logOutbound(conv, lead.phone, `${A_H_BODY} | [contact form]`);
  logger.info('HOT lead', { phone: lead.phone, reason });
}

// ── Contact form (name / company / email) submission ─────────────────────────
async function handleContactSubmission(lead, conv, resp) {
  if (resp.full_name) lead.name    = String(resp.full_name).slice(0, 120);
  if (resp.company)   lead.company = String(resp.company).slice(0, 120);
  if (resp.email)     lead.email   = String(resp.email).slice(0, 160);
  lead.flowStep = 'h2_sent';
  lead.invalidCount = 0;
  setAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { name: lead.name || undefined, company: lead.company || undefined } });
  await notifySalesRep(HOT_SALES_BRIEF(lead));
  await sendH2(lead.phone, lead.name);
  return logOutbound(conv, lead.phone, H2_BODY(lead.name || 'there'));
}

async function handleNameCompany(lead, conv, text) {
  const parsed = parseNameCompany(text);
  if (parsed.name) lead.name = parsed.name;
  if (parsed.company) lead.company = parsed.company;
  lead.flowStep = 'h2_sent';
  lead.invalidCount = 0;
  setAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { name: lead.name || undefined, company: lead.company || undefined } });

  // Full brief to sales rep now that we have identity
  await notifySalesRep(HOT_SALES_BRIEF(lead));

  await sendH2(lead.phone, lead.name);
  return logOutbound(conv, lead.phone, H2_BODY(lead.name || 'there'));
}

// ── Booking form submission (name / business / phone / email) ────────────────
async function handleBookingSubmission(lead, conv, resp) {
  if (resp.full_name)     lead.name     = String(resp.full_name).slice(0, 120);
  if (resp.business_name) lead.company  = String(resp.business_name).slice(0, 120);
  if (resp.email)         lead.email    = String(resp.email).slice(0, 160);
  if (resp.phone_number)  lead.altPhone = String(resp.phone_number).slice(0, 40);
  lead.flowStep = 'booking_sent';
  lead.status = 'Contacted';
  lead.invalidCount = 0;
  clearAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { name: lead.name || undefined, company: lead.company || undefined, label: 'hot' } });

  const salesRepName = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'Our team');
  await notifySalesRep(`${HOT_SALES_BRIEF(lead, 'Booked a call — details submitted')}\nPhone: ${lead.altPhone || '—'}`);
  await sendText(lead.phone, BOOKING_CONFIRM(lead.name, salesRepName));
  return logOutbound(conv, lead.phone, BOOKING_CONFIRM(lead.name, salesRepName));
}

async function handleH2(lead, conv, selectedId) {
  if (selectedId === 'hot_book') {
    // Open the booking form flow to collect details (no Calendly link)
    let sent = false;
    try { sent = await sendBookingFlow(lead.phone, lead.name); }
    catch (e) { logger.warn('Booking flow send failed', { error: e.message }); }
    if (sent) {
      lead.flowStep = 'awaiting_booking';
      setAwaiting(lead);
      await lead.save();
      return logOutbound(conv, lead.phone, '[booking form sent]');
    }
    // Fallback if the booking flow isn't configured — Calendly link
    const salesRepName = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'our solutions team');
    const calendlyLink = await getSetting('calendlyLink', 'https://calendly.com/cloudswift');
    lead.calendlyLink = calendlyLink;
    lead.flowStep = 'booking_sent';
    lead.status = 'Contacted';
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    const img = await assetUrl('calendly_header');
    if (img) await sendImage(lead.phone, img, H3_BODY(salesRepName, calendlyLink));
    else     await sendText(lead.phone, H3_BODY(salesRepName, calendlyLink));
    await notifySalesRep(HOT_SALES_BRIEF(lead, 'Chose: Book a call (Calendly sent)'));
    return logOutbound(conv, lead.phone, H3_BODY(salesRepName, calendlyLink));
  }
  if (selectedId === 'hot_callback') {
    lead.flowStep = 'awaiting_callback_time';
    setAwaiting(lead);
    await lead.save();
    await sendText(lead.phone, H4_BODY);
    return logOutbound(conv, lead.phone, H4_BODY);
  }
  if (selectedId === 'hot_chat') {
    const salesRepName = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'our team');
    lead.flowStep = 'human_handoff';
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    await Conversation.updateOne({ phone: lead.phone }, { $set: { botPaused: true } });
    await sendText(lead.phone, HOT_CHAT_HANDOFF(salesRepName));
    await notifySalesRep(HOT_SALES_BRIEF(lead, '⚡ Wants to CHAT NOW — bot paused, please jump in'));
    return logOutbound(conv, lead.phone, HOT_CHAT_HANDOFF(salesRepName));
  }
  return handleInvalid(lead, conv, 'h2');
}

async function handleCallbackTime(lead, conv, text) {
  lead.callbackTime = (text || '').slice(0, 200);
  lead.flowStep = 'callback_ack';
  clearAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  const salesRepName = await getSetting('salesRepName', process.env.SALES_REP_NAME || 'Our team');
  await sendText(lead.phone, H11_BODY(salesRepName));
  await notifySalesRep(HOT_SALES_BRIEF(lead, `Requested callback: ${lead.callbackTime}`));
  return logOutbound(conv, lead.phone, H11_BODY(salesRepName));
}

// ── WARM path ────────────────────────────────────────────────────────────────
async function goWarm(lead, conv) {
  lead.status = 'Nurturing';
  lead.flowStep = 'n1_sent';
  setAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { label: 'warm', leadId: lead._id } });

  const img = await assetUrl('nurture_header');
  const body = A_W_BODY(lead.topic);
  if (img) await sendImage(lead.phone, img, body);
  else     await sendText(lead.phone, body);
  await sendN1(lead.phone);
  return logOutbound(conv, lead.phone, `${body} | ${N1_BODY}`);
}

async function handleN1(lead, conv, selectedId) {
  if (selectedId === 'warm_yes') {
    const now = Date.now();
    lead.flowStep = 'nurture_d3';
    lead.status = 'Nurturing';
    lead.nurtureD3At  = new Date(now + 3  * 864e5);
    lead.nurtureD7At  = new Date(now + 7  * 864e5);
    lead.nurtureD21At = new Date(now + 21 * 864e5);
    lead.nurtureD3Sent = lead.nurtureD7Sent = lead.nurtureD21Sent = false;
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    await sendText(lead.phone, WARM_CONFIRM(lead.name || 'there'));
    return logOutbound(conv, lead.phone, WARM_CONFIRM(lead.name || 'there'));
  }
  if (selectedId === 'warm_no') {
    lead.flowStep = 'warm_declined';
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    await sendText(lead.phone, X6_BODY);
    return logOutbound(conv, lead.phone, X6_BODY);
  }
  return handleInvalid(lead, conv, 'n1');
}

// ── COLD path ────────────────────────────────────────────────────────────────
async function goCold(lead, conv) {
  lead.status = 'Lost';
  lead.flowStep = 'cold_guide';
  setAwaiting(lead);
  await lead.save();
  emitLeadUpdate(lead);
  await Conversation.updateOne({ phone: lead.phone }, { $set: { label: 'cold', leadId: lead._id } });
  const img = await assetUrl('thank_you_header');
  const body = A_C_BODY(lead.topic);
  await sendButtons(lead.phone, body, COLD_BUTTONS, img || '');
  return logOutbound(conv, lead.phone, body);
}

async function handleCold(lead, conv, selectedId) {
  if (selectedId === 'cold_finish') {
    lead.flowStep = 'cold_exit';
    lead.status = 'Lost';
    clearAwaiting(lead);
    await lead.save();
    emitLeadUpdate(lead);
    await sendText(lead.phone, COLD_FINISH_BODY);
    return logOutbound(conv, lead.phone, COLD_FINISH_BODY);
  }
  // cold_menu handled globally
  return handleInvalid(lead, conv, 'cold');
}

// ── Safety net X1 · invalid input ────────────────────────────────────────────
async function handleInvalid(lead, conv, at) {
  lead.invalidCount = (lead.invalidCount || 0) + 1;
  // After repeated failures, offer a person more directly (still via X1 buttons)
  setAwaiting(lead);
  await lead.save();
  const img = await assetUrl('x1_header');
  await sendButtons(lead.phone, X1_BODY, X1_BUTTONS, img || '');
  return logOutbound(conv, lead.phone, X1_BODY);
}

// ── Resend current step (x_retry / x_resume) ─────────────────────────────────
async function resendStep(lead, conv) {
  setAwaiting(lead);
  await lead.save();
  switch (lead.flowStep) {
    case 'entry':
    case 'a0_sent':                return startFlow(lead, conv);
    case 'a1_sent':                return void (await sendA1(lead.phone));
    case 'qualify_sent':           return void (await sendQualifyFlow(lead.phone, lead.name));
    case 'q1_sent':                return void (await sendButtons(lead.phone, Q1_BODY, Q1_BUTTONS));
    case 'q2_sent':                return void (await sendButtons(lead.phone, Q2_BODY, Q2_BUTTONS));
    case 'q3_sent':                return void (await sendButtons(lead.phone, Q3_BODY, Q3_BUTTONS));
    case 'q4_sent':                return void (await sendButtons(lead.phone, Q4_BODY, Q4_BUTTONS));
    case 'awaiting_name_company':  { const ok = await sendContactFlow(lead.phone, lead.name); if (!ok) await sendText(lead.phone, H1_BODY); return; }
    case 'h2_sent':                return void (await sendH2(lead.phone, lead.name));
    case 'awaiting_booking':       return void (await sendBookingFlow(lead.phone, lead.name));
    case 'awaiting_callback_time': return void (await sendText(lead.phone, H4_BODY));
    case 'n1_sent':                return void (await sendN1(lead.phone));
    case 'cold_guide':             return goCold(lead, conv);
    default:                       return startFlow(lead, conv);
  }
}

// ── General/terminal-state message ───────────────────────────────────────────
async function handleGeneral(lead, conv, preview) {
  await notifySalesRep(`💬 Message from ${lead.name || lead.phone} (${lead.score}) — "${preview}"\n→ wa.me/${lead.phone}`);
  const img = await assetUrl('general_header');
  await sendButtons(lead.phone, GENERAL_BODY, GENERAL_BUTTONS, img || '');
  return logOutbound(conv, lead.phone, GENERAL_BODY);
}

// ── X3 · opt-out ─────────────────────────────────────────────────────────────
async function optOut(phone, conv) {
  await Conversation.updateOne({ phone }, { $set: { optedOut: true } });
  const lead = await Lead.findOne({ phone });
  if (lead) {
    lead.optedOut = true;
    lead.nurtureD3Sent = lead.nurtureD7Sent = lead.nurtureD21Sent = true; // cancel pending nurture
    clearAwaiting(lead);
    lead.flowStep = 'opted_out';
    await lead.save();
    emitLeadUpdate(lead);
  }
  await sendText(phone, X3_STOP_BODY);
  if (conv?._id) await logMessage(phone, conv._id, 'outbound', 'text', X3_STOP_BODY, '', null);
  logger.info('Contact opted out', { phone });
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function hasReferral(r) { return Boolean(r && (r.sourceId || r.sourceUrl || r.headline)); }

function parseNameCompany(text = '') {
  const t = (text || '').trim();
  if (!t) return { name: '', company: '' };
  let sep = null;
  if (t.includes(',')) sep = ',';
  else if (/\s+at\s+/i.test(t)) sep = ' at ';
  else if (t.includes(' - ')) sep = ' - ';
  else if (t.includes('|')) sep = '|';
  if (sep) {
    const parts = sep === ' at ' ? t.split(/\s+at\s+/i) : t.split(sep);
    return { name: (parts[0] || '').trim(), company: (parts.slice(1).join(sep) || '').trim() };
  }
  return { name: t, company: '' };
}

async function logOutbound(conv, phone, body) {
  try {
    if (conv?._id) await logMessage(phone, conv._id, 'outbound', 'text', body, '', null);
    await Conversation.updateOne({ phone }, { $set: { lastMessage: body.slice(0, 120), lastMessageAt: new Date() } });
  } catch {}
}

// ── Status update handler (delivery receipts) ────────────────────────────────
export async function handleStatus(status) {
  try {
    const { id, status: s } = status;
    if (id && s) await Message.findOneAndUpdate({ waMessageId: id }, { $set: { status: s } });
  } catch {}
}
