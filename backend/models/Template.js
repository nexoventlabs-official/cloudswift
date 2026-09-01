import mongoose from 'mongoose';

// Stores WhatsApp message templates — both Meta-approved templates and
// internal draft templates used for the flow messages.
const TemplateSchema = new mongoose.Schema(
  {
    // Unique slug used in code to reference this template
    slug: { type: String, required: true, unique: true, index: true },
    // Human-readable name shown in admin
    name: { type: String, required: true },
    // Which flow step this template belongs to
    flowStep: {
      type: String,
      enum: [
        'flow1_first_response',
        'flow2_q1',
        'flow2_q2',
        'flow2_q3',
        'hot_sales_brief',
        'hot_prospect_confirm',
        'pre_call_brief',
        'post_call_followup',
        'nurture_d3',
        'nurture_d7',
        'nurture_d21',
        'cold_exit',
        'custom'
      ],
      default: 'custom'
    },
    // The message body — supports {{variable}} placeholders
    body: { type: String, required: true },
    // Whether this is a Meta-approved template (outbound, session-independent)
    isMetaApproved: { type: Boolean, default: false },
    // Meta template name (for API calls)
    metaTemplateName: { type: String, default: '' },
    // Meta template language code
    metaLanguage: { type: String, default: 'en' },
    // Status
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Archived'],
      default: 'Draft'
    },
    // Quick-reply button labels (up to 3 for interactive messages)
    buttons: [{ type: String }],
    // Notes for admin
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
