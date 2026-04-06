import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './server/routes/auth.js';
import orderRoutes from './server/routes/orders.js';
import packageRoutes from './server/routes/packages.js';
import customerRoutes from './server/routes/customers.js';
import sampleRoutes from './server/routes/samples.js';
import testimonialRoutes from './server/routes/testimonials.js';
import profileRoutes from './server/routes/profile.js';
import ticketRoutes from './server/routes/tickets.js';
import affiliateRoutes from './server/routes/affiliates.js';
import logRoutes from './server/routes/logs.js';
import settingRoutes from './server/routes/settings.js';
import songOptionsRoutes from './server/routes/songOptions.js';
import paymentsRoutes from './server/routes/payments.js';
import staffRoutes from './server/routes/staff.js';
import qaRoutes from './server/routes/qa.js';
import analyticsRoutes from './server/routes/analytics.js';
import downloadsRoutes from './server/routes/downloads.js';
import adminRoutes from './server/routes/admin.js';
import notificationsRoutes from './server/routes/notifications.js';
import couponRoutes from './server/routes/coupons.js';
import bannerRoutes from './server/routes/banners.js';
import User from './server/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Atlas connected');

    // Ensure default admin exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@songcraft.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Creating default admin user: ${adminEmail}`);
      await new User({ email: adminEmail, password: adminPassword, name: adminName, role: 'admin' }).save();
      console.log('Default admin user created with password:', adminPassword);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/settings', settingRoutes);
// Song Options (public dropdowns)
app.use('/api', songOptionsRoutes);         // /api/music-styles, /api/languages, /api/moods, /api/order-types, /api/upsells
// New modules
app.use('/api/payments', paymentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/downloads', downloadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/orders', express.static(path.join(__dirname, 'uploads/orders')));
app.use('/uploads/banners', express.static(path.join(__dirname, 'uploads/banners')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});