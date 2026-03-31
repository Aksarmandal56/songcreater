import express from 'express';
import { body, validationResult } from 'express-validator';
import Package from '../models/Package.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ created_at: 1 });
    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create package (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 1 }),
  body('price').isNumeric(),
  body('delivery_hours').isNumeric(),
  body('description').trim().isLength({ min: 1 }),
  body('category').isIn(['Personal', 'Business', 'Institution'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, delivery_hours, description, category } = req.body;

    const packageData = new Package({
      name,
      price: parseFloat(price),
      delivery_hours: parseInt(delivery_hours),
      description,
      category
    });

    await packageData.save();
    res.status(201).json(packageData);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update package (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('price').optional().isNumeric(),
  body('delivery_hours').optional().isNumeric(),
  body('description').optional().trim().isLength({ min: 1 }),
  body('category').optional().isIn(['Personal', 'Business', 'Institution'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const { name, price, delivery_hours, description, category } = req.body;

    if (name) updateData.name = name;
    if (price) updateData.price = parseFloat(price);
    if (delivery_hours) updateData.delivery_hours = parseInt(delivery_hours);
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    updateData.updated_at = new Date();

    const packageData = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(packageData);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete package (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;