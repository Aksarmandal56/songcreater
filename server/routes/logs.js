import express from 'express';
import SystemLog from '../models/SystemLog.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// Helper to create a log entry (exported for use in other routes)
export async function createLog(user, action, description, metadata = null) {
  try {
    await SystemLog.create({
      action,
      user_id: user?.userId || null,
      user_email: user?.email || null,
      user_role: user?.role || null,
      description,
      metadata
    });
  } catch (err) {
    // Non-critical — don't throw
    console.error('Log creation failed:', err.message);
  }
}

// Get all logs (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { action, limit = 200 } = req.query;
    const filter = {};
    if (action) filter.action = action;

    const logs = await SystemLog.find(filter)
      .sort({ created_at: -1 })
      .limit(parseInt(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
