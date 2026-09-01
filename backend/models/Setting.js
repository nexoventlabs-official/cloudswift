import mongoose from 'mongoose';

// Key-value store for system settings editable from the admin panel.
// Examples: salesRepName, calendlyLink, businessName, greeting text overrides.
const SettingSchema = new mongoose.Schema(
  {
    key:         { type: String, required: true, unique: true, index: true },
    value:       { type: String, default: '' },
    label:       { type: String, default: '' },
    description: { type: String, default: '' },
    group:       { type: String, default: 'General' },
    // 'text' | 'textarea' | 'url' | 'phone' | 'toggle'
    inputType:   { type: String, default: 'text' },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
