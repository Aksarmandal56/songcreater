import express from 'express';
import { body, validationResult } from 'express-validator';
import Affiliate from '../models/Affiliate.js';
import { authenticateToken, requireAdmin, requireStaff } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// Get all affiliates (staff only)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const affiliates = await Affiliate.find().sort({ created_at: -1 });
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create affiliate/coupon (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 1 }),
  body('coupon_code').trim().isLength({ min: 2 }),
  body('discount_value').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, coupon_code, coupon_type, discount_value, start_date, end_date, usage_limit, commission_percent } = req.body;

    const affiliate = new Affiliate({
      name,
      description,
      coupon_code: coupon_code.toUpperCase(),
      coupon_type: coupon_type || 'percentage',
      discount_value,
      start_date: start_date || null,
      end_date: end_date || null,
      usage_limit: usage_limit || null,
      commission_percent: commission_percent || 0
    });

    await affiliate.save();
    await createLog(req.user, 'affiliate_create', `Affiliate ${affiliate.coupon_code} created`);
    res.status(201).json(affiliate);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Coupon code already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Update affiliate (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const update = { ...req.body, updated_at: new Date() };
    if (update.coupon_code) update.coupon_code = update.coupon_code.toUpperCase();

    const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    await createLog(req.user, 'affiliate_update', `Affiliate ${affiliate.coupon_code} updated`);
    res.json(affiliate);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete affiliate (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findByIdAndDelete(req.params.id);
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    await createLog(req.user, 'affiliate_delete', `Affiliate ${affiliate.coupon_code} deleted`);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate coupon (public)
router.post('/validate', async (req, res) => {
  try {
    const { coupon_code } = req.body;
    if (!coupon_code) return res.status(400).json({ error: 'Coupon code required' });

    const affiliate = await Affiliate.findOne({ coupon_code: coupon_code.toUpperCase(), is_active: true });
    if (!affiliate) return res.status(404).json({ error: 'Invalid coupon code' });

    const now = new Date();
    if (affiliate.start_date && now < affiliate.start_date) return res.status(400).json({ error: 'Coupon not yet active' });
    if (affiliate.end_date && now > affiliate.end_date) return res.status(400).json({ error: 'Coupon expired' });
    if (affiliate.usage_limit && affiliate.usage_count >= affiliate.usage_limit) return res.status(400).json({ error: 'Coupon usage limit reached' });

    res.json({
      valid: true,
      coupon_type: affiliate.coupon_type,
      discount_value: affiliate.discount_value,
      coupon_code: affiliate.coupon_code
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
