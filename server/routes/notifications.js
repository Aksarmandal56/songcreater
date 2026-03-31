/**
 * Notification APIs
 *
 * POST /api/notifications/email      — Send email notification
 * POST /api/notifications/whatsapp   — Send WhatsApp message via API
 *
 * Configure in .env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *   WHATSAPP_API_URL, WHATSAPP_API_TOKEN, WHATSAPP_PHONE_ID
 */

import express from 'express';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireStaff } from './auth.js';

const router = express.Router();

// ── Email transporter (lazy-init) ─────────────────────────────────────────────

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// ── Send email ────────────────────────────────────────────────────────────────

router.post('/email', authenticateToken, requireStaff, [
  body('to').isEmail(),
  body('subject').trim().isLength({ min: 1 }),
  body('body').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { to, subject, body: emailBody, html } = req.body;
    const t = getTransporter();

    if (!t) {
      // Log the intent but return success in dev (no SMTP configured)
      console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
      return res.json({ success: true, mode: 'stub', message: 'Email logged (SMTP not configured)' });
    }

    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: emailBody,
      html: html || emailBody,
    });

    res.json({ success: true, mode: 'sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ── Send WhatsApp ─────────────────────────────────────────────────────────────

router.post('/whatsapp', authenticateToken, requireStaff, [
  body('phone').trim().isLength({ min: 10 }),
  body('message').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phone, message } = req.body;
    const apiUrl = process.env.WHATSAPP_API_URL;
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!apiUrl || !token || !phoneId) {
      console.log(`[WHATSAPP STUB] To: ${phone} | Message: ${message}`);
      return res.json({ success: true, mode: 'stub', message: 'WhatsApp logged (API not configured)' });
    }

    // Meta Business API format
    const response = await fetch(`${apiUrl}/${phoneId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace(/\D/g, ''),
        type: 'text',
        text: { body: message },
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: 'WhatsApp send failed', details: data });
    res.json({ success: true, mode: 'sent', data });
  } catch (error) {
    console.error('WhatsApp error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Order status notification (internal helper, also exposed as endpoint) ─────

router.post('/order-update', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { customer_email, customer_phone, order_code, status, customer_name } = req.body;

    const statusMessages = {
      processing: `Hi ${customer_name}, your song order ${order_code} is now being processed by our team!`,
      lyrics_in_progress: `Hi ${customer_name}, our lyricists are crafting beautiful lyrics for your song ${order_code}!`,
      music_production: `Hi ${customer_name}, our composers are creating the music for ${order_code}. Almost there!`,
      final_review: `Hi ${customer_name}, your song ${order_code} is in final quality review!`,
      delivered: `Hi ${customer_name}, your song ${order_code} is ready! Log in to download it.`,
    };

    const message = statusMessages[status] || `Your order ${order_code} status has been updated to: ${status}`;
    const results = { email: null, whatsapp: null };

    // Email
    const t = getTransporter();
    if (t && customer_email) {
      try {
        await t.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: customer_email,
          subject: `Your Song Order Update — ${order_code}`,
          text: message,
        });
        results.email = 'sent';
      } catch {
        results.email = 'failed';
      }
    }

    // WhatsApp
    if (process.env.WHATSAPP_API_URL && customer_phone) {
      const apiUrl = process.env.WHATSAPP_API_URL;
      const token = process.env.WHATSAPP_API_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_ID;
      try {
        const r = await fetch(`${apiUrl}/${phoneId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messaging_product: 'whatsapp', to: customer_phone.replace(/\D/g, ''), type: 'text', text: { body: message } }),
        });
        results.whatsapp = r.ok ? 'sent' : 'failed';
      } catch {
        results.whatsapp = 'failed';
      }
    }

    res.json({ success: true, message, results });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
