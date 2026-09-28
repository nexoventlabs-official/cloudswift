import express from 'express';
import multer from 'multer';
import Blog from '../models/Blog.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import logger from '../services/logger.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export function slugify(title = '') {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

// ── Seed a few starter posts on first run ────────────────────────────────────
async function ensureSeed() {
  const count = await Blog.estimatedDocumentCount();
  if (count > 0) return;
  await Blog.insertMany([
    {
      slug: 'azure-finops-quick-wins',
      title: 'Azure FinOps Quick Wins for Mid-Size Estates',
      excerpt: 'Practical cost controls we roll out in the first 30 days of an Azure managed engagement — without slowing delivery teams.',
      content: `## Why FinOps stalls\n\nMost Azure bills grow because nobody owns tagging, rightsizing, or idle resources.\n\n## What we do first\n\n1. Enforce a tagging baseline (owner, env, cost-center).\n2. Rightsize obvious over-provisioned VMs and disks.\n3. Turn on budgets + anomaly alerts in Cost Management.\n4. Review reservations only after usage stabilizes.\n\n## Result\n\nClients typically see clear visibility within two weeks and measurable savings inside the first quarter.`,
      category: 'FinOps', author: 'CloudSwift Engineering', coverImage: '/images/aerolink.jpg',
      published: true, publishedAt: '2025-11-12',
      seoTitle: 'Azure FinOps Quick Wins | CloudSwift',
      seoDescription: 'Field notes on Azure cost controls CloudSwift applies in the first 30 days of managed engagements.',
    },
    {
      slug: 'zero-downtime-ad-migration-lessons',
      title: 'Lessons From a Multi-Region Active Directory Migration',
      excerpt: 'What actually mattered when migrating AD across many regions with near-zero disruption.',
      content: `## Context\n\nLarge directory estates fail migrations when cutover planning is vague.\n\n## What worked\n\n- Native Microsoft tooling over DIY scripts where possible\n- Region-by-region pilots before global cutover\n- Clear rollback criteria and communication windows\n- Post-migration Group Policy cleanup as a deliberate phase\n\n## Takeaway\n\nTreat identity as a program, not a weekend project.`,
      category: 'Cloud Migration', author: 'CloudSwift Engineering', coverImage: '/images/driveon.jpg',
      published: true, publishedAt: '2025-09-03',
    },
    {
      slug: 'enterprise-ai-readiness-checklist',
      title: 'Enterprise AI Readiness Checklist',
      excerpt: 'Data, security, and ops checks before you pilot ChatGPT-style assistants on company knowledge.',
      content: `## Before the pilot\n\n- Data classification and access boundaries\n- Grounding sources you can actually audit\n- Human escalation paths\n- Cost controls on model usage\n\n## CloudSwift approach\n\nWe start with an AI readiness assessment, then narrow to one high-ROI agent use case before scaling.`,
      category: 'AI', author: 'CloudSwift AI Team', coverImage: '/images/courto.jpg',
      published: true, publishedAt: '2026-01-20',
    },
  ]);
  logger.info('Seeded starter blog posts');
}
ensureSeed().catch((e) => logger.warn('Blog seed skipped', { error: e.message }));

function toApi(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return { ...o, id: String(o._id) };
}

// ── Public: published posts ──────────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
    res.json(posts.map(toApi));
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Admin: all posts incl drafts ─────────────────────────────────────────────
router.get('/all', requireAdmin, async (_req, res) => {
  try {
    const posts = await Blog.find().sort({ updatedAt: -1 });
    res.json(posts.map(toApi));
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Public: single post by slug ──────────────────────────────────────────────
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(toApi(post));
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Admin: image upload (Cloudinary) ─────────────────────────────────────────
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const result = await uploadToCloudinary(req.file.buffer, { folder: 'cloudswift/blog', resource_type: 'image' });
    res.json({ url: result.url });
  } catch (err) {
    logger.error('Blog upload error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin: create / update ───────────────────────────────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.title) return res.status(400).json({ success: false, message: 'Title required' });
    const slug = b.slug || slugify(b.title);
    const post = await Blog.create({
      slug, title: b.title, excerpt: b.excerpt || '', content: b.content || '',
      category: b.category || 'Cloud Migration', author: b.author || 'CloudSwift',
      coverImage: b.coverImage || '/images/aerolink.jpg', published: Boolean(b.published),
      publishedAt: b.publishedAt || new Date().toISOString().slice(0, 10),
      seoTitle: b.seoTitle || '', seoDescription: b.seoDescription || '',
    });
    res.status(201).json(toApi(post));
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const update = { ...b };
    delete update.id; delete update._id;
    if (b.title && !b.slug) update.slug = slugify(b.title);
    const post = await Blog.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(toApi(post));
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
