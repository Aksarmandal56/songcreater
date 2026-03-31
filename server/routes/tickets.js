import express from 'express';
import { body, validationResult } from 'express-validator';
import Ticket from '../models/Ticket.js';
import { authenticateToken, requireStaff } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// Get all tickets (staff only)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const tickets = await Ticket.find(filter)
      .populate('assigned_staff', 'name email')
      .sort({ created_at: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get customer's own tickets
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer_email: req.user.email }).sort({ created_at: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create ticket (any authenticated user)
router.post('/', authenticateToken, [
  body('subject').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { subject, message, order_code } = req.body;
    const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const ticket = new Ticket({
      ticket_code: ticketCode,
      customer_email: req.user.email,
      customer_name: req.user.name || req.user.email,
      subject,
      message,
      order_code: order_code || null
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ticket status + assign staff (staff only)
router.put('/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { status, assigned_staff } = req.body;
    const update = { updated_at: new Date() };
    if (status) update.status = status;
    if (assigned_staff) update.assigned_staff = assigned_staff;

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('assigned_staff', 'name email');

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    await createLog(req.user, 'ticket_update', `Ticket ${ticket.ticket_code} status → ${status}`);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reply to ticket (staff only)
router.post('/:id/reply', authenticateToken, requireStaff, [
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.replies.push({
      sender_id: req.user.userId,
      sender_name: req.user.name || req.user.email,
      sender_role: req.user.role,
      message: req.body.message
    });
    ticket.status = 'in_progress';
    ticket.updated_at = new Date();
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
