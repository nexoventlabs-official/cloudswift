import axios from 'axios';
import logger from './logger.js';

const GRAPH_VERSION = process.env.WA_GRAPH_VERSION || 'v21.0';
const TOKEN         = () => process.env.WA_TOKEN;
const PHONE_ID      = () => process.env.WA_PHONE_NUMBER_ID;

const graphUrl = () =>
  `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_ID()}/messages`;

// ── Core send function ────────────────────────────────────────────────────────
async function send(payload) {
  try {
    const res = await axios.post(graphUrl(), payload, {
      headers: {
        Authorization: `Bearer ${TOKEN()}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    const detail = err.response?.data || err.message;
    logger.error('Meta send error', { detail, payload });
    throw err;
  }
}

// ── Text message ─────────────────────────────────────────────────────────────
export async function sendText(to, body) {
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body },
  });
}

// ── Interactive message with quick-reply buttons (up to 3) ──────────────────
export async function sendButtons(to, body, buttons) {
  // buttons: [{ id: 'btn_1', title: 'Option 1' }, ...]
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: body },
      action: {
        buttons: buttons.map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title },
        })),
      },
    },
  });
}

// ── Interactive list message (for 5+ options) ────────────────────────────────
export async function sendList(to, bodyText, buttonLabel, sections) {
  // sections: [{ title, rows: [{ id, title, description }] }]
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: {
        button: buttonLabel,
        sections,
      },
    },
  });
}

// ── Template message (for outbound / session-expired contacts) ───────────────
export async function sendTemplate(to, templateName, languageCode = 'en', components = []) {
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  });
}

// ── Image message ────────────────────────────────────────────────────────────
export async function sendImage(to, imageUrl, caption = '') {
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

// ── Document / PDF message ───────────────────────────────────────────────────
export async function sendDocument(to, docUrl, filename = 'document.pdf', caption = '') {
  return send({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'document',
    document: { link: docUrl, filename, caption },
  });
}

// ── Mark message as read ─────────────────────────────────────────────────────
export async function markRead(messageId) {
  try {
    await axios.post(
      graphUrl(),
      { messaging_product: 'whatsapp', status: 'read', message_id: messageId },
      { headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' } }
    );
  } catch {
    // Non-critical — ignore mark-read failures
  }
}
