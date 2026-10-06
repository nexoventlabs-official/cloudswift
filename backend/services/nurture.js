/**
 * Scheduler (runs every 30 min):
 *  - Drop-off resume nudges — leads that went silent mid-journey. The nudge
 *    resumes from the LAST INCOMPLETE STEP (never a restart) and the
 *    abandoned step is recorded as a funnel `drop_off` event.
 *  - NURTURE_REVIEW follow-ups on Day 3 / 7 / 21, using the content
 *    configured for the lead's requirement.
 *
 * Every send is skipped when the contact opted out or a human has taken over
 * the conversation (botPaused).
 */
import cron from 'node-cron';
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import FlowAsset from '../models/FlowAsset.js';
import { sendText, sendButtons } from './metaCloud.js';
import { getConfig, fill } from '../config/v2Flow.js';
import { logEvent, logDropOff } from './funnel.js';
import { NURTURE_D3, NURTURE_D7, NURTURE_D21 } from './flowMessages.js';
import { emitLeadUpdate } from './eventBus.js';
import logger from './logger.js';

// Mid-journey steps eligible for a resume nudge (V2 first, then legacy V1).
const AWAITING_STEPS = [
  // V2
  'requirement_sent', 'a1_sent_v2',
  'qualify_flow_sent', 'qualify_q1', 'qualify_q2', 'qualify_q3', 'qualify_q4', 'qualify_q4_text',
  'awaiting_full_name', 'awaiting_company', 'awaiting_email', 'contact_flow_sent',
  'high_priority_options', 'awaiting_booking_slot', 'awaiting_callback_time',
  'nurture_consent_sent', 'self_serve_sent',
  // Legacy V1
  'a0_sent', 'a1_sent', 'qualify_sent', 'q1_sent', 'q2_sent', 'q3_sent', 'q4_sent',
  'awaiting_name_company', 'h2_sent', 'awaiting_booking', 'n1_sent', 'cold_guide',
];

/** Can we send an automated message to this contact right now? */
async function canSend(phone) {
  const conv = await Conversation.findOne({ phone });
  if (!conv) return true;
  return !conv.botPaused && !conv.optedOut;
}

/** Requirement-specific nurture copy, falling back to the legacy text. */
function nurtureBody(cfg, lead, dayKey, legacyFn) {
  const name = lead.name || lead.profileName || 'there';
  const res = cfg.resources?.[lead.requirement] || cfg.resources?.other || {};
  const template = res.nurture?.[dayKey];
  return template ? fill(template, { name }) : legacyFn(name);
}

async function runResumeNudges(now, cfg) {
  const due = await Lead.find({
    optedOut: false,
    resumeNudgeSent: false,
    resumeAt: { $lte: now },
    flowStep: { $in: AWAITING_STEPS },
  }).limit(100);

  for (const lead of due) {
    try {
      if (!(await canSend(lead.phone))) {
        lead.resumeNudgeSent = true; lead.resumeAt = undefined; await lead.save();
        continue;
      }
      // Record WHERE they dropped off before nudging — this is the data used
      // to improve the questions/UX.
      await logDropOff(lead, lead.flowStep, { nudged: true });

      const img = await FlowAsset.findOne({ key: 'resume_header' }).then((a) => a?.url || '').catch(() => '');
      const body = fill(cfg.safety.resumePromptTemplate, { name: lead.name || lead.profileName || 'there' });
      await sendButtons(lead.phone, body, cfg.safety.resumeButtons, img);

      lead.resumeNudgeSent = true;
      lead.resumeAt = undefined;
      await lead.save();
      logger.info('Resume nudge sent', { phone: lead.phone, step: lead.flowStep });
    } catch (err) {
      logger.error('Resume nudge failed', { phone: lead.phone, error: err.message });
    }
  }
}

/** One nurture stage. `stage` drives which fields/step advance. */
async function runNurtureStage(now, cfg, stage) {
  const { dueField, sentField, dayKey, step, nextStep, legacyFn, requires } = stage;

  const filter = {
    optedOut: false,
    [sentField]: false,
    [dueField]: { $lte: now },
    flowStep: step,
    $or: [{ route: 'NURTURE_REVIEW' }, { score: 'WARM' }],
  };
  for (const r of requires || []) filter[r] = true;

  const due = await Lead.find(filter).limit(100);
  for (const lead of due) {
    try {
      if (!(await canSend(lead.phone))) continue;
      await sendText(lead.phone, nurtureBody(cfg, lead, dayKey, legacyFn));
      lead[sentField] = true;
      lead.flowStep = nextStep;
      await lead.save();
      emitLeadUpdate(lead);
      await logEvent(lead, 'nurture_sent', step, { stage: dayKey });
      logger.info(`Nurture ${dayKey} sent`, { phone: lead.phone });
    } catch (err) {
      logger.error(`Nurture ${dayKey} failed`, { phone: lead.phone, error: err.message });
    }
  }
}

async function runNurture(now, cfg) {
  await runNurtureStage(now, cfg, {
    dueField: 'nurtureD3At', sentField: 'nurtureD3Sent', dayKey: 'day3',
    step: 'nurture_d3', nextStep: 'nurture_d7', legacyFn: NURTURE_D3,
  });
  await runNurtureStage(now, cfg, {
    dueField: 'nurtureD7At', sentField: 'nurtureD7Sent', dayKey: 'day7',
    step: 'nurture_d7', nextStep: 'nurture_d21', legacyFn: NURTURE_D7,
    requires: ['nurtureD3Sent'],
  });
  await runNurtureStage(now, cfg, {
    dueField: 'nurtureD21At', sentField: 'nurtureD21Sent', dayKey: 'day21',
    step: 'nurture_d21', nextStep: 'completed', legacyFn: NURTURE_D21,
    requires: ['nurtureD7Sent'],
  });
}

export function startNurtureScheduler() {
  cron.schedule('*/30 * * * *', async () => {
    const now = new Date();
    try {
      const cfg = await getConfig();
      await runResumeNudges(now, cfg);
      await runNurture(now, cfg);
    } catch (err) {
      logger.error('Scheduler error', { error: err.message });
    }
  });
  logger.info('Scheduler started (resume nudges + nurture, every 30 min)');
}
