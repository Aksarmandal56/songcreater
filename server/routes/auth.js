import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Only admin can access
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Admin or operator can access
export const requireStaff = (req, res, next) => {
  if (!['admin', 'operator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
};

// Register (public users only)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ email, password, name, role: 'user' });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Social Login (Google / Facebook stub — integrate OAuth provider tokens here)
router.post('/social-login', async (req, res) => {
  try {
    const { provider, access_token } = req.body;
    if (!provider || !access_token) return res.status(400).json({ error: 'provider and access_token required' });

    // TODO: verify access_token with Google/Facebook SDK and extract email + name
    // For now return a stub response indicating the feature requires OAuth setup
    return res.status(501).json({
      error: 'Social login not yet configured',
      message: 'Set up Google/Facebook OAuth credentials to enable this endpoint',
      provider
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password (authenticated user)
router.post('/change-password', authenticateToken, [
  body('current_password').exists(),
  body('new_password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await user.comparePassword(req.body.current_password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = req.body.new_password;
    user.updated_at = new Date();
    await user.save(); // pre-save hook handles hashing
    res.json({ success: true, message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Staff Management (admin only) ───────────────────────────────────────────

const STAFF_ROLES = ['operator', 'lyrics_team', 'music_production', 'qa_team', 'support'];

// Create staff account (any role)
router.post('/operators', authenticateToken, requireAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role = 'operator', department, phone } = req.body;
    const assignedRole = STAFF_ROLES.includes(role) ? role : 'operator';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const operator = new User({ email, password, name, role: assignedRole, department, phone });
    await operator.save();

    res.status(201).json({
      _id: operator._id,
      email: operator.email,
      name: operator.name,
      role: operator.role,
      department: operator.department,
      isActive: operator.isActive,
      created_at: operator.created_at
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// List all staff (all non-user roles)
router.get('/operators', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const operators = await User.find({ role: { $in: STAFF_ROLES } })
      .select('-password')
      .sort({ created_at: -1 });
    res.json(operators);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle operator active/inactive
router.put('/operators/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const operator = await User.findOne({ _id: req.params.id, role: 'operator' });
    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' });
    }

    operator.isActive = !operator.isActive;
    operator.updated_at = new Date();
    await operator.save();

    res.json({
      id: operator._id,
      email: operator.email,
      name: operator.name,
      role: operator.role,
      isActive: operator.isActive
    });
  } catch (error) {
    console.error('Toggle operator error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete operator
router.delete('/operators/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const operator = await User.findOneAndDelete({ _id: req.params.id, role: 'operator' });
    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' });
    }
    res.json({ message: 'Operator deleted successfully' });
  } catch (error) {
    console.error('Delete operator error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
