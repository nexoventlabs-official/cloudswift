import express from 'express';
import Lead from '../models/Lead.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendText } from '../services/metaCloud.js';
import { POST_CALL_MSG } from '../services/flowMessages.js';
import { routeToScore } from '../services/assessment.js';
import { logEvent } from '../services/funnel.js';
import logger from '../services/logger.js';

const router = express.Router();

// All leads routes require admin auth
router.use(requireAdmin);

// ── GET /api/leads — list all leads with filters ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { score, status, page = 1, limit = 50, search } = req.query;
    const filter = {};
    if (score)  filter.score  = score;
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { phone: re }, { company: re }];
    }
    const skip  = (Number(page) - 1) * Number(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);
    res.json({ success: true, data: leads, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/leads/stats — dashboard counts ───────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const [total, hot, warm, cold, won, nurturing, newToday] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ score: 'HOT' }),
      Lead.countDocuments({ score: 'WARM' }),
      Lead.countDocuments({ score: 'COLD' }),
      Lead.countDocuments({ status: 'Won' }),
      Lead.countDocuments({ status: 'Nurturing' }),
      Lead.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
    ]);
    res.json({ success: true, stats: { total, hot, warm, cold, won, nurturing, newToday } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/leads/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/leads/:id — update status, score, notes etc. ──────────────────
router.patch('/:id', async (req, res) => {
  try {
    // V2 adds manual sales-review controls: a rep can promote/demote the
    // route and correct any captured answer, and clear the review flag.
    const allowed = [
      'status', 'score', 'notes', 'company', 'name', 'email', 'seen', 'flowStep',
      'route', 'routeReason', 'fit', 'intent', 'urgency',
      'requirement', 'trigger', 'timeline', 'role',
      'contextAnswer', 'contextAnswerLabel',
      'needsHumanReview', 'reviewReason', 'bookingSlot', 'callbackTime',
      'source', 'campaign',
    ];
    const update  = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    }
    // Manual route change (sales-review promotion/demotion): keep the legacy
    // score in sync so existing dashboards stay correct, and stamp the time.
    if (update.route !== undefined) {
      if (update.score === undefined) update.score = routeToScore(update.route);
      update.routedAt = new Date();
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Not found' });
    if (update.route !== undefined) {
      await logEvent(lead, 'route_assigned', lead.flowStep, { route: update.route, manual: true });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/leads/:id/mark-seen ─────────────────────────────────────────────
router.post('/:id/mark-seen', async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { $set: { seen: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/leads/:id/post-call — trigger post-call follow-up WA message ───
router.post('/:id/post-call', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Not found' });

    await sendText(lead.phone, POST_CALL_MSG(lead.name || 'there'));
    lead.flowStep = 'call_booked';
    lead.status   = 'Discovery';
    await lead.save();

    res.json({ success: true, message: 'Post-call follow-up sent' });
  } catch (err) {
    logger.error('Post-call send error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/leads/:id/send-message — manual WA message from admin ──────────
router.post('/:id/send-message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'message required' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Not found' });

    await sendText(lead.phone, message);
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/leads/:id ─────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
