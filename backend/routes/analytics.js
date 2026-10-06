/**
 * Funnel measurement endpoints.
 *
 * The V2 spec asks for the funnel to be measurable:
 *   Entry → Requirement Selected → Qualification Started →
 *   Qualification Completed → Route → Human Handoff →
 *   Meeting Booked → Meeting Held → Opportunity → Won / Lost
 * plus the drop-off question/step.
 *
 * Everything here reads FunnelEvent rows, so numbers come from recorded
 * events rather than being inferred after the fact.
 */
import express from 'express';
import FunnelEvent from '../models/FunnelEvent.js';
import Lead from '../models/Lead.js';
import { requireAdmin } from '../middleware/auth.js';
import { logEvent } from '../services/funnel.js';
import { emitLeadUpdate } from '../services/eventBus.js';
import logger from '../services/logger.js';

const router = express.Router();
router.use(requireAdmin);

// Ordered funnel stages. Each maps to the event that proves the stage.
const FUNNEL_STAGES = [
  { key: 'entry',                   label: 'Entry',                   event: 'entry' },
  { key: 'requirement_selected',    label: 'Requirement Selected',    event: 'requirement_selected' },
  { key: 'qualification_started',   label: 'Qualification Started',   event: 'qualification_started' },
  { key: 'qualification_completed', label: 'Qualification Completed', event: 'qualification_completed' },
  { key: 'route_assigned',          label: 'Route Assigned',          event: 'route_assigned' },
  { key: 'human_handoff',           label: 'Human Handoff',           event: 'human_handoff' },
  { key: 'meeting_booked',          label: 'Meeting Booked',          event: 'meeting_booked' },
  { key: 'meeting_held',            label: 'Meeting Held',            event: 'meeting_held' },
  { key: 'opportunity',             label: 'Opportunity',             event: 'opportunity' },
  { key: 'won',                     label: 'Won',                     event: 'won' },
  { key: 'lost',                    label: 'Lost',                    event: 'lost' },
];

/** Build a createdAt range filter from ?from / ?to (ISO dates). */
function dateFilter(q) {
  const f = {};
  if (q.from) f.$gte = new Date(q.from);
  if (q.to) f.$lte = new Date(q.to);
  return Object.keys(f).length ? { createdAt: f } : {};
}

/** Optional dimension filters shared by the endpoints. */
function dimFilter(q) {
  const f = {};
  if (q.requirement) f.requirement = q.requirement;
  if (q.route) f.route = q.route;
  if (q.source) f.source = q.source;
  return f;
}

