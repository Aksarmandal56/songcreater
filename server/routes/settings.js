import express from 'express';
import { body, validationResult } from 'express-validator';
import Setting from '../models/Setting.js';
import { authenticateToken, requireAdmin } from './auth.js';
import { createLog } from './logs.js';

const router = express.Router();

// Get settings by type (staff or public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { is_active: true };
    if (type) filter.type = type;
    const settings = await Setting.find(filter).sort({ type: 1, value: 1 });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all settings including inactive (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await Setting.find().sort({ type: 1, value: 1 });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create setting (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('type').trim().isLength({ min: 1 }),
  body('value').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, value, price, description } = req.body;
    const setting = new Setting({ type, value, price: price || 0, description });
    await setting.save();
    await createLog(req.user, 'setting_create', `Setting ${type}:${value} created`);
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update setting (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const update = { ...req.body, updated_at: new Date() };
    const setting = await Setting.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!setting) return res.status(404).json({ error: 'Setting not found' });

    await createLog(req.user, 'setting_update', `Setting ${setting.type}:${setting.value} updated`);
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete setting (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ error: 'Setting not found' });

    await createLog(req.user, 'setting_delete', `Setting ${setting.type}:${setting.value} deleted`);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
