import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Banner from '../models/Banner.js';
import { authenticateToken } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/banners');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, JPG, and WebP images are allowed'));
  },
});

// GET /api/banners — public, for landing page
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/banners — admin only, multipart upload
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/banners/${req.file.filename}`;
    const altText = req.body.altText || '';
    const sortOrder = req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : 0;

    const banner = new Banner({ imageUrl, altText, sortOrder });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error('Upload banner error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// PATCH /api/banners/:id — admin only, update sort order / altText
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    const update = { updatedAt: new Date() };
    if (req.body.sortOrder !== undefined) update.sortOrder = Number(req.body.sortOrder);
    if (req.body.altText !== undefined) update.altText = req.body.altText;

    const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/banners/:id — admin only
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    // Remove the file from disk using uploadDir and the base filename only
    const filename = path.basename(banner.imageUrl);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
