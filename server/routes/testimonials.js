import express from 'express';
import { body, validationResult } from 'express-validator';
import Testimonial from '../models/Testimonial.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ created_at: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial (admin only)
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }),
  body('quote').trim().isLength({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('photo_url').optional().isURL()
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

    const { name, quote, rating, photo_url } = req.body;

    const testimonial = new Testimonial({
      name,
      quote,
      rating: parseInt(rating),
      photo_url
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update testimonial (admin only)
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('quote').optional().trim().isLength({ min: 1 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('photo_url').optional().isURL()
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
    const { name, quote, rating, photo_url } = req.body;

    if (name) updateData.name = name;
    if (quote) updateData.quote = quote;
    if (rating) updateData.rating = parseInt(rating);
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    updateData.updated_at = new Date();

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;