/**
 * Generate an RSA-2048 keypair for WhatsApp Flows endpoint encryption.
 * Writes backend/keys/flow_private.pem + flow_public.pem (gitignored) and
 * prints FLOW_PRIVATE_KEY_B64 to paste into Render's env vars.
 * Run: node scripts/generateFlowKeys.js
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS_DIR = path.join(__dirname, '..', 'keys');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, // unencrypted (no passphrase)
});

if (!fs.existsSync(KEYS_DIR)) fs.mkdirSync(KEYS_DIR, { recursive: true });
fs.writeFileSync(path.join(KEYS_DIR, 'flow_private.pem'), privateKey);
fs.writeFileSync(path.join(KEYS_DIR, 'flow_public.pem'), publicKey);

const b64 = Buffer.from(privateKey, 'utf8').toString('base64');

console.log('Keys written to backend/keys/ (gitignored).');
console.log('\n===== Set this in Render env (single line) =====');
console.log('FLOW_PRIVATE_KEY_B64=' + b64);
console.log('\n===== Public key (uploaded to Meta by uploadFlowPublicKey.js) =====');
console.log(publicKey);
