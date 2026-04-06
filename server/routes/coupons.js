import express from 'express';
import Coupon from '../models/Coupon.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// Get all coupons (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ created_at: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, description, coupon_type, discount_value, min_order_value, max_discount, usage_limit, start_date, end_date } = req.body;
    if (!code || !discount_value) return res.status(400).json({ error: 'Code and discount value are required' });

    const coupon = new Coupon({
      code: code.toUpperCase().trim(),
      description,
      coupon_type: coupon_type || 'percentage',
      discount_value: parseFloat(discount_value),
      min_order_value: min_order_value ? parseFloat(min_order_value) : 0,
      max_discount: max_discount ? parseFloat(max_discount) : null,
      usage_limit: usage_limit ? parseInt(usage_limit) : null,
      start_date: start_date || null,
      end_date: end_date || null,
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Coupon code already exists' });
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update coupon (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, description, coupon_type, discount_value, min_order_value, max_discount, usage_limit, start_date, end_date, is_active } = req.body;
    const updateData = { updated_at: new Date() };
    if (code !== undefined) updateData.code = code.toUpperCase().trim();
    if (description !== undefined) updateData.description = description;
    if (coupon_type !== undefined) updateData.coupon_type = coupon_type;
    if (discount_value !== undefined) updateData.discount_value = parseFloat(discount_value);
    if (min_order_value !== undefined) updateData.min_order_value = parseFloat(min_order_value);
    if (max_discount !== undefined) updateData.max_discount = max_discount ? parseFloat(max_discount) : null;
    if (usage_limit !== undefined) updateData.usage_limit = usage_limit ? parseInt(usage_limit) : null;
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;
    if (is_active !== undefined) updateData.is_active = is_active;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Coupon code already exists' });
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete coupon (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate coupon (public - used at checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), is_active: true });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });

    const now = new Date();
    if (coupon.start_date && now < coupon.start_date) return res.status(400).json({ error: 'Coupon not yet active' });
    if (coupon.end_date && now > coupon.end_date) return res.status(400).json({ error: 'Coupon has expired' });
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return res.status(400).json({ error: 'Coupon usage limit reached' });

    res.json({
      valid: true,
      code: coupon.code,
      coupon_type: coupon.coupon_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_discount: coupon.max_discount,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