// ── GET /api/analytics/funnel ───────────────────────────────────────────────
// Unique contacts reaching each stage + step-to-step conversion.
router.get('/funnel', async (req, res) => {
  try {
    const base = { ...dateFilter(req.query), ...dimFilter(req.query) };

    const rows = await FunnelEvent.aggregate([
      { $match: base },
      { $group: { _id: '$event', contacts: { $addToSet: '$phone' } } },
      { $project: { event: '$_id', count: { $size: '$contacts' }, _id: 0 } },
    ]);
    const byEvent = Object.fromEntries(rows.map((r) => [r.event, r.count]));

    const entryCount = byEvent.entry || 0;
    let prev = null;
    const stages = FUNNEL_STAGES.map((s) => {
      const count = byEvent[s.event] || 0;
      const fromPrev = prev === null || prev === 0 ? null : Number(((count / prev) * 100).toFixed(1));
      const fromEntry = entryCount ? Number(((count / entryCount) * 100).toFixed(1)) : null;
      // 'lost' shouldn't be treated as a continuation of 'won'.
      if (s.key !== 'lost') prev = count;
      return { ...s, count, conversionFromPrevious: fromPrev, conversionFromEntry: fromEntry };
    });

    res.json({ success: true, stages, raw: byEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/dropoff ──────────────────────────────────────────────
// Which question/step loses people. This is the UX-improvement signal.
router.get('/dropoff', async (req, res) => {
  try {
    const base = { ...dateFilter(req.query), ...dimFilter(req.query), event: 'drop_off' };
    const rows = await FunnelEvent.aggregate([
      { $match: base },
      { $group: { _id: '$step', contacts: { $addToSet: '$phone' } } },
      { $project: { step: '$_id', count: { $size: '$contacts' }, _id: 0 } },
      { $sort: { count: -1 } },
    ]);
    const total = rows.reduce((s, r) => s + r.count, 0);
    res.json({
      success: true,
      total,
      steps: rows.map((r) => ({
        ...r,
        share: total ? Number(((r.count / total) * 100).toFixed(1)) : 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/breakdown ────────────────────────────────────────────
// Route distribution grouped by requirement | source | campaign.
router.get('/breakdown', async (req, res) => {
  try {
    const dim = ['requirement', 'source', 'campaign'].includes(req.query.by) ? req.query.by : 'requirement';
    const base = { ...dateFilter(req.query), event: 'route_assigned' };
    const rows = await FunnelEvent.aggregate([
      { $match: base },
      { $group: { _id: { dim: `$${dim}`, route: '$route' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const out = {};
    for (const r of rows) {
      const key = r._id.dim || 'unknown';
      out[key] = out[key] || { total: 0, HIGH_PRIORITY: 0, NURTURE_REVIEW: 0, LOW_INTENT_SELF_SERVE: 0 };
      out[key].total += r.count;
      if (r._id.route) out[key][r._id.route] = (out[key][r._id.route] || 0) + r.count;
    }
    res.json({ success: true, by: dim, data: out });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/assessment ───────────────────────────────────────────
// How Fit / Intent / Urgency combinations actually distribute.
router.get('/assessment', async (req, res) => {
  try {
    const match = { route: { $ne: '' }, ...(req.query.requirement ? { requirement: req.query.requirement } : {}) };
    const rows = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: { fit: '$fit', intent: '$intent', urgency: '$urgency', route: '$route' },
          count: { $sum: 1 },
          meetings: { $sum: { $cond: [{ $ifNull: ['$meetingBookedAt', false] }, 1, 0] } },
          won: { $sum: { $cond: [{ $ifNull: ['$wonAt', false] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json({
      success: true,
      combinations: rows.map((r) => ({ ...r._id, count: r.count, meetings: r.meetings, won: r.won })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/review-queue ─────────────────────────────────────────
// Leads whose free text couldn't be classified confidently.
router.get('/review-queue', async (_req, res) => {
  try {
    const leads = await Lead.find({ needsHumanReview: true })
      .select('phone name company requirement flowStep reviewReason freeTextLog route createdAt')
      .sort({ updatedAt: -1 })
      .limit(100);
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/analytics/milestone ───────────────────────────────────────────
// Closes the loop from the sales side: meeting_held, opportunity, won, lost.
// Without this the back half of the funnel can never be measured.
const MILESTONES = {
  meeting_held: { field: 'meetingHeldAt', status: 'Discovery' },
  opportunity:  { field: 'opportunityAt', status: 'Proposal' },
  won:          { field: 'wonAt',         status: 'Won' },
  lost:         { field: 'lostAt',        status: 'Lost' },
};

router.post('/milestone', async (req, res) => {
  try {
    const { leadId, phone, milestone, note } = req.body || {};
    const spec = MILESTONES[milestone];
    if (!spec) {
      return res.status(400).json({ success: false, message: `milestone must be one of: ${Object.keys(MILESTONES).join(', ')}` });
    }
    const lead = leadId ? await Lead.findById(leadId) : await Lead.findOne({ phone });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    lead[spec.field] = new Date();
    lead.status = spec.status;
    if (note) lead.notes = `${lead.notes ? `${lead.notes}\n` : ''}${note}`;
    await lead.save();
    emitLeadUpdate(lead);
    await logEvent(lead, milestone, lead.flowStep, { note: note || '' });

    res.json({ success: true, data: lead });
  } catch (err) {
    logger.error('milestone error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/events ───────────────────────────────────────────────
// Raw event feed (debugging / export).
router.get('/events', async (req, res) => {
  try {
    const filter = { ...dateFilter(req.query), ...dimFilter(req.query) };
    if (req.query.event) filter.event = req.query.event;
    if (req.query.phone) filter.phone = req.query.phone;
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const events = await FunnelEvent.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
