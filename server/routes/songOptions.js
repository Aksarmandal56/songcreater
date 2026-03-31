/**
 * Song Options APIs
 * Provide all dropdown data for the order creation form.
 * Data is sourced from the Settings collection (type-filtered).
 *
 * GET /api/music-styles
 * GET /api/languages
 * GET /api/moods
 * GET /api/order-types
 * GET /api/upsells
 */

import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

// Helper: fetch active settings by type and shape them for the frontend
async function getOptions(type) {
  const items = await Setting.find({ type, is_active: true }).sort({ value: 1 });
  return items.map(s => ({ id: s._id, name: s.value, price: s.price || 0, description: s.description || '' }));
}

// GET /api/music-styles
router.get('/music-styles', async (req, res) => {
  try {
    res.json(await getOptions('music_style'));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/languages
router.get('/languages', async (req, res) => {
  try {
    res.json(await getOptions('language'));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/moods
router.get('/moods', async (req, res) => {
  try {
    res.json(await getOptions('mood'));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/order-types
router.get('/order-types', async (req, res) => {
  try {
    res.json(await getOptions('order_type'));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/upsells
router.get('/upsells', async (req, res) => {
  try {
    res.json(await getOptions('upsell'));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
