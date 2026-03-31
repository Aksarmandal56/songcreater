/**
 * Download APIs
 *
 * GET /api/downloads          — All delivery files for logged-in customer
 * GET /api/downloads/:file_id — Fetch single file (with expiry and auth check)
 * POST /api/downloads/create  — Admin: create download record for an order (after delivery)
 */

import express from 'express';
import Download from '../models/Download.js';
import Order from '../models/Order.js';
import { authenticateToken, requireStaff } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// ── Get customer's files ──────────────────────────────────────────────────────

router.get('/', authenticateToken, async (req, res) => {
  try {
    const filter = req.user.role === 'user'
      ? { customer_email: req.user.email, is_active: true }
      : {}; // staff see all

    const downloads = await Download.find(filter).sort({ created_at: -1 });
    res.json(downloads);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Download single file ──────────────────────────────────────────────────────

router.get('/:file_id', authenticateToken, async (req, res) => {
  try {
    const file = await Download.findById(req.params.file_id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Auth check — user can only access their own files
    if (req.user.role === 'user' && file.customer_email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Expiry check
    if (file.expires_at && new Date() > file.expires_at) {
      return res.status(403).json({ error: 'Download link has expired' });
    }

    // Active check
    if (!file.is_active) {
      return res.status(403).json({ error: 'File is no longer available' });
    }

    // Download count check
    if (file.download_count >= file.max_downloads) {
      return res.status(403).json({ error: 'Maximum downloads reached' });
    }

    // Increment counter
    await Download.findByIdAndUpdate(file._id, { $inc: { download_count: 1 } });

    // Return URL for client-side redirect (for S3/CDN hosted files)
    res.json({ file_url: file.file_url, file_type: file.file_type, file_name: file.file_name });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: create / update download records for an order ─────────────────────

router.post('/create', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { order_id, files } = req.body;
    // files: [{ file_type, file_url, file_name }]

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const created = [];
    for (const f of (files || [])) {
      const doc = await Download.findOneAndUpdate(
        { order_id: order._id, file_type: f.file_type },
        {
          order_id: order._id,
          order_code: order.order_code,
          customer_email: order.customer_email,
          file_type: f.file_type,
          file_url: f.file_url,
          file_name: f.file_name || `${order.order_code}_${f.file_type}`,
          expires_at: expiresAt,
          is_active: true,
        },
        { upsert: true, new: true }
      );
      created.push(doc);
    }

    await createLog(req.user, 'downloads_created', `${created.length} file(s) published for order ${order.order_code}`);
    res.status(201).json(created);
  } catch (error) {
    console.error('Create download error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: list all downloads for an order ────────────────────────────────────

router.get('/order/:order_id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const downloads = await Download.find({ order_id: req.params.order_id });
    res.json(downloads);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
