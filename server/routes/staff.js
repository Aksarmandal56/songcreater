/**
 * Staff Workflow APIs
 *
 * GET  /api/staff/orders              — Orders assigned to current staff member
 * GET  /api/staff/orders/:id          — Order detail
 * POST /api/staff/orders/:id/lyrics   — Submit lyrics (lyrics_team)
 * POST /api/staff/orders/:id/music    — Submit music file URLs (music_production)
 * PUT  /api/staff/orders/:id/status   — Advance order stage
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { authenticateToken } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// Middleware: staff roles only
const requireStaffRole = (req, res, next) => {
  const staffRoles = ['admin', 'operator', 'lyrics_team', 'music_production', 'qa_team', 'support'];
  if (!staffRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
};

// ── GET assigned orders ───────────────────────────────────────────────────────

router.get('/orders', authenticateToken, requireStaffRole, async (req, res) => {
  try {
    const { status } = req.query;
    const { role, userId } = req.user;

    let filter = {};

    // Filter orders relevant to each role
    if (role === 'lyrics_team') {
      filter = { $or: [{ assigned_lyrics_team: userId }, { status: 'lyrics_in_progress' }] };
    } else if (role === 'music_production') {
      filter = { $or: [{ assigned_production_team: userId }, { status: 'music_production' }] };
    } else if (role === 'qa_team') {
      filter = { $or: [{ assigned_qa_team: userId }, { status: 'final_review' }] };
    } else {
      // admin/operator/support see all
      if (status) filter.status = status;
    }

    if (status && !['lyrics_team', 'music_production', 'qa_team'].includes(role)) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('package_id', 'name price delivery_hours')
      .sort({ created_at: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET single order detail ───────────────────────────────────────────────────

router.get('/orders/:id', authenticateToken, requireStaffRole, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('package_id', 'name price delivery_hours');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Submit lyrics ─────────────────────────────────────────────────────────────

router.post('/orders/:id/lyrics', authenticateToken, requireStaffRole, [
  body('lyrics').trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.lyrics = req.body.lyrics;
    if (req.body.music_prompt) order.music_prompt = req.body.music_prompt;
    order.status = 'music_production';
    order.updated_at = new Date();
    await order.save();

    await createLog(req.user, 'lyrics_submitted', `Lyrics submitted for order ${order.order_code}`);
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Submit music files ────────────────────────────────────────────────────────

router.post('/orders/:id/music', authenticateToken, requireStaffRole, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { audio_mp3, audio_wav, audio_instrumental, ai_music_prompt } = req.body;
    if (audio_mp3) order.audio_mp3 = audio_mp3;
    if (audio_wav) order.audio_wav = audio_wav;
    if (audio_instrumental) order.audio_instrumental = audio_instrumental;
    if (ai_music_prompt) order.ai_music_prompt = ai_music_prompt;

    order.status = 'final_review';
    order.updated_at = new Date();
    await order.save();

    await createLog(req.user, 'music_submitted', `Music files submitted for order ${order.order_code}`);
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Update order stage ────────────────────────────────────────────────────────

router.put('/orders/:id/status', authenticateToken, requireStaffRole, [
  body('status').isIn(['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updated_at: new Date() },
      { new: true }
    ).populate('package_id', 'name price delivery_hours');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    await createLog(req.user, 'status_update', `Order ${order.order_code} → ${req.body.status}`);
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
