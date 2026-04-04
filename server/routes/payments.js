/**
 * Payment APIs
 *
 * POST /api/payments/create        — Create Razorpay order
 * POST /api/payments/verify        — Verify payment signature
 * POST /api/payments/webhook       — Razorpay webhook handler
 * GET  /api/payments/:order_id     — Get payment status for an order
 * GET  /api/admin/payment-gateways — List gateway configs (admin)
 * PUT  /api/admin/payment-gateways/:id — Update gateway keys (admin)
 */

import crypto from 'crypto';
import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import PaymentGateway from '../models/PaymentGateway.js';
import { authenticateToken, requireAdmin } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// Lazy-load Razorpay to avoid crash if credentials not configured
let razorpayInstance = null;
async function getRazorpay() {
  if (razorpayInstance) return razorpayInstance;
  try {
    const gw = await PaymentGateway.findOne({ name: 'razorpay', is_active: true });
    if (!gw?.key_id || !gw?.key_secret) return null;
    const { default: Razorpay } = await import('razorpay');
    razorpayInstance = new Razorpay({ key_id: gw.key_id, key_secret: gw.key_secret });
    return razorpayInstance;
  } catch {
    return null;
  }
}

// ── Create payment order ──────────────────────────────────────────────────────

router.post('/create', authenticateToken, [
  body('order_id').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const order = await Order.findById(req.body.order_id).populate('package_id', 'price');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customer_email !== req.user.email && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const amount = order.total_price || order.package_id?.price || 0;
    const rzp = await getRazorpay();

    let gateway_order_id = null;
    if (rzp) {
      const rzpOrder = await rzp.orders.create({
        amount: amount * 100,
        currency: 'INR',
        receipt: order.order_code,
        notes: { order_code: order.order_code, customer_email: order.customer_email }
      });
      gateway_order_id = rzpOrder.id;
    }

    const payment = new Payment({
      order_id: order._id,
      order_code: order.order_code,
      customer_email: order.customer_email,
      gateway: 'razorpay',
      gateway_order_id,
      amount,
      amount_paise: amount * 100,
      status: 'pending'
    });
    await payment.save();

    res.json({
      payment_id: payment._id,
      gateway_order_id,
      amount,
      amount_paise: amount * 100,
      currency: 'INR',
      order_code: order.order_code,
      customer_email: order.customer_email,
      key_id: gw.key_id,
      razorpay_available: !!rzp
    });
  } catch (error) {
    console.error('Payment create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Verify payment (after Razorpay callback) ──────────────────────────────────

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const payment = await Payment.findOne({ gateway_order_id: razorpay_order_id });
    if (!payment) return res.status(404).json({ error: 'Payment record not found' });

    // Verify signature
    const gw = await PaymentGateway.findOne({ name: 'razorpay' });
    if (gw?.key_secret) {
      const expectedSig = crypto
        .createHmac('sha256', gw.key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSig !== razorpay_signature) {
        payment.status = 'failed';
        payment.failure_reason = 'Signature mismatch';
        await payment.save();
        return res.status(400).json({ error: 'Payment verification failed' });
      }
    }

    payment.status = 'paid';
    payment.gateway_payment_id = razorpay_payment_id;
    payment.gateway_signature = razorpay_signature;
    payment.updated_at = new Date();
    await payment.save();

    // Move order to processing
    await Order.findByIdAndUpdate(payment.order_id, { status: 'processing', updated_at: new Date() });
    await createLog(req.user, 'payment_success', `Payment verified for order ${payment.order_code}`);

    res.json({ success: true, payment_id: payment._id, status: 'paid' });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Razorpay Webhook ──────────────────────────────────────────────────────────

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const gw = await PaymentGateway.findOne({ name: 'razorpay' });
    const webhookSecret = gw?.webhook_secret || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const signature = req.headers['x-razorpay-signature'];
      const expected = crypto.createHmac('sha256', webhookSecret).update(req.body).digest('hex');
      if (signature !== expected) return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);
    const { event: eventType, payload } = event;

    if (eventType === 'payment.captured') {
      const rzp_payment = payload.payment.entity;
      const payment = await Payment.findOne({ gateway_order_id: rzp_payment.order_id });
      if (payment && payment.status !== 'paid') {
        payment.status = 'paid';
        payment.gateway_payment_id = rzp_payment.id;
        payment.updated_at = new Date();
        await payment.save();
        await Order.findByIdAndUpdate(payment.order_id, { status: 'processing', updated_at: new Date() });
      }
    }

    if (eventType === 'payment.failed') {
      const rzp_payment = payload.payment.entity;
      const payment = await Payment.findOne({ gateway_order_id: rzp_payment.order_id });
      if (payment) {
        payment.status = 'failed';
        payment.failure_reason = rzp_payment.error_description;
        payment.updated_at = new Date();
        await payment.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Get payment status ────────────────────────────────────────────────────────

router.get('/:order_id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.customer_email !== req.user.email && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const payment = await Payment.findOne({ order_id: order._id }).sort({ created_at: -1 });
    res.json(payment || { status: 'no_payment' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: List gateway configs ───────────────────────────────────────────────

router.get('/admin/gateways', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const gateways = await PaymentGateway.find().select('-key_secret -webhook_secret');
    res.json(gateways);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: Update gateway ─────────────────────────────────────────────────────

router.put('/admin/gateways/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { key_id, key_secret, webhook_secret, is_active, is_test_mode, display_name } = req.body;
    const update = { updated_at: new Date() };
    if (key_id !== undefined) update.key_id = key_id;
    if (key_secret !== undefined) update.key_secret = key_secret;
    if (webhook_secret !== undefined) update.webhook_secret = webhook_secret;
    if (is_active !== undefined) update.is_active = is_active;
    if (is_test_mode !== undefined) update.is_test_mode = is_test_mode;
    if (display_name !== undefined) update.display_name = display_name;

    razorpayInstance = null; // Reset cached instance
    const gw = await PaymentGateway.findByIdAndUpdate(req.params.id, update, { new: true }).select('-key_secret -webhook_secret');
    if (!gw) return res.status(404).json({ error: 'Gateway not found' });

    await createLog(req.user, 'gateway_update', `Payment gateway ${gw.name} updated`);
    res.json(gw);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: Create gateway ─────────────────────────────────────────────────────

router.post('/admin/gateways', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, display_name, key_id, key_secret, webhook_secret } = req.body;
    const gw = await PaymentGateway.create({ name, display_name, key_id, key_secret, webhook_secret });
    await createLog(req.user, 'gateway_create', `Payment gateway ${name} created`);
    res.status(201).json({ _id: gw._id, name: gw.name, display_name: gw.display_name, is_active: gw.is_active });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Gateway already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
