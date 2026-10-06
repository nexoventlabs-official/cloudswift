/**
 * Funnel event logging.
 *
 * Every milestone is written as its own FunnelEvent row so conversion can be
 * measured directly:
 *   entry → requirement_selected → qualification_started →
 *   qualification_completed → route_assigned → human_handoff →
 *   meeting_booked → meeting_held → opportunity → won / lost
 *
 * `drop_off` additionally records the step a contact abandoned, which is the
 * data we use to improve the UX instead of guessing.
 *
 * Never throws — logging must not be able to break a conversation.
 */
import FunnelEvent from '../models/FunnelEvent.js';
import logger from './logger.js';

/**
 * @param {object} lead   Lead document (may be null for pre-lead events)
 * @param {string} event  one of FUNNEL_EVENTS
 * @param {string} step   journey step, e.g. 'qualify_q2'
 * @param {object} meta   extra context (answers, reasons, slot, …)
 */
export async function logEvent(lead, event, step = '', meta = {}) {
  try {
    await FunnelEvent.create({
      phone: lead?.phone || meta.phone || '',
      leadId: lead?._id,
      event,
      step: step || lead?.flowStep || '',
      requirement: lead?.requirement || '',
      route: lead?.route || '',
      source: lead?.source || '',
      campaign: lead?.campaign || '',
      meta,
    });
  } catch (err) {
    logger.warn('funnel logEvent failed', { event, error: err.message });
  }
}

/** Convenience: record the step a contact dropped off at. */
export async function logDropOff(lead, step, meta = {}) {
  if (lead && step) {
    try {
      lead.dropOffStep = step;
      await lead.save();
    } catch {}
  }
  return logEvent(lead, 'drop_off', step, meta);
}
