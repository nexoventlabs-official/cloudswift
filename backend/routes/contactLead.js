/**
 * Public website contact endpoint (no auth) — turns a contact-form submission
 * into a Lead so it shows up in the CRM. Used by the Next.js site's /api/contact.
 */
import express from 'express';
import Lead from '../models/Lead.js';
import { emitLead } from '../services/eventBus.js';
import logger from '../services/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, company, interest, message, source, phone } = req.body || {};
    if (!name || !email) {
      return res.status(422).json({ success: false, message: 'name and email are required' });
    }
    const lead = await Lead.create({
      phone: (phone && String(phone).trim()) || `web_${Date.now()}`,
      name: String(name).slice(0, 120),
      company: String(company || '').slice(0, 120),
      email: String(email).slice(0, 160),
      firstMessage: String(message || '').slice(0, 2000),
      channel: 'organic',
      status: 'New',
      flowStep: 'completed',
      score: 'NEW',
      notes: `Website contact — interest: ${interest || '—'} · source: ${source || 'website'}`,
    });
    emitLead(lead);
    logger.info('Website contact lead created', { email });
    res.json({ success: true, id: lead._id });
  } catch (err) {
    logger.error('Contact lead error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
