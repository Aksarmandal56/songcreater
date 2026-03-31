/**
 * Admin-specific APIs
 *
 * GET  /api/admin/dashboard              — KPI stats
 * GET  /api/admin/orders                 — Orders with filters
 * GET  /api/admin/orders/export          — CSV export
 * GET  /api/admin/orders/:id             — Order detail
 * PUT  /api/admin/orders/:id/status      — Update order status
 * POST /api/admin/orders/assign          — Assign staff to order
 * GET  /api/admin/customers              — All customers with filter
 * GET  /api/admin/customers/export       — CSV export
 * GET  /api/admin/customers/:id          — Customer detail + orders
 * GET  /api/admin/payment-gateways       — Gateway config list
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Ticket from '../models/Ticket.js';
import PaymentGateway from '../models/PaymentGateway.js';
import { authenticateToken, requireAdmin, requireStaff } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// CSV helper
function toCSV(data, fields) {
  const header = fields.join(',');
  const rows = data.map(row => fields.map(f => JSON.stringify(row[f] ?? '')).join(','));
  return [header, ...rows].join('\n');
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

router.get('/dashboard', authenticateToken, requireStaff, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      total_orders,
      today_orders,
      pending_orders,
      delivered_orders,
      cancelled_orders,
      total_customers,
      open_tickets,
      todayPayments,
      allOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ created_at: { $gte: today } }),
      Order.countDocuments({ status: { $in: ['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review'] } }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'user' }),
      Ticket.countDocuments({ status: 'open' }),
      Payment.find({ status: 'paid', created_at: { $gte: today } }),
      Order.find({ status: { $ne: 'cancelled' } }).select('total_price package_id').populate('package_id', 'price'),
    ]);

    const today_revenue = todayPayments.reduce((s, p) => s + (p.amount || 0), 0);
    const total_revenue = allOrders.reduce((s, o) => s + (o.total_price || o.package_id?.price || 0), 0);

    const upcoming_deadlines = await Order.find({
      deadline: { $gte: new Date(), $lte: new Date(Date.now() + 48 * 3600 * 1000) },
      status: { $nin: ['delivered', 'cancelled'] },
    }).select('order_code customer_name status deadline').sort({ deadline: 1 }).limit(10);

    res.json({
      total_orders,
      today_orders,
      pending_orders,
      delivered_orders,
      cancelled_orders,
      total_customers,
      open_tickets,
      today_revenue,
      total_revenue,
      delivery_rate: total_orders ? Math.round((delivered_orders / total_orders) * 100) : 0,
      upcoming_deadlines,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── List orders with filters ──────────────────────────────────────────────────

router.get('/orders', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { status, customer, music_style, language, deadline_before, deadline_after, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (music_style) filter.music_style = music_style;
    if (language) filter.language = language;
    if (customer) {
      filter.$or = [
        { customer_name: { $regex: customer, $options: 'i' } },
        { customer_email: { $regex: customer, $options: 'i' } },
      ];
    }
    if (deadline_before || deadline_after) {
      filter.deadline = {};
      if (deadline_before) filter.deadline.$lte = new Date(deadline_before);
      if (deadline_after) filter.deadline.$gte = new Date(deadline_after);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('package_id', 'name price delivery_hours')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Export orders as CSV ──────────────────────────────────────────────────────

router.get('/orders/export', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).populate('package_id', 'name price').lean();
    const flat = orders.map(o => ({
      order_code: o.order_code,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      customer_phone: o.customer_phone || '',
      package: o.package_id?.name || '',
      price: o.total_price || o.package_id?.price || 0,
      status: o.status,
      language: o.language || '',
      music_style: o.music_style || '',
      mood: o.mood || '',
      singer_voice: o.singer_voice || '',
      deadline: o.deadline ? new Date(o.deadline).toLocaleDateString('en-IN') : '',
      created_at: new Date(o.created_at).toLocaleDateString('en-IN'),
    }));

    const csv = toCSV(flat, Object.keys(flat[0] || {}));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Order detail ──────────────────────────────────────────────────────────────

router.get('/orders/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('package_id', 'name price delivery_hours')
      .populate('assigned_staff assigned_lyrics_team assigned_production_team assigned_qa_team', 'name email role');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Update order status ───────────────────────────────────────────────────────

router.put('/orders/:id/status', authenticateToken, requireStaff, [
  body('status').isIn(['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updated_at: new Date() },
      { new: true }
    ).populate('package_id', 'name price');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    await createLog(req.user, 'status_update', `Admin: ${order.order_code} → ${req.body.status}`);
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Assign staff to order ─────────────────────────────────────────────────────

router.post('/orders/assign', authenticateToken, requireStaff, [
  body('order_id').trim().isLength({ min: 1 }),
  body('staff_id').trim().isLength({ min: 1 }),
  body('role').isIn(['lyrics', 'production', 'qa', 'general'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { order_id, staff_id, role } = req.body;
    const fieldMap = {
      lyrics:     'assigned_lyrics_team',
      production: 'assigned_production_team',
      qa:         'assigned_qa_team',
      general:    'assigned_staff',
    };

    const update = { [fieldMap[role]]: staff_id, updated_at: new Date() };
    const order = await Order.findByIdAndUpdate(order_id, update, { new: true })
      .populate('package_id', 'name price')
      .populate('assigned_staff assigned_lyrics_team assigned_production_team assigned_qa_team', 'name email role');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    await createLog(req.user, 'staff_assigned', `${role} team assigned to ${order.order_code}`);
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Order timeline ────────────────────────────────────────────────────────────

router.get('/orders/:id/timeline', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role === 'user' && order.customer_email !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const STAGE_ORDER = ['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered'];
    const currentIdx = STAGE_ORDER.indexOf(order.status);

    const timeline = STAGE_ORDER.map((stage, i) => ({
      status: stage,
      label: stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      completed: i < currentIdx || order.status === 'delivered',
      active: stage === order.status,
      timestamp: i === 0 ? order.created_at : i <= currentIdx ? order.updated_at : null,
    }));

    if (order.status === 'cancelled') {
      timeline.push({ status: 'cancelled', label: 'Cancelled', completed: true, active: true, timestamp: order.updated_at });
    }

    res.json({ order_code: order.order_code, current_status: order.status, timeline });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Customers ─────────────────────────────────────────────────────────────────

router.get('/customers', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [customers, total] = await Promise.all([
      User.find(filter).select('-password').sort({ created_at: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ customers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Export customers ──────────────────────────────────────────────────────────

router.get('/customers/export', authenticateToken, requireStaff, async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password').lean();
    const flat = customers.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      city: c.city || '',
      created_at: new Date(c.created_at).toLocaleDateString('en-IN'),
    }));
    const csv = toCSV(flat, Object.keys(flat[0] || {}));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Customer detail + their orders ───────────────────────────────────────────

router.get('/customers/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const orders = await Order.find({ customer_email: customer.email })
      .populate('package_id', 'name price')
      .sort({ created_at: -1 });
    res.json({ customer, orders, total_orders: orders.length });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Payment gateways (proxy to payments route) ────────────────────────────────

router.get('/payment-gateways', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const gateways = await PaymentGateway.find().select('-key_secret -webhook_secret');
    res.json(gateways);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/payment-gateways/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const update = { ...req.body, updated_at: new Date() };
    const gw = await PaymentGateway.findByIdAndUpdate(req.params.id, update, { new: true }).select('-key_secret -webhook_secret');
    if (!gw) return res.status(404).json({ error: 'Gateway not found' });
    await createLog(req.user, 'gateway_update', `Gateway ${gw.name} updated`);
    res.json(gw);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
