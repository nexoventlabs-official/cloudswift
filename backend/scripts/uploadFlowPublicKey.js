/**
 * Upload the Flow public key to Meta and subscribe the WABA (required for Flows).
 * Run: node scripts/uploadFlowPublicKey.js
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const GRAPH = `https://graph.facebook.com/${process.env.WA_GRAPH_VERSION || 'v21.0'}`;
const TOKEN = process.env.WA_TOKEN;
const PHONE_ID = process.env.WA_PHONE_NUMBER_ID;
const WABA_ID = process.env.WA_WABA_ID;
const headers = { Authorization: `Bearer ${TOKEN}` };

const publicKey = process.env.FLOW_PUBLIC_KEY
  ? process.env.FLOW_PUBLIC_KEY.split('\\n').join('\n')
  : fs.readFileSync(path.join(__dirname, '..', 'keys', 'flow_public.pem'), 'utf8');

async function main() {
  // Subscribe the WABA (required for Flows health checks)
  try {
    const { data } = await axios.post(`${GRAPH}/${WABA_ID}/subscribed_apps`, {}, { headers });
    console.log('subscribed_apps:', JSON.stringify(data));
  } catch (e) { console.log('subscribe:', e.response?.data?.error?.message || e.message); }

  // Register the business public key on the phone number
  try {
    const { data } = await axios.post(
      `${GRAPH}/${PHONE_ID}/whatsapp_business_encryption`,
      new URLSearchParams({ business_public_key: publicKey }),
      { headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('public key upload:', JSON.stringify(data));
  } catch (e) { console.log('upload FAILED:', e.response?.data?.error?.message || e.message); }

  // Read back status
  try {
    const { data } = await axios.get(`${GRAPH}/${PHONE_ID}/whatsapp_business_encryption`, { headers });
    console.log('status:', data?.business_public_key_signature_status || 'n/a', '| key present:', !!data?.business_public_key);
  } catch (e) { console.log('status read FAILED:', e.response?.data?.error?.message || e.message); }
}
main();
