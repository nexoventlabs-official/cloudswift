/**
 * Builds and sends the V2 native WhatsApp Flows.
 * - Message HEADER images are hosted Cloudinary URLs (looked up from FlowAsset).
 * - Images shown INSIDE a Flow screen must be raw base64 (Flows block remote
 *   URLs), so assets are fetched and encoded at send time.
 */
import axios from 'axios';
import FlowAsset from '../models/FlowAsset.js';
import { sendFlow } from './metaCloud.js';
import logger from './logger.js';

async function assetUrl(key) {
  try {
    const a = await FlowAsset.findOne({ key });
    return a?.url || '';
  } catch {
    return '';
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

/** Approx KB of a base64 string — used to stay under Meta's payload cap. */
const kb = (b64) => Math.round((b64.length * 0.75) / 1024);

/**
 * V2 — send the Requirement Picker as a native WhatsApp Flow.
 *
 * Options come from config/v2Flow.js, which is also what the published Flow
 * JSON was generated from (scripts/publishV2Flows.mjs), so the two can't drift
 * without the config changing first.
 *
 * Returns true if the Flow was sent; false lets the caller fall back to the
 * list-message version (which stays fully functional).
 */
export async function sendRequirementFlow(phone, name = '', cfg = null) {
  // env var → config default → off. Keeps the Flow working without
  // per-environment env setup, while still allowing an override.
  const flowId = process.env.WA_REQUIREMENT_FLOW_ID || cfg?.flows?.requirementFlowId;
  if (!flowId) return false;

  const headerUrl = await assetUrl(cfg?.welcome?.headerKey || 'welcome_header');
  const body = cfg?.welcome?.body
    || "Hi 👋 Welcome to CloudSwift.\n\nTell us what you're looking to solve and we'll point you to the right cloud specialist.";

  // Images shown INSIDE a Flow must be raw base64 (remote URLs are blocked),
  // so each asset is downscaled via Cloudinary then encoded.
  // 8:1 brand banner.
  const bannerUrl = await assetUrl('welcome_banner');
  const bannerB64 = bannerUrl
    ? await urlToBase64(bannerUrl, { width: 1920, height: 240, crop: 'fill', quality: 88, format: 'jpg' })
    : '';

  // Per-option 1:1 icons, keyed `icon_<requirementId>` (uploaded in the admin
  // panel under "Requirement Icons"). PNG keeps logo transparency crisp.
  const requirements = [];
  for (const r of cfg?.requirements || []) {
    const item = {
      id: r.id,
      title: String(r.label || r.title).slice(0, 30),
      description: String(r.description || '').slice(0, 300),
    };
    const iconUrl = await assetUrl(`icon_${r.id}`);
    if (iconUrl) {
      const icon = await urlToBase64(iconUrl, { width: 180, height: 180, crop: 'fill', quality: 90, format: 'png' });
      if (icon) item.image = icon;
    }
    requirements.push(item);
  }

  // Meta caps flow_action_payload at ~240 KB. If banner + icons exceed the
  // budget, drop the icons rather than letting the whole send fail.
  let totalKb = kb(bannerB64) + requirements.reduce((a, r) => a + (r.image ? kb(r.image) : 0), 0);
  if (totalKb > 220) {
    requirements.forEach((r) => delete r.image);
    logger.warn('Requirement flow payload over budget — dropped option icons', { totalKb });
    totalKb = kb(bannerB64);
  }
  logger.info('Requirement flow assets', {
    bannerKb: kb(bannerB64),
    iconCount: requirements.filter((r) => r.image).length,
    totalKb,
  });

  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_req_${phone}`,
    cta: (cfg?.welcome?.listButton || 'Choose what you need').slice(0, 20),
    screen: 'CHOOSE_REQUIREMENT',
    data: {
      banner: bannerB64 || '',
      has_banner: Boolean(bannerB64),
      heading: cfg?.welcome?.heading || 'How can we help?',
      subheading: cfg?.welcome?.subheading || 'What are you looking to solve?',
      requirements,
    },
    headerImageUrl: headerUrl || '',
    body: name ? body.replace('Hi 👋', `Hi ${name} 👋`) : body,
    footer: 'CloudSwift',
  });
  return true;
}

/**
 * V2 — send the Qualification Flow (Q1 → Q2 → Q3 → Q4 inside one native Flow).
 *
 * Q4 is dynamic: its label and options are supplied here from
 * config → qualification.Q4.branches[requirement], so a single published Flow
 * serves every requirement and changing a Q4 question needs no re-publish.
 *
 * Returns true if sent; false lets the caller fall back to list messages.
 */
export async function sendQualifyFlowV2(phone, cfg, requirement, name = '') {
  const flowId = process.env.WA_QUALIFY_FLOW_V2_ID || cfg?.flows?.qualifyFlowId;
  if (!flowId) return false;

  const branches = cfg?.qualification?.Q4?.branches || {};
  const branch = branches[requirement] || branches.other;
  if (!branch) return false;

  // `flowOptions` exists for branches whose fallback is free text (e.g. "other"),
  // because a Flow radio group needs concrete options.
  const options = branch.flowOptions || branch.options || [];
  if (!options.length) return false;

  const headerUrl = await assetUrl('qualify_header');
  await sendFlow(phone, {
    flowId,
    flowToken: `cloudswift_q2_${phone}`,
    cta: 'Answer questions',
    screen: 'TRIGGER',
    data: {
      q4_label: String(branch.prompt || 'Tell us a bit more'),
      q4_options: options.map((o) => ({
        id: o.id,
        title: String(o.title || o.label).slice(0, 30),
      })),
    },
    headerImageUrl: headerUrl || '',
    body: `Thanks${name ? ` ${name}` : ''} — ${cfg?.qualification?.intro || 'a few quick details will help us route this correctly.'}`,
    footer: 'CloudSwift',
  });
  return true;
}

/**
 * Send the contact-details form flow (name, company, email).
 * Uses the hot_lead_header asset as the message header if available.
 * Returns true if sent, false if the flow id isn't configured.
 */
export async function sendContactFlow(phone, name = '', cfg = null) {
  const flowId = process.env.WA_CONTACT_FLOW_ID || cfg?.flows?.contactFlowId;
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

// NOTE: the V1 senders (service picker, V1 qualification, booking form) were
// removed with V2. The requirement picker and qualification are now the V2
// Flows above, and booking collects only a slot in chat so identity details
// are never re-requested.
