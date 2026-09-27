import express from 'express';
import Setting from '../models/Setting.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Default settings seeded on first run
const DEFAULT_SETTINGS = [
  { key: 'businessName',    value: 'CloudSwift', label: 'Business Name',             group: 'Business',  inputType: 'text' },
  { key: 'websiteUrl',      value: '',           label: 'Website URL',                group: 'Business',  inputType: 'url' },
  { key: 'salesRepName',    value: 'Divya',      label: 'Sales Rep Name',             group: 'Sales',     inputType: 'text' },
  { key: 'salesRepWaNumber',value: '',           label: 'Sales Rep WhatsApp Number (with country code, e.g. 919XXXXXXXXX)', group: 'Sales', inputType: 'phone' },
  { key: 'calendlyLink',    value: '',           label: 'Calendly Booking Link',      group: 'Sales',     inputType: 'url' },
  { key: 'waGreeting',      value: '',           label: 'WhatsApp Greeting Override (leave blank to use default)', group: 'WhatsApp', inputType: 'textarea' },
  { key: 'flowHeading',     value: 'Welcome to CloudSwift ☁️', label: 'Service Flow — Heading (inside the picker)', group: 'WhatsApp', inputType: 'text' },
  { key: 'flowSubheading',  value: 'Select a service to get started:', label: 'Service Flow — Subheading', group: 'WhatsApp', inputType: 'text' },
  { key: 'caseStudyUrl',    value: '',           label: 'Case Study Link',            group: 'Content',   inputType: 'url' },
  { key: 'overviewPdfUrl',  value: '',           label: 'Managed Services Overview PDF URL', group: 'Content', inputType: 'url' },
  { key: 'pricingFrameworkUrl', value: '',       label: 'Pricing Framework URL',      group: 'Content',   inputType: 'url' },
];

async function seedSettings() {
  for (const s of DEFAULT_SETTINGS) {
    await Setting.findOneAndUpdate(
      { key: s.key },
      { $setOnInsert: s },
      { upsert: true }
    );
  }
}

// Seed on module load
seedSettings().catch(() => {});

// ── GET /api/settings — all settings (admin) ─────────────────────────────────
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const settings = await Setting.find().sort({ group: 1, key: 1 });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/settings — bulk update ─────────────────────────────────────────
router.put('/', requireAdmin, async (req, res) => {
  try {
    // body: { key: value, key2: value2, ... }
    const updates = req.body;
    const ops = Object.entries(updates).map(([key, value]) =>
      Setting.findOneAndUpdate({ key }, { $set: { value: String(value) } }, { upsert: true, new: true })
    );
    const results = await Promise.all(ops);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/settings/:key — single update ───────────────────────────────────
router.put('/:key', requireAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { $set: { value: String(value ?? '') } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
