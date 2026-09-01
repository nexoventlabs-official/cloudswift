import express from 'express';
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Template from '../models/Template.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === validUser && password === validPass) {
    return res.json({
      success: true,
      token: process.env.ADMIN_TOKEN || 'cloudswift_admin_session_token_2026',
      user: { username, role: 'Administrator' },
    });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// All routes below require auth
router.use(requireAdmin);

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const [
      totalLeads, hotLeads, warmLeads, coldLeads,
      wonLeads, newToday, totalConvs, unreadConvs, totalMessages
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ score: 'HOT' }),
      Lead.countDocuments({ score: 'WARM' }),
      Lead.countDocuments({ score: 'COLD' }),
      Lead.countDocuments({ status: 'Won' }),
      Lead.countDocuments({ createdAt: { $gte: today } }),
      Conversation.countDocuments(),
      Conversation.countDocuments({ unreadCount: { $gt: 0 } }),
      Message.countDocuments(),
    ]);
    res.json({
      success: true,
      stats: {
        totalLeads, hotLeads, warmLeads, coldLeads,
        wonLeads, newToday, totalConvs, unreadConvs, totalMessages,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Templates CRUD ───────────────────────────────────────────────────────────

router.get('/templates', async (_req, res) => {
  try {
    const templates = await Template.find().sort({ flowStep: 1, createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/templates', async (req, res) => {
  try {
    const t = await Template.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/templates/:id', async (req, res) => {
  try {
    const t = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: t });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/templates/:id', async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
