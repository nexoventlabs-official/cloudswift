import mongoose from 'mongoose';

// Every prospect who contacts CloudSwift via WhatsApp is a Lead.
// Score: HOT / WARM / COLD based on qualification answers.
const LeadSchema = new mongoose.Schema(
  {
    // Identity
    phone:   { type: String, required: true, index: true },
    name:    { type: String, default: '' },
    company: { type: String, default: '' },

    // Qualification answers (from Flow 2)
    topic:    {
      type: String,
      enum: ['azure_migration', 'm365', 'managed_cloud', 'security', 'other', ''],
      default: ''
    },
    companySize: {
      type: String,
      enum: ['under_100', '100_500', '500_2000', '2000_plus', ''],
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

    // Scoring
    score:  { type: String, enum: ['HOT', 'WARM', 'COLD', 'NEW'], default: 'NEW', index: true },
    scoreTimestamp: { type: Date },

    // Flow state — tracks which step of the WA flow they're currently on
    flowStep: {
      type: String,
      enum: [
        'flow1_sent',       // First response sent
        'flow2_q1',         // Waiting for company size
        'flow2_q2',         // Waiting for situation
        'flow2_q3',         // Waiting for timeline
        'scored',           // Scoring complete
        'calendly_sent',    // Hot: Calendly link sent
        'call_booked',      // Calendly confirmed
        'nurture_d3',       // Warm Day 3 sent
        'nurture_d7',       // Warm Day 7 sent
        'nurture_d21',      // Warm Day 21 sent
        'cold_exit',        // Cold exit sent
        'closed_won',       // Deal closed
        'completed'
      ],
      default: 'flow1_sent'
    },

    // Entry channel
    channel: {
      type: String,
      enum: ['google_ad', 'meta_ctwa', 'organic', 'cold_email', 'referral', 'direct', 'unknown'],
      default: 'unknown'
    },

    // First message verbatim (used in sales brief)
    firstMessage: { type: String, default: '' },

    // Calendly booking URL sent to them
    calendlyLink: { type: String, default: '' },

    // Admin workflow status
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Discovery', 'Proposal', 'Won', 'Lost', 'Nurturing'],
      default: 'New',
      index: true
    },

    seen:  { type: Boolean, default: false },
    notes: { type: String, default: '' },

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
