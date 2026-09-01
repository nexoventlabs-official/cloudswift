import mongoose from 'mongoose';

// Stores images, PDFs, and links used inside WhatsApp flows.
// Uploaded via admin panel → Cloudinary, URL stored here.
// Key is the unique identifier used in flow messages (e.g. 'welcome_header', 'case_study_pdf').
const FlowAssetSchema = new mongoose.Schema(
  {
    key:         { type: String, required: true, unique: true, index: true },
    label:       { type: String, required: true },
    type:        { type: String, enum: ['image', 'pdf', 'link'], required: true },
    group:       { type: String, default: 'General' },
    // Cloudinary URL (or raw URL for link type)
    url:         { type: String, default: '' },
    // Cloudinary public_id for deletion/replacement
    publicId:    { type: String, default: '' },
    // Aspect ratio hint for admin preview
    aspectRatio: { type: String, default: 'original' },
    // MIME type
    mimeType:    { type: String, default: '' },
    // File size in bytes
    fileSize:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FlowAsset || mongoose.model('FlowAsset', FlowAssetSchema);
