import { useState } from 'react';
import { postJson } from '../lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await postJson('/contact', form);
      setSuccess('Thank you! Your message has been sent. We will get back to you shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">Get in touch</p>
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/60">Have a question or need help? We'd love to hear from you.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          {success && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more about your inquiry..."
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-2xl">📧</div>
            <p className="text-sm font-medium text-white mb-1">Email</p>
            <p className="text-xs text-white/50">support@expressinmusic.com</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-2xl">⏰</div>
            <p className="text-sm font-medium text-white mb-1">Response Time</p>
            <p className="text-xs text-white/50">Within 24-48 hours</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-2xl">💬</div>
            <p className="text-sm font-medium text-white mb-1">WhatsApp</p>
            <p className="text-xs text-white/50">Available on request</p>
          </div>
        </div>
      </div>
    </div>
  );
}
