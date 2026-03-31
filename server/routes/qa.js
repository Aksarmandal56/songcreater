/**
 * QA Workflow APIs
 *
 * GET  /api/qa/orders         — Orders in final_review stage
 * GET  /api/qa/orders/:id     — Order detail
 * POST /api/qa/orders/:id/approve  — Approve → delivered
 * POST /api/qa/orders/:id/rework   — Send back for rework
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Download from '../models/Download.js';
import { authenticateToken } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

const requireQA = (req, res, next) => {
  if (!['admin', 'operator', 'qa_team'].includes(req.user.role)) {
    return res.status(403).json({ error: 'QA team access required' });
  }
  next();
};

// ── List orders pending QA ────────────────────────────────────────────────────

router.get('/orders', authenticateToken, requireQA, async (req, res) => {
  try {
    const filter = { status: 'final_review' };
    if (req.user.role === 'qa_team' && req.user.userId) {
      // QA member sees all final_review orders (or only assigned ones if preferred)
    }
    const orders = await Order.find(filter)
      .populate('package_id', 'name price delivery_hours')
      .sort({ updated_at: 1 }); // oldest first
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Get order for QA review ───────────────────────────────────────────────────

router.get('/orders/:id', authenticateToken, requireQA, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('package_id', 'name price delivery_hours');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Approve & publish delivery files ─────────────────────────────────────────

router.post('/orders/:id/approve', authenticateToken, requireQA, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'delivered';
    order.qa_notes = req.body.qa_notes || order.qa_notes;
    order.updated_at = new Date();
    await order.save();

    // Create Download records for all available files so the customer can access them
    const fileTypes = [
      { key: 'audio_mp3', type: 'mp3' },
      { key: 'audio_wav', type: 'wav' },
      { key: 'audio_instrumental', type: 'instrumental' },
      { key: 'video_reel', type: 'video_reel' },
      { key: 'lyrics_pdf', type: 'lyrics_pdf' },
    ];

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1-year expiry

    for (const f of fileTypes) {
      if (order[f.key]) {
        await Download.findOneAndUpdate(
          { order_id: order._id, file_type: f.type },
          {
            order_id: order._id,
            order_code: order.order_code,
            customer_email: order.customer_email,
            file_type: f.type,
            file_url: order[f.key],
            file_name: `${order.order_code}_${f.type}`,
            expires_at: expiresAt,
            is_active: true
          },
          { upsert: true, new: true }
        );
      }
    }

    await createLog(req.user, 'qa_approved', `Order ${order.order_code} approved and delivered`);
    res.json({ success: true, order });
  } catch (error) {
    console.error('QA approve error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Send back for rework ──────────────────────────────────────────────────────

router.post('/orders/:id/rework', authenticateToken, requireQA, [
  body('reason').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'music_production'; // send back one stage
    order.rework_reason = req.body.reason;
    order.qa_notes = req.body.qa_notes || order.qa_notes;
    order.updated_at = new Date();
    await order.save();

    await createLog(req.user, 'qa_rework', `Order ${order.order_code} sent for rework: ${req.body.reason}`);
    res.json({ success: true, order });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
