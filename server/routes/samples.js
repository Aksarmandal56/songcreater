import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import Sample from '../models/Sample.js';
import { authenticateToken } from './auth.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage for sample audio/video files
const uploadDir = path.join(__dirname, '../../uploads/samples');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `sample-${safeName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm', 'audio/mp4'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|mp4|wav|ogg|webm|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'));
    }
  },
});

// GET /api/samples - public
router.get('/', async (req, res) => {
  try {
    const samples = await Sample.find().sort({ created_at: -1 });
    res.json(samples);
  } catch (error) {
    console.error('Get samples error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/samples - admin only (with optional file upload)
router.post('/', authenticateToken, upload.single('audio_file'), [
  body('title').trim().isLength({ min: 1 }),
  body('genre').trim().isLength({ min: 1 }),
  body('duration').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, genre, duration, audio_url, image_url, language, category } = req.body;

    // If file uploaded, use local URL; otherwise use provided audio_url
    let finalAudioUrl = audio_url || '';
    if (req.file) {
      finalAudioUrl = `/uploads/samples/${req.file.filename}`;
    }

    const sample = new Sample({
      title,
      genre,
      duration,
      audio_url: finalAudioUrl,
      image_url: image_url || '',
      language: language || '',
      category: category || 'personal',
    });

    await sample.save();
    res.status(201).json(sample);
  } catch (error) {
    console.error('Create sample error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/samples/:id - admin only (with optional file upload)
router.put('/:id', authenticateToken, upload.single('audio_file'), [
  body('title').optional().trim().isLength({ min: 1 }),
  body('genre').optional().trim().isLength({ min: 1 }),
  body('duration').optional().trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const { title, genre, duration, audio_url, image_url, language, category } = req.body;

    if (title) updateData.title = title;
    if (genre) updateData.genre = genre;
    if (duration) updateData.duration = duration;
    if (language !== undefined) updateData.language = language;
    if (category !== undefined) updateData.category = category;
    if (audio_url) updateData.audio_url = audio_url;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (req.file) updateData.audio_url = `/uploads/samples/${req.file.filename}`;
    updateData.updated_at = new Date();

    const sample = await Sample.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!sample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    res.json(sample);
  } catch (error) {
    console.error('Update sample error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/samples/:id - admin only
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const sample = await Sample.findByIdAndDelete(req.params.id);
    if (!sample) return res.status(404).json({ error: 'Sample not found' });
    // Remove file if it was uploaded locally
    if (sample.audio_url && sample.audio_url.startsWith('/uploads/samples/')) {
      const filePath = path.join(__dirname, '../../', sample.audio_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Sample deleted' });
  } catch (error) {
    console.error('Delete sample error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
