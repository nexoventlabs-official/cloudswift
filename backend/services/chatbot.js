/**
 * CloudSwift WhatsApp chatbot engine.
 * Handles every inbound message, advances flow state, scores leads,
 * notifies sales rep, and schedules warm nurture.
 */

import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Setting from '../models/Setting.js';
import { scoreLead } from './scoring.js';
import { emitLead, emitLeadUpdate, emitMessage } from './eventBus.js';
import logger from './logger.js';
import {
  sendText, sendButtons, sendList, markRead
} from './metaCloud.js';
import {
  FLOW1_BODY, FLOW1_LIST_SECTIONS,
  FLOW2_Q1_BODY, FLOW2_Q1_BUTTONS,
  FLOW2_Q2_BODY, FLOW2_Q2_BUTTONS,
  FLOW2_Q3_BODY, FLOW2_Q3_BUTTONS,
  HOT_PROSPECT_MSG, HOT_SALES_BRIEF, PRE_CALL_BRIEF,
  NURTURE_D3, NURTURE_D7, NURTURE_D21, COLD_EXIT,
  TOPIC_MAP, SIZE_MAP, SITUATION_MAP, TIMELINE_MAP,
} from './flowMessages.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getSetting(key, fallback = '') {
  try {
    const s = await Setting.findOne({ key });
    return s?.value || fallback;
  } catch { return fallback; }
}

async function upsertConversation(phone, name, lastMessage) {
  return Conversation.findOneAndUpdate(
    { phone },
    {
      $set: { name: name || undefined, lastMessage, lastMessageAt: new Date() },
      $inc: { unreadCount: 1 },
    },
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
  } catch (err) {
    logger.warn('logMessage failed', { error: err.message });
  }
}

async function notifySalesRep(text) {
  const repNumber = await getSetting('salesRepWaNumber', process.env.SALES_REP_WA_NUMBER || '');
  if (!repNumber) { logger.warn('Sales rep WA number not configured'); return; }
  try {
    await sendText(repNumber, text);
  } catch (err) {
    logger.error('Sales rep notification failed', { error: err.message });
  }
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function handleMessage(msg) {
  const { phone, type, text, selectedId, name, waMessageId, rawPayload } = msg;

  // Mark as read immediately
  if (waMessageId) markRead(waMessageId).catch(() => {});

  // Upsert conversation
  const conv = await upsertConversation(phone, name, text || selectedId || '…');

  // Log inbound message
  await logMessage(phone, conv._id, 'inbound', type, text || selectedId, waMessageId, rawPayload);

  // Find or create lead
  let lead = await Lead.findOne({ phone });

  // ── New contact ── ────────────────────────────────────────────────────────
  if (!lead) {
    lead = await Lead.create({
      phone,
      name: name || '',
      firstMessage: text || '',
      flowStep: 'flow1_sent',
      score: 'NEW',
    });
    emitLead(lead);

    // Send Flow 1 — first response
    await sendList(
      phone,
      FLOW1_BODY(name),
      'Select challenge',
      FLOW1_LIST_SECTIONS
    );
    return;
  }

  // ── Warm nurture — any positive reply re-enters HOT path ─────────────────
  if (['nurture_d3', 'nurture_d7', 'nurture_d21'].includes(lead.flowStep)) {
    const positive = isPositiveReply(text, selectedId);
    if (positive) {
      await escalateToHot(lead, conv);
      return;
    }
  }

  // ── Cold exit — any reply → notify sales rep ──────────────────────────────
  if (lead.flowStep === 'cold_exit') {
    await notifySalesRep(
      `📩 Cold lead replied — ${lead.name || phone}\n\nMessage: "${text || selectedId}"\n\n→ wa.me/${phone}`
    );
    await sendText(phone, `Thanks for getting back in touch! Our team will reach out to you shortly.`);
    return;
  }

  // ── Flow already scored / completed ──────────────────────────────────────
  if (['scored', 'calendly_sent', 'call_booked', 'pre_call_brief', 'closed_won', 'completed'].includes(lead.flowStep)) {
    // General reply — log it, notify sales rep if needed
    await notifySalesRep(
      `💬 Message from existing lead — ${lead.name || phone} (${lead.score})\n\nMessage: "${text || selectedId}"\n\n→ wa.me/${phone}`
    );
    return;
  }

  // ── Flow 1 — received topic selection ────────────────────────────────────
  if (lead.flowStep === 'flow1_sent') {
    let topic = TOPIC_MAP[selectedId] || null;
    if (!topic && text) {
      // Free text — map to 'other'
      topic = 'other';
    }
    if (topic) {
      lead.topic = topic;
      lead.flowStep = 'flow2_q1';
      await lead.save();

      // Send Q1 — company size (3 buttons + "2000+" as 4th)
      await sendButtons(phone, FLOW2_Q1_BODY, [
        ...FLOW2_Q1_BUTTONS,
        { id: 'size_2000_plus', title: '2,000+' },
      ]);
    } else {
      // Re-send Flow 1 if no valid selection
      await sendList(phone, FLOW1_BODY(lead.name), 'Select challenge', FLOW1_LIST_SECTIONS);
    }
    return;
  }

  // ── Flow 2 Q1 — company size ─────────────────────────────────────────────
  if (lead.flowStep === 'flow2_q1') {
    const size = SIZE_MAP[selectedId] || null;
    if (size) {
      lead.companySize = size;
      lead.flowStep = 'flow2_q2';
      await lead.save();
      await sendButtons(phone, FLOW2_Q2_BODY, [
        ...FLOW2_Q2_BUTTONS,
        { id: 'sit_exploring', title: 'Just exploring' },
      ]);
    } else {
      await sendButtons(phone, FLOW2_Q1_BODY, [
        ...FLOW2_Q1_BUTTONS,
        { id: 'size_2000_plus', title: '2,000+' },
      ]);
    }
    return;
  }

  // ── Flow 2 Q2 — situation ─────────────────────────────────────────────────
  if (lead.flowStep === 'flow2_q2') {
    const situation = SITUATION_MAP[selectedId] || null;
    if (situation) {
      lead.situation = situation;
      lead.flowStep = 'flow2_q3';
      await lead.save();
      await sendButtons(phone, FLOW2_Q3_BODY, [
        ...FLOW2_Q3_BUTTONS,
        { id: 'tl_researching', title: 'Just researching' },
      ]);
    } else {
      await sendButtons(phone, FLOW2_Q2_BODY, [
        ...FLOW2_Q2_BUTTONS,
        { id: 'sit_exploring', title: 'Just exploring' },
      ]);
    }
    return;
  }

  // ── Flow 2 Q3 — timeline ──────────────────────────────────────────────────
  if (lead.flowStep === 'flow2_q3') {
    const timeline = TIMELINE_MAP[selectedId] || null;
    if (timeline) {
      lead.timeline = timeline;

      // Score the lead
      const score = scoreLead({
        companySize: lead.companySize,
        situation:   lead.situation,
        timeline:    lead.timeline,
      });
      lead.score          = score;
      lead.scoreTimestamp = new Date();
      lead.flowStep       = 'scored';
      await lead.save();
      emitLeadUpdate(lead);

      if (score === 'HOT') {
        await handleHotLead(lead, conv);
      } else if (score === 'WARM') {
        await handleWarmLead(lead, conv);
      } else {
        await handleColdLead(lead, conv);
      }
    } else {
      await sendButtons(phone, FLOW2_Q3_BODY, [
        ...FLOW2_Q3_BUTTONS,
        { id: 'tl_researching', title: 'Just researching' },
      ]);
    }
    return;
  }

  // ── Fallback — restart from Flow 1 ───────────────────────────────────────
  await sendList(phone, FLOW1_BODY(lead.name), 'Select challenge', FLOW1_LIST_SECTIONS);
}

// ── HOT lead path ─────────────────────────────────────────────────────────────
async function handleHotLead(lead, conv) {
  const salesRepName  = await getSetting('salesRepName',  process.env.SALES_REP_NAME || 'our solutions team');
  const calendlyLink  = await getSetting('calendlyLink',  'https://calendly.com/cloudswift');

  lead.flowStep    = 'calendly_sent';
  lead.calendlyLink = calendlyLink;
  lead.status      = 'Contacted';
  await lead.save();

  // 1. Notify sales rep
  await notifySalesRep(HOT_SALES_BRIEF(lead));

  // 2. Confirm to prospect
  await sendText(lead.phone, HOT_PROSPECT_MSG(lead.name || 'there', salesRepName, calendlyLink));

  emitLeadUpdate(lead);
}

// ── WARM lead path ────────────────────────────────────────────────────────────
async function handleWarmLead(lead, conv) {
  const now = new Date();
  lead.flowStep   = 'nurture_d3';
  lead.status     = 'Nurturing';
  lead.nurtureD3At  = new Date(now.getTime() + 3  * 24 * 60 * 60 * 1000);
  lead.nurtureD7At  = new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000);
  lead.nurtureD21At = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  await lead.save();

  await sendText(lead.phone, `Thanks for your interest, ${lead.name || 'there'}! We'll be in touch in the next few days with some useful information. Feel free to reach out anytime in the meantime.`);
  emitLeadUpdate(lead);
}

