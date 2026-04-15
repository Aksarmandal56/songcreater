import express from 'express';
import CreatorApplication from '../models/CreatorApplication.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all creator applications (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const applications = await CreatorApplication.find().sort({ created_at: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get creator applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit a new creator application (public)
router.post('/', async (req, res) => {
  try {
    const {
      fullName, email, country, city, phone, role, languages,
      genres, portfolio, recordingSetup, experienceLevel, availability, additionalInfo
    } = req.body;

    if (!fullName || !email || !country || !role || !languages || !experienceLevel || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const application = new CreatorApplication({
      fullName, email, country, city, phone, role, languages,
      genres: genres || [], portfolio, recordingSetup,
      experienceLevel, availability, additionalInfo
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Submit creator application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await CreatorApplication.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: new Date() },
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    console.error('Update creator application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete application (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await CreatorApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Delete creator application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
