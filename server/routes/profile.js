import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from './auth.js';
import User from '../models/User.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

// Upload profile photo
router.post('/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user.userId, { photo_url: photoUrl });

    res.json({ photo_url: photoUrl });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile (name, phone, city)
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    const update = { updated_at: new Date() };
    if (name?.trim()) update.name = name.trim();
    if (phone !== undefined) update.phone = phone;
    if (city !== undefined) update.city = city;

    const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
