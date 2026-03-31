import express from 'express';
import { body, validationResult } from 'express-validator';
import Customer from '../models/Customer.js';
import { authenticateToken, requireStaff } from './auth.js';

const router = express.Router();

// Get all customers (admin + operator)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create customer
router.post('/', [
  body('name').trim().isLength({ min: 1 }),
  body('email').isEmail(),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone } = req.body;

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer already exists' });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      total_orders: 0
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update customer
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
  body('total_orders').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const { name, email, phone, total_orders } = req.body;

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (total_orders !== undefined) updateData.total_orders = parseInt(total_orders);
    updateData.updated_at = new Date();

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;