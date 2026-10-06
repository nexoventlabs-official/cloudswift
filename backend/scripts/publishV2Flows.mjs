/**
 * Create + publish the V2 Requirement Picker as a native WhatsApp Flow.
 *
 * The V2 spec (file 02) specifies a native Flow for the first screen. The old
 * "CloudSwift Service Picker" still carries the V1 option set, so this script
 * publishes a fresh Flow with the V2 requirements taken straight from
 * config/v2Flow.js (single source of truth).
 *
 * Run:  node scripts/publishV2Flows.mjs
 * Needs WA_TOKEN + WA_WABA_ID in backend/.env
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { V2_CONFIG } from '../config/v2Flow.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const GRAPH = `https://graph.facebook.com/${process.env.WA_GRAPH_VERSION || 'v21.0'}`;
const TOKEN = process.env.WA_TOKEN;
const WABA = process.env.WA_WABA_ID;
const FLOW_NAME = 'CloudSwift Requirement Picker V2';

if (!TOKEN || !WABA) {
  console.error('Missing WA_TOKEN or WA_WABA_ID in backend/.env');
  process.exit(1);
}

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(opts.headers || {}) },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

/** Flow JSON: one terminal screen with the V2 requirement list. */
function buildFlowJson() {
  const dataSource = V2_CONFIG.requirements.map((r) => ({
    id: r.id,
    title: String(r.label).slice(0, 30),
    description: String(r.description || '').slice(0, 300),
  }));

  // Everything shown on the screen is DYNAMIC (supplied at send time) so the
  // options, their 1:1 icons and the 8:1 banner can change from the admin
  // panel / config without re-publishing. Mirrors the proven V1 structure:
  // a dynamic `data-source` whose items carry an `image` (base64).
  return {
    version: '6.3',
    routing_model: { CHOOSE_REQUIREMENT: [] },
    screens: [
      {
        id: 'CHOOSE_REQUIREMENT',
        title: 'How can we help?',
        terminal: true,
        success: true,
        data: {
          banner: { type: 'string', __example__: 'iVBORw0KGgo' },
          has_banner: { type: 'boolean', __example__: true },
          heading: { type: 'string', __example__: 'How can we help?' },
          subheading: { type: 'string', __example__: 'What are you looking to solve?' },
          requirements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                // Per-option 1:1 icon, raw base64.
                image: { type: 'string' },
              },
              required: ['id', 'title'],
            },
            __example__: dataSource.slice(0, 2).map((d) => ({ ...d, image: 'iVBORw0KGgo' })),
          },
        },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            {
              type: 'Image',
              src: '${data.banner}',
              width: 1000,
              height: 125,
              'scale-type': 'cover',
              'alt-text': 'CloudSwift',
              visible: '${data.has_banner}',
            },
            { type: 'TextHeading', text: '${data.heading}' },
            { type: 'TextSubheading', text: '${data.subheading}' },
            {
              type: 'RadioButtonsGroup',
              name: 'requirement',
              label: 'Select one',
              required: true,
              'data-source': '${data.requirements}',
            },
            {
              type: 'Footer',
              label: 'Continue',
              'on-click-action': {
                name: 'complete',
                payload: { requirement: '${form.requirement}' },
              },
            },
          ],
        },
      },
    ],
  };
}

async function findExisting() {
  const r = await api(`${GRAPH}/${WABA}/flows?fields=id,name,status&limit=100`);
  return (r.data || []).find((f) => f.name === FLOW_NAME && f.status !== 'DEPRECATED') || null;
}

async function createFlow() {
  const body = new URLSearchParams({
    name: FLOW_NAME,
    categories: JSON.stringify(['LEAD_GENERATION']),
  });
  const r = await api(`${GRAPH}/${WABA}/flows`, { method: 'POST', body });
  return r.id;
}

async function uploadJson(flowId, flowJson) {
  const form = new FormData();
  form.append('asset_type', 'FLOW_JSON');
  form.append('name', 'flow.json');
  form.append('file', new Blob([JSON.stringify(flowJson)], { type: 'application/json' }), 'flow.json');
  return api(`${GRAPH}/${flowId}/assets`, { method: 'POST', body: form });
}

async function publish(flowId) {
  return api(`${GRAPH}/${flowId}/publish`, { method: 'POST' });
}

const run = async () => {
  const flowJson = buildFlowJson();
  console.log(`Options supplied at send time (dynamic data-source): ${V2_CONFIG.requirements.length}`);
  console.log('Per-option 1:1 icons + 8:1 banner are passed in as base64 at send time.');

  let flow = await findExisting();
  let flowId;
  if (flow) {
    flowId = flow.id;
    console.log(`Reusing existing flow ${flowId} (status ${flow.status})`);
  } else {
    flowId = await createFlow();
    console.log(`Created flow ${flowId}`);
  }

  console.log('Uploading Flow JSON...');
  const up = await uploadJson(flowId, flowJson);
  if (up.validation_errors?.length) {
    console.error('VALIDATION ERRORS:');
    console.error(JSON.stringify(up.validation_errors, null, 2));
    process.exit(1);
  }
  console.log('Upload OK');

  // A published flow can't be re-published; only publish drafts.
  const fresh = await api(`${GRAPH}/${flowId}?fields=id,name,status`);
  if (fresh.status === 'PUBLISHED') {
    console.log('Flow already PUBLISHED (JSON updated in place)');
  } else {
    await publish(flowId);
    console.log('Published');
  }

  const final = await api(`${GRAPH}/${flowId}?fields=id,name,status`);
  console.log(`\nDONE → ${final.id} | ${final.name} | ${final.status}`);
  console.log(`\nAdd to backend/.env:\nWA_REQUIREMENT_FLOW_ID=${final.id}`);
};

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
