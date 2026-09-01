import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendText } from '../services/metaCloud.js';
import logger from '../services/logger.js';

const router = express.Router();
router.use(requireAdmin);

// ── GET /api/crm/conversations ────────────────────────────────────────────────
router.get('/conversations', async (req, res) => {
  try {
    const { label, page = 1, limit = 50, search } = req.query;
    const filter = {};
    if (label && label !== 'all') filter.label = label;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { phone: re }, { company: re }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [convs, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ pinned: -1, lastMessageAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Conversation.countDocuments(filter),
    ]);
    res.json({ success: true, data: convs, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/crm/conversations/:phone/messages ────────────────────────────────
router.get('/conversations/:phone/messages', async (req, res) => {
  try {
    const { phone } = req.params;
    const messages = await Message.find({ phone })
      .sort({ createdAt: 1 })
      .limit(200);

    // Mark conversation as reviewed
    await Conversation.findOneAndUpdate({ phone }, { $set: { reviewed: true, unreadCount: 0 } });

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/crm/conversations/:phone/send ───────────────────────────────────
router.post('/conversations/:phone/send', async (req, res) => {
  try {
    const { phone }   = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'message required' });

    const result = await sendText(phone, message);

    // Log outbound message
    const conv = await Conversation.findOne({ phone });
    if (conv) {
      await Message.create({
        phone,
        conversationId: conv._id,
        direction: 'outbound',
        type: 'text',
        body: message,
        waMessageId: result?.messages?.[0]?.id || '',
        status: 'sent',
      });
      await Conversation.findOneAndUpdate(
        { phone },
        { $set: { lastMessage: message, lastMessageAt: new Date() } }
      );
    }

    res.json({ success: true, message: 'Sent' });
  } catch (err) {
    logger.error('CRM send error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/crm/conversations/:phone — update label, pinned ───────────────
router.patch('/conversations/:phone', async (req, res) => {
  try {
    const allowed = ['label', 'pinned', 'reviewed', 'name', 'company'];
    const update  = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    }
    const conv = await Conversation.findOneAndUpdate(
      { phone: req.params.phone },
      { $set: update },
      { new: true }
    );
    if (!conv) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: conv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
