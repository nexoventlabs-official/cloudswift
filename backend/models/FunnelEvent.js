import mongoose from 'mongoose';

/**
 * One row per funnel milestone, so conversion can be measured without
 * reverse-engineering it from Lead documents.
 *
 * Measured funnel:
 *   entry → requirement_selected → qualification_started →
 *   qualification_completed → route_assigned → human_handoff →
 *   meeting_booked → meeting_held → opportunity → won / lost
 *
 * `drop_off` additionally records WHICH question/step a contact abandoned,
 * which is what tells us where the UX actually loses people.
 */
export const FUNNEL_EVENTS = [
  'entry',
  'requirement_selected',
  'qualification_started',
  'qualification_completed',
  'route_assigned',
  'human_requested',
  'human_handoff',
  'contact_captured',
  'meeting_booked',
  'meeting_held',
  'opportunity',
  'won',
  'lost',
  'nurture_consent',
  'nurture_sent',
  'nurture_escalated',
  'drop_off',
  'opted_out',
  'free_text_flagged',
  'invalid_input',
];

const FunnelEventSchema = new mongoose.Schema(
  {
    phone:  { type: String, required: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', index: true },

    event: { type: String, enum: FUNNEL_EVENTS, required: true, index: true },

    /** The journey step this happened at (e.g. 'qualify_q2') — key for drop-off analysis. */
    step: { type: String, default: '', index: true },

    // Denormalised dimensions so funnel queries don't need a join.
    requirement: { type: String, default: '', index: true },
    route:       { type: String, default: '', index: true },
    source:      { type: String, default: '', index: true },
    campaign:    { type: String, default: '' },

    /** Free-form extras (answer values, reasons, slot text, assessment, …). */
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Common query shape: "events of type X in a date range".
FunnelEventSchema.index({ event: 1, createdAt: -1 });

export default mongoose.models.FunnelEvent || mongoose.model('FunnelEvent', FunnelEventSchema);
