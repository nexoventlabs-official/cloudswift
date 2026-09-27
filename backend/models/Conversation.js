import mongoose from 'mongoose';

// One conversation per WhatsApp phone number.
// Aggregates all messages and CRM state for that contact.
const ConversationSchema = new mongoose.Schema(
  {
    phone:       { type: String, required: true, unique: true, index: true },
    name:        { type: String, default: '' },
    company:     { type: String, default: '' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date },
    unreadCount: { type: Number, default: 0 },
    // Link to Lead record once qualification starts
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    // CRM label for admin
    label: {
      type: String,
      enum: ['none', 'hot', 'warm', 'cold', 'won', 'follow_up'],
      default: 'none'
    },
    // Whether admin has reviewed this conversation
    reviewed: { type: Boolean, default: false },
    // Pinned in CRM view
    pinned: { type: Boolean, default: false },
    // Human takeover (X4) — when true the bot stops auto-replying to this contact
    botPaused: { type: Boolean, default: false },
    // Opt-out (X3 STOP) — no further automated messages
    optedOut: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
