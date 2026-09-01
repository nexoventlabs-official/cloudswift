import express from 'express';
import crypto from 'crypto';
import logger from '../services/logger.js';
import { handleMessage, handleStatus } from '../services/chatbot.js';

const router = express.Router();

// ── GET: Meta webhook verification handshake ──────────────────────────────────
router.get('/', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.WA_VERIFY_TOKEN;

  if (!verifyToken) {
    logger.error('WA_VERIFY_TOKEN not configured');
    return res.sendStatus(500);
  }
  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('WhatsApp webhook verified');
    return res.status(200).send(challenge);
  }
  if (!mode && !token) {
    return res.json({ status: 'CloudSwift WhatsApp webhook active', timestamp: new Date().toISOString() });
  }
  logger.warn('Webhook verification failed', { mode, tokenMatch: token === verifyToken });
  return res.sendStatus(403);
});

// ── POST: incoming messages & status updates ──────────────────────────────────
router.post('/', async (req, res) => {
  // Verify signature if APP_SECRET is set
  if (process.env.WA_APP_SECRET && req.rawBody) {
    const sig      = req.get('x-hub-signature-256') || '';
    const expected = 'sha256=' + crypto
      .createHmac('sha256', process.env.WA_APP_SECRET)
      .update(req.rawBody)
      .digest('hex');
    if (sig && !timingSafeEqual(sig, expected)) {
      logger.warn('Webhook signature mismatch');
      return res.sendStatus(401);
    }
  }

  // Ack Meta immediately — avoid retries
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;
        const value = change.value || {};

        // Delivery / read statuses
        for (const status of value.statuses || []) {
          handleStatus(status).catch((e) =>
            logger.error('handleStatus error', { error: e.message })
          );
        }

        // Collect contact names
        const names = {};
        for (const c of value.contacts || []) {
          if (c.wa_id && c.profile?.name) names[c.wa_id] = c.profile.name;
        }

        // Process messages
        for (const message of value.messages || []) {
          const parsed = parseIncoming(message);
          if (!parsed) continue;
          parsed.name        = names[message.from] || '';
          parsed.waMessageId = message.id;
          parsed.rawPayload  = message;

          handleMessage(parsed).catch((e) =>
            logger.error('handleMessage error', { error: e.message, stack: e.stack })
          );
        }
      }
    }
  } catch (err) {
    logger.error('Webhook processing error', { error: err.message });
  }
});

// ── Parse a raw Meta message into a normalised shape ─────────────────────────
function parseIncoming(message) {
  const phone = message.from;
  const out   = { phone, type: 'text', text: '', selectedId: null };

  switch (message.type) {
    case 'text':
      out.text = message.text?.body || '';
      break;
    case 'interactive': {
      const it = message.interactive || {};
      if (it.type === 'button_reply') {
        out.type       = 'button';
        out.selectedId = it.button_reply?.id || '';
        out.text       = it.button_reply?.title || '';
      } else if (it.type === 'list_reply') {
        out.type       = 'list';
        out.selectedId = it.list_reply?.id || '';
        out.text       = it.list_reply?.title || '';
      }
      break;
    }
    default:
      out.text = '[unsupported message type]';
  }

  return out.text || out.selectedId ? out : null;
}

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export default router;
