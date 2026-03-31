import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Package from '../models/Package.js';
import Affiliate from '../models/Affiliate.js';
import { authenticateToken, requireStaff } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({
  dest: path.join(__dirname, '../../uploads/orders/'),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp3|wav|pdf|doc|docx|txt/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

const router = express.Router();

// Get orders for logged-in customer
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer_email: req.user.email })
      .populate('package_id', 'name price delivery_hours')
      .sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin + operator)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('package_id', 'name price delivery_hours')
      .sort({ created_at: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
router.post('/', [
  body('customer_name').trim().isLength({ min: 1 }),
  body('customer_email').isEmail(),
  body('package_id').isMongoId(),
  body('story').optional().trim(),
  body('music_style').optional().trim(),
  body('singer_voice').optional().trim(),
  body('mood').optional().trim(),
  body('language').optional().trim(),
  body('special_message').optional().trim(),
  body('reference_song').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      package_id,
      delivery_date,
      story,
      music_style,
      singer_voice,
      mood,
      language,
      special_message,
      reference_song
    } = req.body;

    // Generate order code
    const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Verify package exists
    const packageExists = await Package.findById(package_id);
    if (!packageExists) {
      return res.status(400).json({ error: 'Invalid package ID' });
    }

    const order = new Order({
      order_code: orderCode,
      customer_name,
      customer_email,
      customer_phone,
      package_id,
      delivery_date,
      story,
      music_style,
      singer_voice,
      mood,
      language,
      special_message,
      reference_song
    });

    await order.save();

    // Populate package info
    await order.populate('package_id', 'name price delivery_hours');

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order (admin + operator) — full production workflow
router.put('/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const allowedFields = [
      'status', 'assigned_staff', 'assigned_lyrics_team', 'assigned_production_team', 'assigned_qa_team',
      'lyrics', 'music_prompt', 'ai_music_prompt',
      'audio_mp3', 'audio_wav', 'audio_instrumental', 'video_reel', 'lyrics_pdf',
      'admin_notes', 'qa_notes', 'rework_reason', 'deadline', 'total_price',
      'upsell_options', 'deliverables'
    ];

    const update = { updated_at: new Date() };
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('package_id', 'name price delivery_hours');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Apply coupon to order ─────────────────────────────────────────────────────

router.post('/apply-coupon', authenticateToken, async (req, res) => {
  try {
    const { order_id, coupon_code } = req.body;
    if (!coupon_code) return res.status(400).json({ error: 'coupon_code required' });

    const order = await Order.findById(order_id).populate('package_id', 'price');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const affiliate = await Affiliate.findOne({ coupon_code: coupon_code.toUpperCase(), is_active: true });
    if (!affiliate) return res.status(404).json({ error: 'Invalid or expired coupon code' });

    const now = new Date();
    if (affiliate.start_date && now < affiliate.start_date) return res.status(400).json({ error: 'Coupon not yet active' });
    if (affiliate.end_date && now > affiliate.end_date) return res.status(400).json({ error: 'Coupon has expired' });
    if (affiliate.usage_limit && affiliate.usage_count >= affiliate.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    const base = order.total_price || order.package_id?.price || 0;
    const discount = affiliate.coupon_type === 'percentage'
      ? Math.round(base * affiliate.discount_value / 100)
      : affiliate.discount_value;
    const new_total = Math.max(base - discount, 0);

    res.json({
      coupon_code: affiliate.coupon_code,
      coupon_type: affiliate.coupon_type,
      discount_value: affiliate.discount_value,
      discount_amount: discount,
      original_price: base,
      new_total
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Checkout — lock order, apply coupon, ready for payment ───────────────────

router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const { order_id, coupon_code, payment_gateway = 'razorpay' } = req.body;

    const order = await Order.findById(order_id).populate('package_id', 'name price delivery_hours');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customer_email !== req.user.email && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let discount = 0;
    let couponApplied = null;
    if (coupon_code) {
      const affiliate = await Affiliate.findOne({ coupon_code: coupon_code.toUpperCase(), is_active: true });
      if (affiliate) {
        const base = order.total_price || order.package_id?.price || 0;
        discount = affiliate.coupon_type === 'percentage'
          ? Math.round(base * affiliate.discount_value / 100)
          : affiliate.discount_value;
        couponApplied = affiliate.coupon_code;

        // Increment usage
        await Affiliate.findByIdAndUpdate(affiliate._id, { $inc: { usage_count: 1 } });
      }
    }

    const final_price = Math.max((order.total_price || order.package_id?.price || 0) - discount, 0);
    order.total_price = final_price;
    order.status = 'received';
    order.updated_at = new Date();
    await order.save();

    res.json({
      order_id: order._id,
      order_code: order.order_code,
      final_price,
      discount_applied: discount,
      coupon_code: couponApplied,
      payment_gateway,
      next_step: `/api/payments/create`,
      message: 'Order confirmed. Proceed to payment.'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Upload reference file for an order ───────────────────────────────────────

router.post('/:id/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customer_email !== req.user.email && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const fileUrl = `/uploads/orders/${req.file.filename}`;
    res.json({
      success: true,
      file_url: fileUrl,
      original_name: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Get order status timeline ─────────────────────────────────────────────────

router.get('/:id/timeline', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role === 'user' && order.customer_email !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const STAGES = ['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered'];
    const currentIdx = STAGES.indexOf(order.status);

    const timeline = STAGES.map((stage, i) => ({
      status: stage,
      label: stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      completed: i < currentIdx || order.status === 'delivered',
      active: stage === order.status,
      timestamp: i === 0 ? order.created_at : (i <= currentIdx ? order.updated_at : null),
    }));

    if (order.status === 'cancelled') {
      timeline.push({ status: 'cancelled', label: 'Cancelled', completed: true, active: true, timestamp: order.updated_at });
    }

    res.json({ order_code: order.order_code, current_status: order.status, rework_reason: order.rework_reason, timeline });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;