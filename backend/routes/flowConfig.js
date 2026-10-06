/**
 * Read/write the V2 flow configuration.
 *
 * The spec asks for requirement options, questions, routing thresholds and
 * nurture content to be "configurable rather than hard-coded wherever
 * practical". The defaults live in config/v2Flow.js; anything saved here is
 * stored as the `v2FlowConfig` Setting and deep-merged over those defaults at
 * runtime — so the journey can be retuned with no deploy and no code change.
 */
import express from 'express';
import Setting from '../models/Setting.js';
import { requireAdmin } from '../middleware/auth.js';
import { V2_CONFIG, getConfig, clearConfigCache } from '../config/v2Flow.js';
import logger from '../services/logger.js';

const router = express.Router();
router.use(requireAdmin);

// ── GET /api/flow-config — effective config (defaults + overrides) ──────────
router.get('/', async (_req, res) => {
  try {
    const effective = await getConfig({ fresh: true });
    const s = await Setting.findOne({ key: 'v2FlowConfig' });
    let overrides = s?.value ?? null;
    if (typeof overrides === 'string') {
      try { overrides = JSON.parse(overrides); } catch { /* keep raw */ }
    }
    res.json({ success: true, effective, overrides, defaults: V2_CONFIG });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/flow-config/defaults — untouched defaults ─────────────────────
router.get('/defaults', (_req, res) => {
  res.json({ success: true, data: V2_CONFIG });
});

// ── PUT /api/flow-config — replace the override object ─────────────────────
// Body: a partial config object. Only the keys you send are overridden
// (deep-merged); arrays replace wholesale.
router.put('/', async (req, res) => {
  try {
    const body = req.body?.overrides ?? req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: 'Body must be a config object' });
    }
    await Setting.findOneAndUpdate(
      { key: 'v2FlowConfig' },
      { $set: { key: 'v2FlowConfig', value: body } },
      { upsert: true, new: true }
    );
    clearConfigCache();
    const effective = await getConfig({ fresh: true });
    logger.info('V2 flow config updated');
    res.json({ success: true, effective });
  } catch (err) {
    logger.error('flow-config update failed', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/flow-config — drop overrides, back to defaults ──────────────
router.delete('/', async (_req, res) => {
  try {
    await Setting.deleteOne({ key: 'v2FlowConfig' });
    clearConfigCache();
    res.json({ success: true, message: 'Overrides cleared — defaults restored' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
