/**
 * Create + upload + publish the CloudSwift lead-qualification WhatsApp Flow.
 * Pattern mirrors the reference projects (create -> assets -> publish).
 * Saves the resulting flow id to backend/.env as WA_LEAD_FLOW_ID.
 *
 * Run:  node scripts/publishLeadFlow.js
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const WABA_ID = process.env.WA_WABA_ID;
const TOKEN = process.env.WA_TOKEN;
const GRAPH = `https://graph.facebook.com/${process.env.WA_GRAPH_VERSION || 'v21.0'}`;

const FLOW_NAME = 'CloudSwift Service Picker';
const FLOW_CATEGORIES = ['LEAD_GENERATION'];
const FLOW_JSON_FILE = path.join(__dirname, '..', 'flows', 'cloudswift_service_flow.json');
const ENV_KEY = 'WA_LEAD_FLOW_ID';

function log(...a) { console.log(...a); }
function fail(...a) { console.error(...a); }

function updateEnvKey(key, value) {
  let content = fs.readFileSync(envPath, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) content = content.replace(regex, `${key}=${value}`);
  else content += `\n# WhatsApp Flow\n${key}=${value}\n`;
  fs.writeFileSync(envPath, content, 'utf8');
}

async function run() {
  if (!WABA_ID || !TOKEN) {
    fail('Missing WA_WABA_ID or WA_TOKEN in backend/.env');
    process.exit(1);
  }
  if (!fs.existsSync(FLOW_JSON_FILE)) {
    fail('Flow JSON not found:', FLOW_JSON_FILE);
    process.exit(1);
  }

  const flowJsonObj = JSON.parse(fs.readFileSync(FLOW_JSON_FILE, 'utf8'));
  const auth = { Authorization: `Bearer ${TOKEN}` };

  // 1. Reuse the existing flow if we already have its id (names must be unique),
  //    otherwise create a new one.
  let flowId = process.env[ENV_KEY];
  if (flowId) {
    log('1) Updating existing flow', flowId, '...');
  } else {
    log('1) Creating flow on WABA', WABA_ID, '...');
    const createRes = await axios.post(
      `${GRAPH}/${WABA_ID}/flows`,
      { name: `${FLOW_NAME}`, categories: FLOW_CATEGORIES },
      { headers: { ...auth, 'Content-Type': 'application/json' } }
    );
    flowId = createRes.data.id;
    log('   -> flow id:', flowId);
  }

  // 2. Upload the flow JSON asset
  log('2) Uploading flow JSON asset ...');
  const form = new FormData();
  form.append('name', 'flow.json');
  form.append('asset_type', 'FLOW_JSON');
  form.append('file', Buffer.from(JSON.stringify(flowJsonObj, null, 2)), {
    filename: 'flow.json',
    contentType: 'application/json',
  });
  const assetRes = await axios.post(`${GRAPH}/${flowId}/assets`, form, {
    headers: { ...auth, ...form.getHeaders() },
  });
  const vErrors = assetRes.data?.validation_errors || [];
  log('   -> validation_errors:', vErrors.length ? JSON.stringify(vErrors, null, 2) : 'none (clean)');
  if (vErrors.length) {
    fail('   Flow JSON has validation errors — not publishing. Fix and re-run.');
    log('   (Draft flow id kept:', flowId, ')');
    process.exit(2);
  }

  // 3. Publish
  log('3) Publishing flow ...');
  const pubRes = await axios.post(`${GRAPH}/${flowId}/publish`, {}, { headers: auth });
  log('   -> publish response:', JSON.stringify(pubRes.data));

  // 4. Confirm status + save
  const statusRes = await axios.get(
    `${GRAPH}/${flowId}?fields=id,name,status,categories,validation_errors`,
    { headers: auth }
  );
  log('4) Final status:', JSON.stringify(statusRes.data, null, 2));

  updateEnvKey(ENV_KEY, flowId);
  log(`   -> saved ${ENV_KEY}=${flowId} to backend/.env`);

  log('\nDONE. Flow id:', flowId, '| status:', statusRes.data.status);
}

run().catch((e) => {
  fail('ERROR:', e?.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
