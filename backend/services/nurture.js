/**
 * Scheduler (runs every 30 min):
 *  - X2 drop-off resume nudges (leads that went silent mid-flow, session still open)
 *  - Warm nurture D3 / D7 / D21
 * All sends are skipped for opted-out contacts or conversations under human takeover.
 */
import cron from 'node-cron';
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import FlowAsset from '../models/FlowAsset.js';
import { sendText, sendButtons } from './metaCloud.js';
import {
  NURTURE_D3, NURTURE_D7, NURTURE_D21,
  X2_RESUME_BODY, X2_RESUME_BUTTONS,
} from './flowMessages.js';
import { emitLeadUpdate } from './eventBus.js';
import logger from './logger.js';

// Mid-flow steps eligible for a resume nudge
const AWAITING_STEPS = [
  'a0_sent', 'a1_sent', 'qualify_sent', 'q1_sent', 'q2_sent', 'q3_sent', 'q4_sent',
  'awaiting_name_company', 'h2_sent', 'awaiting_booking', 'awaiting_callback_time', 'n1_sent', 'cold_guide',
];

// Can we send an automated message to this contact?
async function canSend(phone) {
  const conv = await Conversation.findOne({ phone });
  if (!conv) return true;
  return !conv.botPaused && !conv.optedOut;
}

async function runResumeNudges(now) {
  const due = await Lead.find({
    optedOut: false,
    resumeNudgeSent: false,
    resumeAt: { $lte: now },
    flowStep: { $in: AWAITING_STEPS },
  }).limit(100);

  for (const lead of due) {
    try {
      if (!(await canSend(lead.phone))) { lead.resumeNudgeSent = true; lead.resumeAt = undefined; await lead.save(); continue; }
      const resumeImg = await FlowAsset.findOne({ key: 'resume_header' }).then((a) => a?.url || '').catch(() => '');
      await sendButtons(lead.phone, X2_RESUME_BODY(lead.name || 'there'), X2_RESUME_BUTTONS, resumeImg);
      lead.resumeNudgeSent = true;
      lead.resumeAt = undefined;
      await lead.save();
      logger.info('Resume nudge sent', { phone: lead.phone, step: lead.flowStep });
    } catch (err) {
      logger.error('Resume nudge failed', { phone: lead.phone, error: err.message });
    }
  }
}

async function runNurture(now) {
  // Day 3
  const d3 = await Lead.find({
    score: 'WARM', optedOut: false, nurtureD3Sent: false,
    nurtureD3At: { $lte: now }, flowStep: 'nurture_d3',
  });
  for (const lead of d3) {
    try {
      if (!(await canSend(lead.phone))) continue;
      await sendText(lead.phone, NURTURE_D3(lead.name || 'there'));
      lead.nurtureD3Sent = true; lead.flowStep = 'nurture_d7'; await lead.save();
      emitLeadUpdate(lead); logger.info('Nurture D3 sent', { phone: lead.phone });
    } catch (err) { logger.error('Nurture D3 failed', { phone: lead.phone, error: err.message }); }
  }

  // Day 7
  const d7 = await Lead.find({
    score: 'WARM', optedOut: false, nurtureD7Sent: false, nurtureD3Sent: true,
    nurtureD7At: { $lte: now }, flowStep: 'nurture_d7',
  });
  for (const lead of d7) {
    try {
      if (!(await canSend(lead.phone))) continue;
      await sendText(lead.phone, NURTURE_D7(lead.name || 'there'));
      lead.nurtureD7Sent = true; lead.flowStep = 'nurture_d21'; await lead.save();
      emitLeadUpdate(lead); logger.info('Nurture D7 sent', { phone: lead.phone });
    } catch (err) { logger.error('Nurture D7 failed', { phone: lead.phone, error: err.message }); }
  }

  // Day 21
  const d21 = await Lead.find({
    score: 'WARM', optedOut: false, nurtureD21Sent: false, nurtureD7Sent: true,
    nurtureD21At: { $lte: now }, flowStep: 'nurture_d21',
  });
  for (const lead of d21) {
    try {
      if (!(await canSend(lead.phone))) continue;
      await sendText(lead.phone, NURTURE_D21(lead.name || 'there'));
      lead.nurtureD21Sent = true; lead.flowStep = 'completed'; await lead.save();
      emitLeadUpdate(lead); logger.info('Nurture D21 sent', { phone: lead.phone });
    } catch (err) { logger.error('Nurture D21 failed', { phone: lead.phone, error: err.message }); }
  }
}

export function startNurtureScheduler() {
  cron.schedule('*/30 * * * *', async () => {
    const now = new Date();
    try {
      await runResumeNudges(now);
      await runNurture(now);
    } catch (err) {
      logger.error('Scheduler error', { error: err.message });
    }
  });
  logger.info('Scheduler started (resume nudges + nurture, every 30 min)');
}
