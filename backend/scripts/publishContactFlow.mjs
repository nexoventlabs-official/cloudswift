/**
 * Create + publish the Contact Details Flow (name / company / work email).
 *
 * V2 sends this only when name, company AND email are all unknown — if any are
 * already stored, the journey asks for the missing ones in chat instead, so a
 * contact is never asked for the same detail twice.
 *
 * Run:  node scripts/publishContactFlow.mjs
 */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const GRAPH = `https://graph.facebook.com/${process.env.WA_GRAPH_VERSION || 'v21.0'}`;
const TOKEN = process.env.WA_TOKEN;
const WABA = process.env.WA_WABA_ID;
const FLOW_NAME = 'CloudSwift Contact Details';
const JSON_FILE = path.join(__dirname, '..', 'flows', 'cloudswift_contact_flow.json');

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

const run = async () => {
  const flowJson = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

  const list = await api(`${GRAPH}/${WABA}/flows?fields=id,name,status&limit=100`);
  const existing = (list.data || []).find((f) => f.name === FLOW_NAME && f.status !== 'DEPRECATED');

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
  if (fresh.status === 'PUBLISHED') console.log('Already PUBLISHED (JSON updated in place)');
  else { await api(`${GRAPH}/${flowId}/publish`, { method: 'POST' }); console.log('Published'); }

  const final = await api(`${GRAPH}/${flowId}?fields=id,name,status`);
  console.log(`\nDONE → ${final.id} | ${final.name} | ${final.status}`);
  console.log(`\nAdd to backend/.env:\nWA_CONTACT_FLOW_ID=${final.id}`);
};

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
