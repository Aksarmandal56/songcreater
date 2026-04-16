import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJson } from '../lib/api';

interface Package {
  _id: string;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

const categoryConfig: Record<string, { emoji: string; color: string; badge: string; features: string[] }> = {
  Personal: {
    emoji: '🎂',
    color: 'from-[#6C4DFF] to-[#FF3B81]',
    badge: 'Most Popular',
    features: [
      'Original song with custom lyrics',
      'Professional vocals & music',
      'Bollywood / Pop / Regional styles',
      'MP3 delivery to your dashboard',
      'Revision support included',
    ],
  },
  Business: {
    emoji: '🏢',
    color: 'from-[#FF3B81] to-[#FF8C00]',
    badge: 'Best for Brands',
    features: [
      'Brand anthem or jingle',
      'Professional mixing & mastering',
      'Corporate & modern styles',
      'Commercial usage rights',
      'Priority production queue',
    ],
  },
  Institution: {
    emoji: '🎪',
    color: 'from-[#00C6FF] to-[#6C4DFF]',
    badge: 'Enterprise',
    features: [
      'School / NGO / Campaign songs',
      'Multilingual vocal options',
      'Distribution-ready master file',
      'Custom composition & arrangement',
      'Dedicated production team',
    ],
  },
};

const FAQ_ITEMS = [
  { q: 'What is included in each package?', a: 'Every package includes original lyrics, professional music composition, studio vocals, and final MP3 delivery. Higher packages include additional production quality and features.' },
  { q: 'How long does delivery take?', a: 'Delivery time depends on the package. Personal songs are delivered in 24 hours, Business songs in 48 hours, and Institution songs within 24 hours of order confirmation.' },
  { q: 'Can I request revisions?', a: 'Yes! Minor revisions are included during the production process. Our team works with you until you are happy with the final song.' },
  { q: 'Will my song be unique?', a: 'Absolutely. Every song is created from scratch based on your story, message, and preferences. No templates, no reuse.' },
  { q: 'Can I add extra features?', a: 'Yes, you can add Female Singer, Fast Delivery, Extra Verse, Music Video Reel, Streaming Distribution and more from the order form.' },
];

export default function PricingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchJson<Package[]>('/packages')
      .then((data) => setPackages(data))
      .catch(() => setError('Failed to load pricing. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0c0c0f] text-white min-h-screen">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#6C4DFF]/20 blur-3xl" />
          <div className="absolute top-10 right-1/4 h-64 w-64 rounded-full bg-[#FF3B81]/15 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A78BFA]">Pricing</p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Simple, Transparent<br />
            <span className="bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-white/60 text-base">
            Professional songs crafted by real musicians. Choose the plan that fits your story.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> 100% Original Songs</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Human Creative Team</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Studio Quality</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Fast Delivery</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6C4DFF] border-t-transparent" />
            </div>
          )}
          {error && (
            <p className="text-center text-red-400 py-10">{error}</p>
          )}
          {!loading && !error && (
            <div className="grid gap-8 md:grid-cols-3">
              {packages.map((pkg, idx) => {
                const config = categoryConfig[pkg.category] || {
                  emoji: '🎵',
                  color: 'from-[#6C4DFF] to-[#FF3B81]',
                  badge: '',
                  features: [],
                };
                const isPopular = pkg.category === 'Personal';
                return (
                  <div
                    key={pkg._id}
                    className={`relative flex flex-col rounded-2xl border p-8 transition-transform hover:-translate-y-1 ${
                      isPopular
                        ? 'border-[#6C4DFF]/60 bg-white/5 shadow-xl shadow-purple-500/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    {/* Badge */}
                    {config.badge && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${config.color} px-4 py-1 text-xs font-bold text-white shadow-lg`}>
                        {config.badge}
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                      <span className="text-3xl">{config.emoji}</span>
                      <h3 className="mt-3 text-xl font-extrabold">{pkg.name}</h3>
                      <p className="mt-2 text-sm text-white/55 leading-relaxed">{pkg.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-extrabold">₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/50">
                        ⏱ Delivery within {pkg.delivery_hours} hours
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-3">
                      {config.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <span className={`mt-0.5 bg-gradient-to-r ${config.color} bg-clip-text text-transparent font-bold`}>✓</span>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to="/create-song"
                      className={`block w-full rounded-full bg-gradient-to-r ${config.color} py-3 text-center text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90`}
                    >
                      Get Started →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add-ons teaser */}
      <section className="px-6 py-16 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-extrabold">Enhance Your Song</h2>
          <p className="mb-8 text-white/55 text-sm">Add premium features to make your song even more special</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: '🎤', label: 'Female Singer', price: '+₹799' },
              { icon: '⚡', label: 'Fast Delivery', price: '+₹999' },
              { icon: '📝', label: 'Extra Verse', price: '+₹499' },
              { icon: '🎬', label: 'Music Video Reel', price: '+₹1,499' },
              { icon: '🎵', label: 'Streaming Distribution', price: '+₹2,999' },
              { icon: '▶️', label: 'YouTube Publishing', price: '+₹1,999' },
            ].map((addon) => (
              <div key={addon.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm">
                <span className="text-xl">{addon.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-white">{addon.label}</div>
                  <div className="text-xs text-[#A78BFA]">{addon.price}</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/create-song"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] px-8 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            View All Add-ons in Order Form
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🔒', title: 'Secure Payment', desc: 'All transactions encrypted' },
            { icon: '🎹', title: 'Pro Production', desc: 'Trained musicians & composers' },
            { icon: '🎛️', title: 'Studio Mixing', desc: 'Industry-standard mastering' },
            { icon: '👥', title: 'Human Reviewed', desc: 'Real people review every song' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-semibold">{item.title}</div>
              <div className="text-xs text-white/50 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 bg-white/[0.02] border-t border-white/5">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className={`ml-3 flex-shrink-0 text-[#6C4DFF] transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-white/60 leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-extrabold">Ready to Create Your Song?</h2>
          <p className="mb-8 text-white/55">Turn your idea into a professionally produced song. Takes less than 5 minutes to place your order.</p>
          <Link
            to="/create-song"
            className="inline-block rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] px-10 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/30 transition-opacity hover:opacity-90"
          >
            Create Your Song Now
          </Link>
          <p className="mt-4 text-xs text-white/40">Starting at ₹4,999 • Fast Delivery • 100% Original</p>
        </div>
      </section>
    </div>
  );
}
