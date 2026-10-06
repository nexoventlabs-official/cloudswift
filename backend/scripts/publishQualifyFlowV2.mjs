/**
 * Create + publish the V2 Qualification Flow — a single native multi-screen
 * Flow that asks Q1 → Q2 → Q3 → Q4 inside the Flow UI (no separate WhatsApp
 * list messages).
 *
 * Q4 is DYNAMIC: its label and options are not baked into the Flow. They're
 * declared as screen `data` and supplied at send time from
 * config/v2Flow.js → qualification.Q4.branches[requirement]. One published
 * Flow therefore serves every requirement, and changing a Q4 question is a
 * config edit with no re-publish.
 *
 * Answers are carried forward through each screen's navigate payload, so the
 * final `complete` returns every answer in one submission.
 *
 * Run:  node scripts/publishQualifyFlowV2.mjs
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
const FLOW_NAME = 'CloudSwift Qualification V2';

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

const src = (options) =>
  options.map((o) => ({ id: o.id, title: String(o.title || o.label).slice(0, 30) }));

// Reusable data-schema fragments.
const STR = (example) => ({ type: 'string', __example__: example });
const OPTS = {
  type: 'array',
  items: {
    type: 'object',
    properties: { id: { type: 'string' }, title: { type: 'string' } },
  },
  __example__: [{ id: 'example', title: 'Example option' }],
};

function buildFlowJson() {
  const q = V2_CONFIG.qualification;

  return {
    version: '7.0',
    screens: [
      // ── Q1 · trigger ────────────────────────────────────────────────────
      {
        id: 'TRIGGER',
        title: 'Quick questions',
        data: { q4_label: STR("What's your current environment?"), q4_options: OPTS },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            { type: 'TextBody', text: q.intro },
            {
              type: 'Form',
              name: 'form',
              children: [
                {
                  type: 'RadioButtonsGroup',
                  name: 'trigger',
                  label: q.Q1.prompt,
                  required: true,
                  'data-source': src(q.Q1.options),
                },
                {
                  type: 'Footer',
                  label: 'Next',
                  'on-click-action': {
                    name: 'navigate',
                    next: { type: 'screen', name: 'TIMELINE' },
                    payload: {
                      trigger: '${form.trigger}',
                      q4_label: '${data.q4_label}',
                      q4_options: '${data.q4_options}',
                    },
                  },
                },
              ],
            },
          ],
        },
      },

      // ── Q2 · timeline ───────────────────────────────────────────────────
      {
        id: 'TIMELINE',
        title: 'Timeline',
        data: { trigger: STR('active_issue'), q4_label: STR('Environment?'), q4_options: OPTS },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            {
              type: 'Form',
              name: 'form',
              children: [
                {
                  type: 'RadioButtonsGroup',
                  name: 'timeline',
                  label: q.Q2.prompt,
                  required: true,
                  'data-source': src(q.Q2.options),
                },
                {
                  type: 'Footer',
                  label: 'Next',
                  'on-click-action': {
                    name: 'navigate',
                    next: { type: 'screen', name: 'ROLE' },
                    payload: {
                      trigger: '${data.trigger}',
                      timeline: '${form.timeline}',
                      q4_label: '${data.q4_label}',
                      q4_options: '${data.q4_options}',
                    },
                  },
                },
              ],
            },
          ],
        },
      },

      // ── Q3 · role ───────────────────────────────────────────────────────
      {
        id: 'ROLE',
        title: 'Your role',
        data: {
          trigger: STR('active_issue'), timeline: STR('asap_30'),
          q4_label: STR('Environment?'), q4_options: OPTS,
        },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            {
              type: 'Form',
              name: 'form',
              children: [
                {
                  type: 'RadioButtonsGroup',
                  name: 'role',
                  label: q.Q3.prompt,
                  required: true,
                  'data-source': src(q.Q3.options),
                },
                {
                  type: 'Footer',
                  label: 'Next',
                  'on-click-action': {
                    name: 'navigate',
                    next: { type: 'screen', name: 'CONTEXT' },
                    payload: {
                      trigger: '${data.trigger}',
                      timeline: '${data.timeline}',
                      role: '${form.role}',
                      q4_label: '${data.q4_label}',
                      q4_options: '${data.q4_options}',
                    },
                  },
                },
              ],
            },
          ],
        },
      },

      // ── Q4 · dynamic contextual question (label + options from data) ────
      {
        id: 'CONTEXT',
        title: 'Almost done',
        terminal: true,
        success: true,
        data: {
          trigger: STR('active_issue'), timeline: STR('asap_30'), role: STR('owner_approver'),
          q4_label: STR("What's your current environment?"), q4_options: OPTS,
        },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            {
              type: 'Form',
              name: 'form',
              children: [
                {
                  type: 'RadioButtonsGroup',
                  name: 'context',
                  label: '${data.q4_label}',
                  required: true,
                  'data-source': '${data.q4_options}',
                },
                {
                  type: 'TextInput',
                  name: 'notes',
                  label: 'Anything else? (optional)',
                  'input-type': 'text',
                  required: false,
                },
                {
                  type: 'Footer',
                  label: 'Submit',
                  'on-click-action': {
                    name: 'complete',
                    payload: {
                      trigger: '${data.trigger}',
                      timeline: '${data.timeline}',
                      role: '${data.role}',
                      context: '${form.context}',
                      notes: '${form.notes}',
                    },
                  },
                },
              ],
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

const run = async () => {
  const flowJson = buildFlowJson();
  console.log(`Screens: ${flowJson.screens.map((s) => s.id).join(' → ')}`);

  let existing = await findExisting();
  let flowId;
  if (existing) {
    flowId = existing.id;
    console.log(`Reusing flow ${flowId} (status ${existing.status})`);
  } else {
    const body = new URLSearchParams({
      name: FLOW_NAME,
      categories: JSON.stringify(['LEAD_GENERATION']),
    });
    const created = await api(`${GRAPH}/${WABA}/flows`, { method: 'POST', body });
    flowId = created.id;
    console.log(`Created flow ${flowId}`);
  }

  console.log('Uploading Flow JSON...');
  const form = new FormData();
  form.append('asset_type', 'FLOW_JSON');
  form.append('name', 'flow.json');
  form.append('file', new Blob([JSON.stringify(flowJson)], { type: 'application/json' }), 'flow.json');
  const up = await api(`${GRAPH}/${flowId}/assets`, { method: 'POST', body: form });

  if (up.validation_errors?.length) {
    console.error('VALIDATION ERRORS:');
    console.error(JSON.stringify(up.validation_errors, null, 2));
    process.exit(1);
  }
  console.log('Upload OK');

  const fresh = await api(`${GRAPH}/${flowId}?fields=id,name,status`);
  if (fresh.status === 'PUBLISHED') {
    console.log('Already PUBLISHED (JSON updated in place)');
  } else {
    await api(`${GRAPH}/${flowId}/publish`, { method: 'POST' });
    console.log('Published');
  }

  const final = await api(`${GRAPH}/${flowId}?fields=id,name,status`);
  console.log(`\nDONE → ${final.id} | ${final.name} | ${final.status}`);
  console.log(`\nAdd to backend/.env:\nWA_QUALIFY_FLOW_V2_ID=${final.id}`);
};

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
