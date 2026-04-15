import express from 'express';
import nodemailer from 'nodemailer';
import Setting from '../models/Setting.js';

const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Fetch email settings from database
    const settings = await Setting.find({ type: { $in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'contact_email'] } });
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.type] = s.value; });

    const smtpHost = settingsMap['smtp_host'] || process.env.SMTP_HOST;
    const smtpPort = parseInt(settingsMap['smtp_port'] || process.env.SMTP_PORT || '587');
    const smtpUser = settingsMap['smtp_user'] || process.env.SMTP_USER;
    const smtpPass = settingsMap['smtp_pass'] || process.env.SMTP_PASS;
    const contactEmail = settingsMap['contact_email'] || process.env.CONTACT_EMAIL || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return res.status(500).json({ error: 'Email configuration not set. Please configure SMTP settings in admin.' });
    }

    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${smtpUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
          </table>
          <h3 style="color: #555;">Message:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

export default router;
