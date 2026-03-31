import express from 'express';
import { body, validationResult } from 'express-validator';
import Sample from '../models/Sample.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all samples
router.get('/', async (req, res) => {
  try {
    const samples = await Sample.find().sort({ created_at: -1 });
    res.json(samples);
  } catch (error) {
    console.error('Get samples error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create sample (admin only)
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1 }),
  body('genre').trim().isLength({ min: 1 }),
  body('duration').trim().isLength({ min: 1 }),
  body('audio_url').isURL()
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, genre, duration, audio_url } = req.body;

    const sample = new Sample({
      title,
      genre,
      duration,
      audio_url
    });

    await sample.save();
    res.status(201).json(sample);
  } catch (error) {
    console.error('Create sample error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update sample (admin only)
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('genre').optional().trim().isLength({ min: 1 }),
  body('duration').optional().trim().isLength({ min: 1 }),
  body('audio_url').optional().isURL()
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const { title, genre, duration, audio_url } = req.body;

    if (title) updateData.title = title;
    if (genre) updateData.genre = genre;
    if (duration) updateData.duration = duration;
    if (audio_url) updateData.audio_url = audio_url;
    updateData.updated_at = new Date();

    const sample = await Sample.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!sample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    res.json(sample);
  } catch (error) {
    console.error('Update sample error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;