import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true, index: true },
    title:       { type: String, required: true },
    excerpt:     { type: String, default: '' },
    content:     { type: String, default: '' },
    category:    { type: String, default: 'Cloud Migration' },
    author:      { type: String, default: 'CloudSwift' },
    coverImage:  { type: String, default: '/images/aerolink.jpg' },
    published:   { type: Boolean, default: false, index: true },
    publishedAt: { type: String, default: '' },
    seoTitle:       { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
