/**
 * Re-register existing Cloudinary images as FlowAsset records in MongoDB.
 *
 * Why this exists: the images live in Cloudinary, but the URLs that the bot
 * uses are looked up from the `flowassets` collection. After switching to a
 * new/empty database those records are gone, so headers silently stop
 * rendering even though the files are still in the CDN. This rebuilds the
 * records from what's actually in Cloudinary — no re-uploading needed.
 *
 * Run:  node scripts/importCloudinaryAssets.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import FlowAsset from '../models/FlowAsset.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const PREFIX = process.env.CLOUDINARY_PREFIX || 'cloudswift';

if (!CLOUD || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials in backend/.env');
  process.exit(1);
}

const GROUP_LABELS = {
  message_headers: 'Message Headers',
  service_icons: 'Service Icons',
  welcome_branding: 'Welcome Branding',
};

const humanize = (s) =>
  String(s).replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

async function listResources(resourceType = 'image') {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  const out = [];
  let cursor = null;
  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/${resourceType}`);
    url.searchParams.set('prefix', PREFIX);
    url.searchParams.set('type', 'upload');
    url.searchParams.set('max_results', '500');
    if (cursor) url.searchParams.set('next_cursor', cursor);

    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Cloudinary ${resourceType} list failed (${res.status}): ${body}`);
    }
    const json = await res.json();
    out.push(...(json.resources || []));
    cursor = json.next_cursor || null;
  } while (cursor);
  return out;
}

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
  console.log(`Connected to MongoDB (${mongoose.connection.name})`);

  const images = await listResources('image');
  // PDFs/other files are stored as `raw` in Cloudinary — pick them up too.
  let raws = [];
  try { raws = await listResources('raw'); } catch { /* none is fine */ }

  const all = [
    ...images.map((r) => ({ ...r, _type: 'image' })),
    ...raws.map((r) => ({ ...r, _type: 'pdf' })),
  ];
  console.log(`Found ${all.length} Cloudinary assets under "${PREFIX}/"`);

  let created = 0;
  let updated = 0;

  for (const r of all) {
    const parts = String(r.public_id).split('/');      // cloudswift/<group>/<key>
    const key = parts[parts.length - 1];
    const groupRaw = parts.length >= 3 ? parts[parts.length - 2] : 'general';
    const group = GROUP_LABELS[groupRaw] || humanize(groupRaw);
    const url = r.secure_url || r.url;

    const existing = await FlowAsset.findOne({ key });
    const doc = {
      key,
      label: humanize(key),
      type: r._type,
      group,
      url,
      publicId: r.public_id,
      mimeType: r.format ? `${r._type === 'image' ? 'image' : 'application'}/${r.format}` : '',
      fileSize: r.bytes || 0,
    };

    // Don't clobber a label an admin may have customised.
    if (existing) {
      doc.label = existing.label || doc.label;
      await FlowAsset.updateOne({ key }, { $set: doc });
      updated++;
      console.log(`  updated  ${key.padEnd(20)} ${group}`);
    } else {
      await FlowAsset.create(doc);
      created++;
      console.log(`  created  ${key.padEnd(20)} ${group}`);
    }
  }

  const total = await FlowAsset.countDocuments();
  console.log(`\nDone. created=${created} updated=${updated} · flowassets total=${total}`);
  await mongoose.disconnect();
};

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
