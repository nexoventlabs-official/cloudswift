/**
 * Deprecate the V1 CloudSwift Flows that the V2 journey no longer sends.
 *
 * Meta does not allow DELETING a published Flow — the only option is
 * `deprecate`, which is PERMANENT for that flow id. Draft (unpublished)
 * flows are deleted outright instead.
 *
 * KEEPS (still in use):
 *   · CloudSwift Requirement Picker V2
 *   · CloudSwift Qualification V2
 *   · CloudSwift Contact Details
 *
 * Only flows whose name is in RETIRE below are touched, so flows belonging
 * to other projects on this WABA are never affected.
 *
 * Run:  node scripts/deprecateUnusedFlows.mjs          (dry run)
 *       node scripts/deprecateUnusedFlows.mjs --apply  (actually deprecate)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const GRAPH = `https://graph.facebook.com/${process.env.WA_GRAPH_VERSION || 'v21.0'}`;
const TOKEN = process.env.WA_TOKEN;
const WABA = process.env.WA_WABA_ID;
const APPLY = process.argv.includes('--apply');

// Exact names of the CloudSwift flows V2 has replaced.
const RETIRE = new Set([
  'CloudSwift Service Picker',
  'CloudSwift Qualification',
  'CloudSwift Book a Call',
  'CloudSwift Lead Qualification',
]);

// Never touch these, even if a name is added to RETIRE by mistake.
const KEEP = new Set([
  'CloudSwift Requirement Picker V2',
  'CloudSwift Qualification V2',
  'CloudSwift Contact Details',
]);

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
  const list = await api(`${GRAPH}/${WABA}/flows?fields=id,name,status&limit=100`);
  const flows = list.data || [];

  console.log(`\nFlows on WABA ${WABA}: ${flows.length}\n`);
  const targets = [];

  for (const f of flows) {
    let action = 'skip';
    if (KEEP.has(f.name)) action = 'KEEP (in use)';
    else if (f.status === 'DEPRECATED') action = 'already deprecated';
    else if (RETIRE.has(f.name)) {
      action = f.status === 'PUBLISHED' ? 'DEPRECATE' : 'DELETE (draft)';
      targets.push({ ...f, action });
    } else action = 'skip (not a CloudSwift V1 flow)';

    console.log(`  ${String(f.id).padEnd(18)} ${String(f.status).padEnd(12)} ${f.name.padEnd(34)} → ${action}`);
  }

  if (targets.length === 0) {
    console.log('\nNothing to retire.');
    return;
  }

  console.log(`\n${targets.length} flow(s) to retire:`);
  targets.forEach((t) => console.log(`  · ${t.name} (${t.id}) → ${t.action}`));

  if (!APPLY) {
    console.log('\nDRY RUN — nothing changed. Re-run with --apply to proceed.');
    console.log('NOTE: deprecating a published Flow is PERMANENT.');
    return;
  }

  console.log('\nApplying...');
  for (const t of targets) {
    try {
      if (t.action === 'DEPRECATE') {
        await api(`${GRAPH}/${t.id}/deprecate`, { method: 'POST' });
        console.log(`  deprecated  ${t.name} (${t.id})`);
      } else {
        await api(`${GRAPH}/${t.id}`, { method: 'DELETE' });
        console.log(`  deleted     ${t.name} (${t.id})`);
      }
    } catch (e) {
      console.error(`  FAILED      ${t.name} (${t.id}): ${e.message}`);
    }
  }

  const after = await api(`${GRAPH}/${WABA}/flows?fields=id,name,status&limit=100`);
  const active = (after.data || []).filter((f) => f.status !== 'DEPRECATED');
  console.log('\nRemaining active flows:');
  active.forEach((f) => console.log(`  ${f.id} | ${f.name} | ${f.status}`));
};

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