// ── COLD lead path ────────────────────────────────────────────────────────────
async function handleColdLead(lead, conv) {
  lead.flowStep = 'cold_exit';
  lead.status   = 'Lost';
  await lead.save();

  await sendText(lead.phone, COLD_EXIT(lead.name || 'there'));
  emitLeadUpdate(lead);
}

// ── Escalate warm → hot (positive reply during nurture) ──────────────────────
async function escalateToHot(lead, conv) {
  lead.score          = 'HOT';
  lead.scoreTimestamp = new Date();
  lead.nurtureD3Sent  = true;
  lead.nurtureD7Sent  = true;
  lead.nurtureD21Sent = true;
  await lead.save();
  await handleHotLead(lead, conv);
}

// ── Positive reply detection ──────────────────────────────────────────────────
function isPositiveReply(text = '', selectedId = '') {
  const t = (text || '').toLowerCase().trim();
  const positive = ['yes', 'yeah', 'sure', 'ok', 'okay', 'interested', 'tell me more', 'want', 'book', 'send'];
  return positive.some((p) => t.includes(p));
}

// ── Status update handler (delivery receipts) ────────────────────────────────
export async function handleStatus(status) {
  try {
    const { id, status: s } = status;
    if (id && s) {
      await Message.findOneAndUpdate({ waMessageId: id }, { $set: { status: s } });
    }
  } catch {}
}

// ── Log inbound for CRM (called from webhook before handleMessage) ────────────
export async function logInbound(phone, name, type, body, waMessageId, rawPayload) {
  try {
    const conv = await Conversation.findOne({ phone });
    if (conv) {
      await logMessage(phone, conv._id, 'inbound', type, body, waMessageId, rawPayload);
    }
  } catch {}
}
