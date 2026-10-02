/**
 * Public endpoint that sends the A0 service-picker Welcome Flow to a phone.
 * Called by the SignalCRM (Vercel) automation when a contact sends a greeting,
 * so the real published WhatsApp Flow (header image + "Choose service" CTA)
 * goes out exactly as the original bot sent it. Guarded by a shared secret.
 */
import express from 'express';
import { sendServiceFlow } from '../services/flowService.js';
import logger from '../services/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const secret = req.query.secret || req.headers['x-welcome-secret'] || '';
    const expected = process.env.WELCOME_FLOW_SECRET || process.env.ADMIN_TOKEN || 'cloudswift_admin_session_token_2026';
    if (!secret || secret !== expected) {
      return res.status(401).json({ success: false, message: 'unauthorized' });
    }

    const phone = String(req.body?.phone || '').replace(/\D/g, '');
    if (!phone) return res.status(400).json({ success: false, message: 'phone required' });

    const name = (req.body?.name || '').toString().slice(0, 120);
    const sent = await sendServiceFlow(phone, name);
    logger.info('Welcome flow sent via public endpoint', { phone, sent });
    res.json({ success: true, sent });
  } catch (err) {
    logger.error('send-welcome-flow error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
