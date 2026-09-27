/**
 * Create + upload + publish the CloudSwift multi-screen qualification Flow.
 * Saves the flow id to backend/.env as WA_QUALIFY_FLOW_ID.
 * Run:  node scripts/publishQualifyFlow.js
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

const FLOW_NAME = 'CloudSwift Qualification';
const FLOW_CATEGORIES = ['LEAD_GENERATION'];
const FLOW_JSON_FILE = path.join(__dirname, '..', 'flows', 'cloudswift_qualify_flow.json');
const ENV_KEY = 'WA_QUALIFY_FLOW_ID';

function updateEnvKey(key, value) {
  let content = fs.readFileSync(envPath, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) content = content.replace(regex, `${key}=${value}`);
  else content += `\n${key}=${value}\n`;
  fs.writeFileSync(envPath, content, 'utf8');
}

async function run() {
  if (!WABA_ID || !TOKEN) { console.error('Missing WA_WABA_ID or WA_TOKEN'); process.exit(1); }
  const flowJsonObj = JSON.parse(fs.readFileSync(FLOW_JSON_FILE, 'utf8'));
  const auth = { Authorization: `Bearer ${TOKEN}` };

  let flowId = process.env[ENV_KEY];
  if (flowId) {
    console.log('1) Updating existing flow', flowId, '...');
  } else {
    console.log('1) Creating flow ...');
    const createRes = await axios.post(
      `${GRAPH}/${WABA_ID}/flows`,
      { name: FLOW_NAME, categories: FLOW_CATEGORIES },
      { headers: { ...auth, 'Content-Type': 'application/json' } }
    );
    flowId = createRes.data.id;
    console.log('   -> flow id:', flowId);
  }

  // This flow uses a server data endpoint (dynamic branching + 500+ early close).
  // Set endpoint_uri to the deployed backend BEFORE publishing (Meta health-checks it).
  const ENDPOINT_URI = process.env.WA_FLOW_ENDPOINT_URI
    || `${(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '')}/api/whatsapp/flow-endpoint`;
  console.log('1b) Setting endpoint_uri ->', ENDPOINT_URI);
  try {
    const epRes = await axios.post(`${GRAPH}/${flowId}`, { endpoint_uri: ENDPOINT_URI }, { headers: { ...auth, 'Content-Type': 'application/json' } });
    console.log('   -> endpoint set:', JSON.stringify(epRes.data));
  } catch (e) {
    console.error('   endpoint_uri set FAILED:', e.response?.data ? JSON.stringify(e.response.data) : e.message);
  }

  console.log('2) Uploading flow JSON asset ...');
  const form = new FormData();
  form.append('name', 'flow.json');
  form.append('asset_type', 'FLOW_JSON');
  form.append('file', Buffer.from(JSON.stringify(flowJsonObj, null, 2)), { filename: 'flow.json', contentType: 'application/json' });
  const assetRes = await axios.post(`${GRAPH}/${flowId}/assets`, form, { headers: { ...auth, ...form.getHeaders() } });
  const vErrors = assetRes.data?.validation_errors || [];
  console.log('   -> validation_errors:', vErrors.length ? JSON.stringify(vErrors, null, 2) : 'none (clean)');
  if (vErrors.length) { console.error('   Fix validation errors before publishing. Draft id:', flowId); process.exit(2); }

  console.log('3) Publishing (Meta will health-check the endpoint) ...');
  const pubRes = await axios.post(`${GRAPH}/${flowId}/publish`, {}, { headers: auth });
  console.log('   -> publish:', JSON.stringify(pubRes.data));

  const statusRes = await axios.get(`${GRAPH}/${flowId}?fields=id,name,status,validation_errors`, { headers: auth });
  console.log('4) Final status:', JSON.stringify(statusRes.data, null, 2));

  updateEnvKey(ENV_KEY, flowId);
  console.log(`   -> saved ${ENV_KEY}=${flowId}`);
  console.log('\nDONE. Flow id:', flowId, '| status:', statusRes.data.status);
}

run().catch((e) => {
  console.error('ERROR:', e?.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
