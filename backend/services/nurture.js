/**
 * Warm lead nurture scheduler.
 * Runs every 30 minutes — checks for leads whose nurture messages are due and sends them.
 */

import cron from 'node-cron';
import Lead from '../models/Lead.js';
import { sendText } from './metaCloud.js';
import { NURTURE_D3, NURTURE_D7, NURTURE_D21 } from './flowMessages.js';
import { emitLeadUpdate } from './eventBus.js';
import logger from './logger.js';

export function startNurtureScheduler() {
  // Every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    const now = new Date();
    try {
      // Day 3
      const d3Leads = await Lead.find({
        score: 'WARM',
        nurtureD3Sent: false,
        nurtureD3At: { $lte: now },
        flowStep: { $in: ['nurture_d3', 'scored'] },
      });
      for (const lead of d3Leads) {
        try {
          await sendText(lead.phone, NURTURE_D3(lead.name || 'there'));
          lead.nurtureD3Sent = true;
          lead.flowStep      = 'nurture_d7';
          await lead.save();
          emitLeadUpdate(lead);
          logger.info('Nurture D3 sent', { phone: lead.phone });
        } catch (err) {
          logger.error('Nurture D3 send failed', { phone: lead.phone, error: err.message });
        }
      }

      // Day 7
      const d7Leads = await Lead.find({
        score: 'WARM',
        nurtureD7Sent: false,
        nurtureD3Sent: true,
        nurtureD7At: { $lte: now },
        flowStep: 'nurture_d7',
      });
      for (const lead of d7Leads) {
        try {
          await sendText(lead.phone, NURTURE_D7(lead.name || 'there'));
          lead.nurtureD7Sent = true;
          lead.flowStep      = 'nurture_d21';
          await lead.save();
          emitLeadUpdate(lead);
          logger.info('Nurture D7 sent', { phone: lead.phone });
        } catch (err) {
          logger.error('Nurture D7 send failed', { phone: lead.phone, error: err.message });
        }
      }

      // Day 21
      const d21Leads = await Lead.find({
        score: 'WARM',
        nurtureD21Sent: false,
        nurtureD7Sent: true,
        nurtureD21At: { $lte: now },
        flowStep: 'nurture_d21',
      });
      for (const lead of d21Leads) {
        try {
          await sendText(lead.phone, NURTURE_D21(lead.name || 'there'));
          lead.nurtureD21Sent = true;
          lead.flowStep       = 'completed';
          await lead.save();
          emitLeadUpdate(lead);
          logger.info('Nurture D21 sent', { phone: lead.phone });
        } catch (err) {
          logger.error('Nurture D21 send failed', { phone: lead.phone, error: err.message });
        }
      }
    } catch (err) {
      logger.error('Nurture scheduler error', { error: err.message });
    }
  });

  logger.info('Nurture scheduler started (every 30 min)');
}
