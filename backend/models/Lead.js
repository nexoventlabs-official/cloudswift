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

    // ── V2 · Primary requirement (replaces `topic` as the routing driver) ──
    requirement: {
      type: String,
      enum: ['migration', 'managed_cloud', 'finops', 'security', 'm365', 'ai', 'other', ''],
      default: '',
      index: true
    },
    requirementLabel: { type: String, default: '' },

    // Legacy V1 qualification answers (kept so historic docs still validate).
    // NOTE: companySize is NO LONGER a routing override in V2 — it may only
    // contribute to `fit` after enrichment.
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

    // ── V2 · Qualification answers (each stored individually) ──────────────
    // Q1 — what prompted the enquiry
    trigger: {
      type: String,
      enum: ['active_issue', 'migration_project', 'cost', 'security_compliance', 'new_initiative', 'exploring', ''],
      default: ''
    },
    // Q2 — urgency / timeline (V2 values + legacy V1 values)
    timeline: {
      type: String,
      enum: [
        'asap_30', 'this_quarter', 'next_quarter', 'six_plus', 'exploring',
        'six_months', 'researching', ''
      ],
      default: ''
    },
    // Q3 — role in the evaluation/decision (V2 values + legacy V1 values)
    role: {
      type: String,
      enum: [
        'owner_approver', 'technical_lead', 'evaluation_team', 'research',
        'decision_maker', 'evaluating_team', ''
      ],
      default: ''
    },
    // Q4 — dynamic contextual question, chosen by `requirement`
    contextQuestionId:  { type: String, default: '' },
    contextAnswer:      { type: String, default: '' },
    contextAnswerLabel: { type: String, default: '' },

    // Human escape route. A human request is a HUMAN-INTENT signal only —
    // it never classifies the lead as commercially high-priority by itself.
    talkToPerson:     { type: Boolean, default: false },
    humanRequested:   { type: Boolean, default: false, index: true },
    humanRequestedAt: { type: Date },

    // ── V2 · Assessment (three independent dimensions, no fixed weights) ───
    fit:     { type: String, enum: ['low', 'medium', 'high', ''], default: '' },
    intent:  { type: String, enum: ['low', 'medium', 'high', ''], default: '' },
    urgency: { type: String, enum: ['low', 'medium', 'high', ''], default: '' },
    route: {
      type: String,
      enum: ['HIGH_PRIORITY', 'NURTURE_REVIEW', 'LOW_INTENT_SELF_SERVE', ''],
      default: '',
      index: true
    },
    routeReason: { type: String, default: '' },
    assessedAt:  { type: Date },

    // Legacy score, kept in sync with `route` so existing dashboards/filters
    // keep working (HIGH_PRIORITY→HOT, NURTURE_REVIEW→WARM, LOW→COLD).
    score:  { type: String, enum: ['HOT', 'WARM', 'COLD', 'NEW'], default: 'NEW', index: true },
    scoreTimestamp: { type: Date },

    // Flow state — tracks which step of the WA flow the contact is on
    flowStep: {
      type: String,
      enum: [
        // ── V2 steps ────────────────────────────────────────────────────
        'requirement_sent',       // A0 — requirement picker sent
        'a1_sent_v2',             // A1 — Continue / Talk to specialist
        'qualify_q1',             // Q1 trigger asked
        'qualify_q2',             // Q2 timeline asked
        'qualify_q3',             // Q3 role asked
        'qualify_q4',             // Q4 contextual (list) asked
        'qualify_q4_text',        // Q4 contextual (short text) asked
        'qualify_flow_sent',      // Native multi-screen qualification Flow sent
        'assessed',               // Fit/Intent/Urgency computed, route set
        'awaiting_full_name',     // Contact capture — only missing fields
        'awaiting_company',
        'awaiting_email',
        'contact_flow_sent',      // Native contact Flow sent
        'high_priority_options',  // Book / Callback / Chat offered
        'awaiting_booking_slot',  // Booking — slot only, identity reused
        'booking_requested',
        'awaiting_callback_time',
        'nurture_consent_sent',
        'nurture_active',
        'nurture_declined',
        'self_serve_sent',
        'self_serve_done',
        'human_review',           // Low-confidence free text flagged
        // ── V1 steps (kept so historic docs still validate) ─────────────
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

    // ── V2 · Source / campaign attribution ────────────────────────────────
    source:      { type: String, default: '', index: true },  // e.g. meta_ad, website, direct
    campaign:    { type: String, default: '' },               // ad/campaign name or id
    profileName: { type: String, default: '' },               // WhatsApp profile name

    // First message verbatim (used in sales brief)
    firstMessage: { type: String, default: '' },

    // ── V2 · Free-text handling ───────────────────────────────────────────
    // Every unstructured reply is stored verbatim; classification is
    // best-effort and low confidence is flagged for a human.
    freeTextLog: [
      {
        text:         { type: String, default: '' },
        atStep:       { type: String, default: '' },
        classifiedAs: { type: String, default: '' },  // field:value when matched
        confidence:   { type: Number, default: 0 },   // 0..1
        at:           { type: Date, default: Date.now },
      }
    ],
    needsHumanReview: { type: Boolean, default: false, index: true },
    reviewReason:     { type: String, default: '' },

    // ── V2 · Booking / meeting ────────────────────────────────────────────
    bookingSlot:    { type: String, default: '' },  // free-text or chosen slot
    nurtureConsent: { type: Boolean, default: false },

    // ── V2 · Funnel timestamps (for conversion measurement) ───────────────
    entryAt:                 { type: Date },
    requirementSelectedAt:   { type: Date },
    qualificationStartedAt:  { type: Date },
    qualificationCompletedAt:{ type: Date },
    routedAt:                { type: Date },
    humanHandoffAt:          { type: Date },
    meetingBookedAt:         { type: Date },
    meetingHeldAt:           { type: Date },
    opportunityAt:           { type: Date },
    wonAt:                   { type: Date },
    lostAt:                  { type: Date },
    // Last step the contact abandoned at (set when a resume nudge fires).
    dropOffStep:             { type: String, default: '' },

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
