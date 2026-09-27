import mongoose from 'mongoose';

// Every prospect who contacts CloudSwift via WhatsApp is a Lead.
// Score: HOT / WARM / COLD based on qualification answers.
const LeadSchema = new mongoose.Schema(
  {
    // Identity
    phone:   { type: String, required: true, index: true },
    name:     { type: String, default: '' },
    company:  { type: String, default: '' },
    email:    { type: String, default: '' },
    altPhone: { type: String, default: '' },  // separate phone number from the booking form

    // Qualification answers
    topic: {
      type: String,
      enum: ['azure_migration', 'm365', 'managed_cloud', 'security', 'other', ''],
      default: ''
    },
    companySize: {
      type: String,
      enum: ['under_100', '100_500', '500_plus', '500_2000', '2000_plus', ''],
      default: ''
    },
    situation: {
      type: String,
      enum: ['not_working', 'first_eval', 'switching', 'exploring', ''],
      default: ''
    },
    timeline: {
      type: String,
      enum: ['this_quarter', 'next_quarter', 'six_months', 'researching', ''],
      default: ''
    },
    // Q4 — buyer role
    role: {
      type: String,
      enum: ['decision_maker', 'evaluating_team', ''],
      default: ''
    },
    // A1 — asked to skip qualification and talk to a human
    talkToPerson: { type: Boolean, default: false },

    // Scoring
    score:  { type: String, enum: ['HOT', 'WARM', 'COLD', 'NEW'], default: 'NEW', index: true },
    scoreTimestamp: { type: Date },

    // Flow state — tracks which step of the WA flow the contact is on
    flowStep: {
      type: String,
      enum: [
        'entry',                  // First touch, A0 flow sent
        'a0_sent',                // Service picker flow sent
        'a1_sent',                // Continue / Talk-to-person asked
        'qualify_sent',           // Multi-screen qualification Flow sent
        'q1_sent',                // Company size asked (button fallback)
        'q2_sent',                // Situation asked
        'q3_sent',                // Timeline asked
        'q4_sent',                // Role asked
        'scored',                 // Scoring complete
        // HOT
        'awaiting_name_company',  // H1 — waiting for name + company
        'h2_sent',                // Book / Callback / Chat asked
        'awaiting_booking',       // Booking form flow sent, waiting for details
        'booking_sent',           // Booking details captured
        'awaiting_callback_time', // H4 — waiting for preferred callback time
        'callback_ack',           // H11 — callback acknowledged
        'human_handoff',          // Chat — assigned to a person, bot paused
        // WARM
        'warm_checklist',         // A-W checklist sent
        'n1_sent',                // Nurture permission asked
        'nurture_d3',
        'nurture_d7',
        'nurture_d21',
        'warm_declined',          // X6 — declined nurture
        // COLD
        'cold_guide',             // A-C guide sent
        'cold_exit',
        // Terminal
        'opted_out',              // X3 — STOP
        'completed',
        // Legacy (kept so old docs still validate on save)
        'flow1_sent', 'flow2_q1', 'flow2_q2', 'flow2_q3',
        'calendly_sent', 'call_booked', 'closed_won'
      ],
      default: 'entry'
    },

    // Entry channel + ad referral (click-to-WhatsApp)
    channel: {
      type: String,
      enum: ['google_ad', 'meta_ctwa', 'organic', 'cold_email', 'referral', 'direct', 'unknown'],
      default: 'unknown'
    },
    referral: {
      sourceUrl:   { type: String, default: '' },
      sourceId:    { type: String, default: '' },  // ad id
      sourceType:  { type: String, default: '' },  // 'ad' | 'post'
      headline:    { type: String, default: '' },
      body:        { type: String, default: '' },
      ctwaClid:    { type: String, default: '' },
      mediaType:   { type: String, default: '' },
    },

    // First message verbatim (used in sales brief)
    firstMessage: { type: String, default: '' },

    // Calendly booking URL sent to them + callback preference
    calendlyLink: { type: String, default: '' },
    callbackTime: { type: String, default: '' },

    // Admin workflow status
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Discovery', 'Proposal', 'Won', 'Lost', 'Nurturing'],
      default: 'New',
      index: true
    },

    seen:  { type: Boolean, default: false },
    notes: { type: String, default: '' },

    // Opt-out (X3 STOP)
    optedOut: { type: Boolean, default: false },

    // Safety nets
    invalidCount:     { type: Number, default: 0 },  // X1 — consecutive unrecognised inputs
    resumeAt:         { type: Date },                 // X2 — when to send drop-off resume nudge
    resumeNudgeSent:  { type: Boolean, default: false },

    // Nurture scheduling
    nurtureD3At:  { type: Date },
    nurtureD7At:  { type: Date },
    nurtureD21At: { type: Date },
    nurtureD3Sent:  { type: Boolean, default: false },
    nurtureD7Sent:  { type: Boolean, default: false },
    nurtureD21Sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
