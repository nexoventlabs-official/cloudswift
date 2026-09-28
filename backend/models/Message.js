import mongoose from 'mongoose';

// Individual WhatsApp message record for CRM chat log.
const MessageSchema = new mongoose.Schema(
  {
    phone:          { type: String, required: true, index: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', index: true },
    // 'inbound' = from prospect, 'outbound' = sent by system/admin
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    // WA message type
    type: {
      type: String,
      enum: ['text', 'button', 'list', 'flow', 'image', 'document', 'template', 'interactive'],
      default: 'text'
    },
    body:        { type: String, default: '' },
    // Meta message ID (for dedup and status tracking)
    waMessageId: { type: String, default: '', index: true },
    // Delivery status
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed', 'received'],
      default: 'sent'
    },
    // Template name if this was a template message
    templateName: { type: String, default: '' },
    // Rich rendering metadata for CRM: { kind, headerKey, buttons:[titles], flowCta, replyTitle }
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Raw Meta payload for debugging
    rawPayload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
