/**
 * Builds and sends the A0 service-picker WhatsApp Flow.
 * - The message HEADER image is a hosted Cloudinary URL (welcome_header).
 * - The banner shown INSIDE the flow screen must be raw base64 (Flows block remote URLs),
 *   so we fetch the welcome_banner asset and encode it at send time.
 */
import axios from 'axios';
import FlowAsset from '../models/FlowAsset.js';
import Setting from '../models/Setting.js';
import { sendFlow } from './metaCloud.js';
import { SERVICES, WELCOME_BODY } from './flowMessages.js';
import logger from './logger.js';

const FLOW_SCREEN = 'CHOOSE_SERVICE';

async function assetUrl(key) {
  try {
    const a = await FlowAsset.findOne({ key });
    return a?.url || '';
  } catch {
    return '';
  }
}

async function settingVal(key, fallback = '') {
  try {
    const s = await Setting.findOne({ key });
    return s?.value || fallback;
  } catch {
    return fallback;
  }
}

// WhatsApp Flow images must be raw base64 embedded in the payload.
// Meta caps the flow_action_payload at ~240 KB, so we downscale + compress via
// Cloudinary transforms before encoding (banner 8:1, icons 1:1).
function withCloudinaryTransform(url, opts = {}) {
  if (!url || !url.includes('/upload/')) return url;
  const parts = [];
  if (opts.width)  parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  parts.push(`c_${opts.crop || 'fill'}`);
  parts.push(`q_${opts.quality || 80}`);
  parts.push(`f_${opts.format || 'jpg'}`);
  return url.replace('/upload/', `/upload/${parts.join(',')}/`);
}

/** Fetch an image URL (with optional Cloudinary transform) and return RAW base64. */
export async function urlToBase64(url, opts = {}) {
  if (!url) return '';
  if (url.startsWith('data:image/')) return url.replace(/^data:image\/[^;]+;base64,/, '');
  try {
    const fetchUrl = withCloudinaryTransform(url, opts);
    const res = await axios.get(fetchUrl, { responseType: 'arraybuffer', timeout: 15000, maxContentLength: 10 * 1024 * 1024 });
    return Buffer.from(res.data, 'binary').toString('base64');
  } catch (err) {
    logger.warn('urlToBase64 failed', { url, error: err.message });
    return '';
  }
}

const kb = (b64) => Math.round((b64.length * 0.75) / 1024);

/**
 * Send the service-picker flow to a contact.
 * Falls back gracefully if the flow id or assets are missing.
 * Returns true if a flow message was sent, false otherwise.
 */
export async function sendServiceFlow(phone, name = '') {
  const flowId = process.env.WA_LEAD_FLOW_ID;
  if (!flowId) {
    logger.warn('WA_LEAD_FLOW_ID not set — cannot send service flow');
    return false;
  }

  const headerUrl  = await assetUrl('welcome_header');
  const bannerUrl  = await assetUrl('welcome_banner');
  // Banner: 8:1 (1920×240), high quality — up to ~140 KB budget
  const bannerB64  = bannerUrl
    ? await urlToBase64(bannerUrl, { width: 1920, height: 240, crop: 'fill', quality: 92, format: 'jpg' })
    : '';

  const heading    = await settingVal('flowHeading', 'Welcome to CloudSwift ☁️');
  const subheading = await settingVal('flowSubheading', 'Select a service to get started:');

  // Per-service 1:1 logos (180×180, ~20 KB each). PNG keeps logo transparency crisp.
  const services = [];
  for (const s of SERVICES) {
    const item = { id: s.id, title: s.title, description: s.description };
    if (s.iconKey) {
      const iconUrl = await assetUrl(s.iconKey);
      if (iconUrl) {
        const icon = await urlToBase64(iconUrl, { width: 180, height: 180, crop: 'fill', quality: 90, format: 'png' });
        if (icon) item.image = icon;
      }
    }
    services.push(item);
  }

  // Guard the ~240 KB flow payload cap: if banner + icons are too big, drop icons.
  let totalKb = kb(bannerB64) + services.reduce((a, s) => a + (s.image ? kb(s.image) : 0), 0);
  if (totalKb > 220) {
    services.forEach((s) => delete s.image);
    logger.warn('Service flow payload over budget — dropped row icons', { totalKb });
    totalKb = kb(bannerB64);
  }
  logger.info('Service flow assets', { bannerKb: kb(bannerB64), iconCount: services.filter((s) => s.image).length, totalKb });

  const data = {
    heading,
    subheading,
    has_banner: Boolean(bannerB64),
    banner: bannerB64 || '',
    services,
  };

  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_${phone}`,
    cta: 'Choose service',
    screen: FLOW_SCREEN,
    data,
    headerImageUrl: headerUrl || '',
    body: WELCOME_BODY(name),
    footer: 'CloudSwift',
  });
  return true;
}

/**
 * Send the multi-screen qualification flow (size → situation → timeline → role).
 * Self-contained (client-side navigate) — no data needed up front.
 * Returns true if sent, false if the flow id isn't configured.
 */
export async function sendQualifyFlow(phone, name = '') {
  const flowId = process.env.WA_QUALIFY_FLOW_ID;
  if (!flowId) {
    logger.warn('WA_QUALIFY_FLOW_ID not set — falling back to button questions');
    return false;
  }
  const headerUrl = await assetUrl('qualify_header');
  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_q_${phone}`,
    cta: 'Answer 4 questions',
    screen: 'SIZE',
    data: {},
    headerImageUrl: headerUrl || '',
    body: `Thanks${name ? ` ${name}` : ''} — just 4 quick questions so we can match you with the right specialist. Tap below 👇`,
    footer: 'CloudSwift',
  });
  return true;
}

/**
 * Send the contact-details form flow (name, company, email).
 * Uses the hot_lead_header asset as the message header if available.
 * Returns true if sent, false if the flow id isn't configured.
 */
export async function sendContactFlow(phone, name = '') {
  const flowId = process.env.WA_CONTACT_FLOW_ID;
  if (!flowId) {
    logger.warn('WA_CONTACT_FLOW_ID not set — falling back to text prompt');
    return false;
  }
  const headerUrl = await assetUrl('hot_lead_header');
  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_c_${phone}`,
    cta: 'Share your details',
    screen: 'CONTACT',
    data: {},
    headerImageUrl: headerUrl || '',
    body: `Great${name ? ` ${name}` : ''} — let's connect you with the right specialist. Tap below to share your details.`,
    footer: 'CloudSwift',
  });
  return true;
}

/**
 * Send the booking form flow (name, business, WhatsApp number [locked], phone, email).
 * The contact's WhatsApp number is passed in and shown non-editable.
 * Returns true if sent, false if the flow id isn't configured.
 */
export async function sendBookingFlow(phone, name = '') {
  const flowId = process.env.WA_BOOKING_FLOW_ID;
  if (!flowId) {
    logger.warn('WA_BOOKING_FLOW_ID not set — cannot send booking form');
    return false;
  }
  const headerUrl = await assetUrl('calendly_header');
  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_b_${phone}`,
    cta: 'Book a call',
    screen: 'BOOK',
    data: { wa_number: phone },
    headerImageUrl: headerUrl || '',
    body: `Great${name ? ` ${name}` : ''} — let's get your call booked. Tap below to share your details.`,
    footer: 'CloudSwift',
  });
  return true;
}
