import express from 'express';
import multer from 'multer';
import FlowAsset from '../models/FlowAsset.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { requireAdmin } from '../middleware/auth.js';
import logger from '../services/logger.js';

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

router.use(requireAdmin);

// ── GET /api/assets — return all assets as key→asset map ────────────────────
router.get('/', async (_req, res) => {
  try {
    const assets = await FlowAsset.find().sort({ group: 1, key: 1 });
    res.json({ success: true, data: assets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/assets/:key — single asset by key ───────────────────────────────
router.get('/:key', async (req, res) => {
  try {
    const asset = await FlowAsset.findOne({ key: req.params.key });
    if (!asset) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/assets — upload image/pdf or save link ────────────────────────
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { key, label, type, group, aspectRatio } = req.body;
    if (!key || !label || !type) {
      return res.status(400).json({ success: false, message: 'key, label, type required' });
    }

    let url = req.body.url || '';
    let publicId = '';
    let mimeType = '';
    let fileSize = 0;

    if (type !== 'link' && req.file) {
      const folder = `cloudswift/${group || 'general'}`.toLowerCase().replace(/\s+/g, '_');
      const resourceType = type === 'pdf' ? 'raw' : 'image';

      // Delete old asset if exists
      const existing = await FlowAsset.findOne({ key });
      if (existing?.publicId) {
        await deleteFromCloudinary(existing.publicId, resourceType);
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder,
        public_id: key,
        resource_type: resourceType,
        overwrite: true,
      });
      url       = result.url;
      publicId  = result.publicId;
      mimeType  = req.file.mimetype;
      fileSize  = req.file.size;
    }

    const asset = await FlowAsset.findOneAndUpdate(
      { key },
      { $set: { key, label, type, group: group || 'General', url, publicId, aspectRatio: aspectRatio || 'original', mimeType, fileSize } },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: asset });
  } catch (err) {
    logger.error('Asset upload error', { error: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/assets/:key ──────────────────────────────────────────────────
router.delete('/:key', async (req, res) => {
  try {
    const asset = await FlowAsset.findOne({ key: req.params.key });
    if (!asset) return res.status(404).json({ success: false, message: 'Not found' });
    if (asset.publicId) {
      const rt = asset.type === 'pdf' ? 'raw' : 'image';
      await deleteFromCloudinary(asset.publicId, rt);
    }
    await FlowAsset.deleteOne({ key: req.params.key });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
