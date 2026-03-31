import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchJson, postJson } from '../lib/api';
import AudioPlayerCard from '../components/AudioPlayerCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Package {
  _id: string;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FALLBACK_PACKAGES: Package[] = [
  { _id: 'p1', name: 'Personal Song', price: 3999, delivery_hours: 24, description: 'Perfect for birthdays, love stories, dedication songs', category: 'Personal' },
  { _id: 'p2', name: 'Business Song', price: 9100, delivery_hours: 72, description: 'Brand anthem, promotional song or product jingle', category: 'Business' },
  { _id: 'p3', name: 'Campaign Song', price: 21000, delivery_hours: 160, description: 'Songs for events, institutions, schools or campaigns', category: 'Campaign' },
];

const SAMPLE_SONGS = [
  { title: 'Birthday Dedication Song', genre: 'Bollywood Pop', duration: '3:24', audioUrl: '' },
  { title: 'Love Proposal Song', genre: 'Romantic', duration: '4:01', audioUrl: '' },
  { title: 'Brand Promotion Song', genre: 'Corporate Pop', duration: '2:45', audioUrl: '' },
  { title: 'Campaign Anthem', genre: 'Motivational', duration: '3:58', audioUrl: '' },
];

const TESTIMONIALS = [
  { name: 'Rohit Sharma', location: 'Mumbai', quote: 'I surprised my wife with a personalized birthday song. It became the most unforgettable gift ever.', rating: 5, initials: 'RS' },
  { name: 'Priya Mehta', location: 'Delhi', quote: 'Our brand anthem was delivered within 72 hours. The quality was beyond what we expected. Highly recommended!', rating: 5, initials: 'PM' },
  { name: 'Aditya Kumar', location: 'Bangalore', quote: 'Proposed to my girlfriend with a custom song. She said yes! ExpressinMusic made it magical.', rating: 5, initials: 'AK' },
];

const LIVE_ACTIVITY = [
  'Rahul from Mumbai just ordered a Birthday Song',
  'Priya from Delhi ordered a Brand Anthem',
  'Arjun from Jaipur just ordered a Love Proposal Song',
  'Sneha from Pune ordered a Business Song',
  'Vikram from Chennai just created a Campaign Anthem',
  'Neha from Hyderabad ordered a Wedding Song',
];

const ADDONS = [
  { key: 'femaleSinger', label: 'Female Singer', price: 799, icon: '🎤' },
  { key: 'fastDelivery', label: 'Fast Delivery', price: 999, icon: '⚡' },
  { key: 'extraVerse', label: 'Extra Verse', price: 499, icon: '📝' },
  { key: 'musicVideo', label: 'Music Video Reel', price: 1499, icon: '🎬' },
  { key: 'lyricsPdf', label: 'Lyrics PDF', price: 199, icon: '📄' },
  { key: 'youtubePublish', label: 'YouTube Publishing', price: 1999, icon: '▶️' },
  { key: 'streaming', label: 'Streaming Distribution', price: 2999, icon: '🎵' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Tell Us Your Story', desc: 'Fill a short form about your idea, occasion, and people involved.' },
  { num: '02', title: 'Lyrics Creation', desc: 'Our professional lyricists write meaningful, personalised lyrics.' },
  { num: '03', title: 'Music Composition', desc: 'Composers create the melody, arrangement and beat.' },
  { num: '04', title: 'Studio Production', desc: 'Vocals and instruments are recorded, mixed and mastered.' },
  { num: '05', title: 'Quality Review', desc: 'Our creative team validates every detail of the final song.' },
  { num: '06', title: 'Delivery To You', desc: 'You receive the finished song directly in your dashboard.' },
];

const FAQS = [
  { q: 'How long does delivery take?', a: 'Personal songs are delivered within 24 hours. Business songs within 72 hours. Campaign songs within 160 hours. Fast Delivery add-on cuts this by half.' },
  { q: 'Can I request revisions?', a: 'Yes. Minor revisions are allowed during the production process. Our team works with you until you love the final song.' },
  { q: 'Will my song be unique?', a: 'Absolutely. Every song is created from scratch based on your story, message and preferences. No templates, no reuse.' },
  { q: 'Can I publish my song online?', a: 'Yes. With our YouTube Publishing or Streaming Distribution add-on, we release your song on major platforms.' },
  { q: 'Is my story kept private?', a: 'Yes. Your story and personal information are processed privately and never shared with anyone.' },
  { q: 'What file formats do I receive?', a: 'You receive your song in MP3 format by default. WAV and instrumental tracks are available on request.' },
];

const LANGUAGES = ['Hindi', 'English', 'Bhojpuri', 'Punjabi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Gujarati', 'Custom'];
const MUSIC_STYLES = ['Bollywood', 'Pop', 'Romantic', 'Hip-Hop', 'Folk', 'Devotional', 'Motivational', 'Classical', 'EDM', 'Custom'];
const MOODS = ['Happy', 'Romantic', 'Emotional', 'Energetic', 'Inspirational', 'Nostalgic', 'Playful'];
const VOICES = ['Male', 'Female', 'Duet', 'Child Voice', 'Rap'];

// ─── Helper components ────────────────────────────────────────────────────────

function SelectField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1.5">{label}{required && <span className="text-[#FF3B81] ml-1">*</span>}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white appearance-none focus:border-[#6C4DFF]/60 focus:outline-none"
      >
        <option value="" className="bg-[#1a1a2e]">Select {label}</option>
        {options.map(o => <option key={o} value={o} className="bg-[#1a1a2e]">{o}</option>)}
      </select>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1.5">{label}{required && <span className="text-[#FF3B81] ml-1">*</span>}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#6C4DFF]/60 focus:outline-none"
      />
    </div>
  );
}

// ─── Countdown timer hook ─────────────────────────────────────────────────────

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s <= 1 ? initialSeconds : s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSeconds]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-white"
      >
        <span>{q}</span>
        <span className={`ml-4 flex-shrink-0 text-[#6C4DFF] transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-4 text-sm text-white/60 leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreateSong() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);

  const [form, setForm] = useState({
    language: '', musicStyle: '', mood: '', singerVoice: '',
    name: '', names: '', story: '', specialMessage: '', referenceSong: '',
  });

  const [addons, setAddons] = useState<Record<string, boolean>>(
    Object.fromEntries(ADDONS.map(a => [a.key, false]))
  );

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<{ coupon_type: string; discount_value: number; coupon_code: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Live activity notification
  const [activityMsg, setActivityMsg] = useState('');
  const [activityVisible, setActivityVisible] = useState(false);

  const countdown = useCountdown(10800); // 3 hours

  // Load packages from API
  useEffect(() => {
    fetchJson<Package[]>('/packages')
      .then(data => { if (data && data.length) setPackages(data); })
      .catch(() => {});
  }, []);

  // Cycle live activity notifications
  useEffect(() => {
    let idx = 0;
    const show = () => {
      setActivityMsg(LIVE_ACTIVITY[idx % LIVE_ACTIVITY.length]);
      setActivityVisible(true);
      idx++;
      setTimeout(() => setActivityVisible(false), 4000);
    };
    const timer = setInterval(show, 9000);
    const first = setTimeout(show, 3000);
    return () => { clearInterval(timer); clearTimeout(first); };
  }, []);

  const selectedPkg = packages[selectedPkgIndex] || packages[0];

  // Price calculation
  const { addonTotal, subtotal, discount, total } = useMemo(() => {
    const base = selectedPkg?.price || 0;
    const addonTotal = ADDONS.filter(a => addons[a.key]).reduce((s, a) => s + a.price, 0);
    const subtotal = base + addonTotal;
    let discount = 0;
    if (couponData) {
      discount = couponData.coupon_type === 'percentage'
        ? Math.round(subtotal * couponData.discount_value / 100)
        : couponData.discount_value;
    }
    return { addonTotal, subtotal, discount, total: Math.max(subtotal - discount, 0) };
  }, [selectedPkg, addons, couponData]);

  const scrollToForm = (pkgIdx?: number) => {
    if (pkgIdx !== undefined) setSelectedPkgIndex(pkgIdx);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError('Enter a coupon code'); return; }
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await postJson<any>('/affiliates/validate', { coupon_code: couponCode.trim() });
      setCouponData(res);
    } catch {
      setCouponError('Invalid or expired coupon code');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login?redirect=/create-song'); return; }

    const errors: string[] = [];
    if (!form.language) errors.push('Song Language is required');
    if (!form.musicStyle) errors.push('Music Style is required');
    if (!form.mood) errors.push('Mood is required');
    if (!form.singerVoice) errors.push('Singer Voice is required');
    if (!form.name.trim()) errors.push('Name of Person / Brand is required');
    if (!form.story.trim()) errors.push('Story / Message is required');

    if (errors.length) {
      setValidationErrors(errors);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setValidationErrors([]);
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const deliveryDate = new Date();
      deliveryDate.setHours(deliveryDate.getHours() + (selectedPkg?.delivery_hours || 24));

      const selectedAddonLabels = ADDONS.filter(a => addons[a.key]).map(a => a.label);

      await postJson('/orders', {
        customer_name: form.name.trim(),
        customer_email: user.email,
        package_id: selectedPkg._id,
        delivery_date: deliveryDate.toISOString(),
        story: form.story,
        music_style: form.musicStyle,
        singer_voice: form.singerVoice,
        mood: form.mood,
        language: form.language,
        special_message: form.specialMessage,
        reference_song: form.referenceSong,
        total_price: total,
        upsell_options: selectedAddonLabels,
      });

      navigate('/dashboard');
    } catch {
      setSubmitError('Failed to submit order. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#0c0c0f] text-white overflow-x-hidden">

      {/* ── LIVE ACTIVITY TOAST ─────────────────────────────────────────── */}
      <div className={`fixed bottom-24 left-6 z-50 transition-all duration-500 ${activityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1a2e] px-4 py-3 shadow-2xl max-w-xs">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <p className="text-xs text-white/80">{activityMsg}</p>
        </div>
      </div>

      {/* ── WHATSAPP BUTTON ─────────────────────────────────────────────── */}
      <a
        href="https://wa.me/+919999999999?text=Hi%2C%20I%20need%20help%20creating%20a%20song"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-500/20 hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="hidden sm:block">Need Help?</span>
      </a>

      {/* ── FLOATING CTA ────────────────────────────────────────────────── */}
      <button
        onClick={() => scrollToForm()}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 rounded-full bg-[#6C4DFF] px-6 py-3 text-sm font-bold shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform border border-white/10"
      >
        <span>🎵</span>
        Create Your Song
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">₹3,999</span>
      </button>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#6C4DFF]/20 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full bg-[#FF3B81]/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
          {/* Left */}
          <div className="space-y-6">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF3B81]/30 bg-[#FF3B81]/10 px-4 py-1.5 text-xs text-[#FF3B81]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B81] animate-pulse" />
              Next delivery slot closes in {countdown}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              Create Your Own<br />
              <span className="bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">
                Professional Song
              </span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-lg">
              Turn your story, message or idea into a studio-quality song produced by professional lyricists, composers and singers.
            </p>

            <div className="space-y-3">
              {[
                'Studio Quality Music Production',
                'Human Creative Team — No AI Shortcuts',
                'Fast Delivery in 24–160 Hours',
                'Optional Streaming Distribution',
              ].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6C4DFF]/20 text-[#A78BFA] text-xs flex-shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollToForm()}
                className="rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#8B5CF6] px-8 py-4 text-base font-bold shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform"
              >
                Start Creating Your Song
              </button>
              <a
                href="#samples"
                className="rounded-full border border-white/20 px-6 py-4 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                Listen to Samples
              </a>
            </div>
          </div>

          {/* Right – studio visual placeholder */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6C4DFF]/20 to-[#FF3B81]/10 p-8 aspect-square flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-8xl">🎙️</div>
                <div className="space-y-2">
                  {/* Animated waveform bars */}
                  <div className="flex items-end justify-center gap-1 h-10">
                    {[4, 7, 5, 9, 6, 8, 4, 7, 5, 9, 6, 8, 4, 7, 5].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full bg-gradient-to-t from-[#6C4DFF] to-[#FF3B81]"
                        style={{
                          height: `${h * 4}px`,
                          animation: `pulse ${0.8 + (i % 4) * 0.2}s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/50">Studio Recording in Progress</p>
                </div>
                <div className="flex justify-center gap-6 text-xs text-white/40">
                  <span>🎹 Composition</span>
                  <span>🎸 Arrangement</span>
                  <span>🎚️ Mixing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. SOCIAL PROOF                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-white/40 uppercase tracking-widest mb-10">Thousands Of Stories Turned Into Songs</p>

          <div className="grid grid-cols-3 gap-6 text-center mb-14">
            {[
              { value: '10,000+', label: 'Songs Produced' },
              { value: '120+', label: 'Brands Served' },
              { value: '15+', label: 'Countries' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">{s.value}</p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#FF3B81] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/40">{t.location}</p>
                  </div>
                  <div className="ml-auto text-xs text-yellow-400">★★★★★</div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. SONG TYPE SELECTION                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20" id="packages">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#A78BFA] mb-3">Choose Your Package</p>
            <h2 className="text-3xl font-extrabold">Select The Song You Want To Create</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((pkg, i) => {
              const isSelected = selectedPkgIndex === i;
              const badgeColor = ['from-[#6C4DFF] to-[#8B5CF6]', 'from-[#FF3B81] to-[#F43F5E]', 'from-[#00D4FF] to-[#0EA5E9]'][i] || 'from-[#6C4DFF] to-[#8B5CF6]';
              const icons = ['🎂', '🏢', '🎪'];
              return (
                <div
                  key={pkg._id}
                  onClick={() => scrollToForm(i)}
                  className={`relative cursor-pointer rounded-3xl border-2 p-7 transition-all hover:scale-[1.02] ${isSelected ? 'border-[#6C4DFF] bg-[#6C4DFF]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                >
                  {i === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF3B81] px-4 py-1 text-xs font-bold text-white">Most Popular</div>}
                  {i === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/40 px-4 py-1 text-xs font-bold text-[#00D4FF]">Enterprise</div>}
                  <div className={`text-4xl mb-4`}>{icons[i]}</div>
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-sm text-white/60 mb-5">{pkg.description}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-6">Delivery within {pkg.delivery_hours} hours</p>
                  <button
                    className={`w-full rounded-full bg-gradient-to-r ${badgeColor} py-3 text-sm font-bold shadow-lg hover:opacity-90 transition-opacity`}
                  >
                    Create {pkg.category} Song
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 4. SAMPLE SONGS                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white/[0.02] border-y border-white/10 px-6 py-20" id="samples">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#A78BFA] mb-3">Hear Before You Order</p>
            <h2 className="text-3xl font-extrabold">Listen To Sample Songs</h2>
            <p className="mt-3 text-white/50">Real productions made by our team for past clients</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {SAMPLE_SONGS.map(s => (
              <AudioPlayerCard key={s.title} title={s.title} genre={s.genre} duration={s.duration} audioUrl={s.audioUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 5. PROCESS STEPS                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-[#A78BFA] mb-3">Transparent Process</p>
            <h2 className="text-3xl font-extrabold">From Your Story To A Professional Song</h2>
            <p className="mt-3 text-sm text-white/50">Technology helps accelerate the process, but every song is reviewed by real professionals.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map(step => (
              <div key={step.num} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-[#6C4DFF]/30 transition-colors">
                <p className="text-3xl font-extrabold text-[#6C4DFF]/40 mb-3">{step.num}</p>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => scrollToForm()} className="rounded-full border border-[#6C4DFF]/50 bg-[#6C4DFF]/10 px-8 py-3 text-sm font-semibold text-[#A78BFA] hover:bg-[#6C4DFF]/20 transition-colors">
              Start Your Song Now
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 6+7. ORDER FORM + SUMMARY                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white/[0.02] border-t border-white/10 px-6 py-20" id="order-form" ref={formRef}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#A78BFA] mb-3">Order Form</p>
            <h2 className="text-3xl font-extrabold">Create Your Song</h2>
          </div>

          {/* Package tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {packages.map((pkg, i) => (
              <button
                key={pkg._id}
                onClick={() => setSelectedPkgIndex(i)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${selectedPkgIndex === i ? 'bg-[#6C4DFF] text-white' : 'border border-white/20 text-white/60 hover:text-white'}`}
              >
                {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-400 mb-2">Please fix the following before submitting:</p>
              <ul className="space-y-1">
                {validationErrors.map((e, i) => <li key={i} className="text-xs text-red-400">• {e}</li>)}
              </ul>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left – Form */}
            <div className="space-y-6">

              {/* Section 1 – Song Details */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C4DFF]/20 text-xs font-bold text-[#A78BFA]">1</span>
                  Song Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Song Type</label>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      {selectedPkg?.name} — ₹{selectedPkg?.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <SelectField label="Song Language" value={form.language} onChange={v => setForm({ ...form, language: v })} options={LANGUAGES} required />
                  <SelectField label="Music Style" value={form.musicStyle} onChange={v => setForm({ ...form, musicStyle: v })} options={MUSIC_STYLES} required />
                  <SelectField label="Mood" value={form.mood} onChange={v => setForm({ ...form, mood: v })} options={MOODS} required />
                  <SelectField label="Singer Voice" value={form.singerVoice} onChange={v => setForm({ ...form, singerVoice: v })} options={VOICES} required />
                </div>
              </div>

              {/* Section 2 – Your Story */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C4DFF]/20 text-xs font-bold text-[#A78BFA]">2</span>
                  Your Story
                </h3>
                <div className="space-y-4">
                  <TextField label="Name of Person / Brand" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="e.g. Priya's Birthday, Zara Brand" required />
                  <TextField label="Names to Include in Lyrics" value={form.names} onChange={v => setForm({ ...form, names: v })} placeholder="e.g. Ria, Kabir, Maa" />
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Story / Message <span className="text-[#FF3B81]">*</span></label>
                    <textarea
                      value={form.story}
                      onChange={e => setForm({ ...form, story: e.target.value })}
                      placeholder="Share key moments, emotions, memories you want captured in the song. The more detail you give, the better your song will be."
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#6C4DFF]/60 focus:outline-none resize-none"
                    />
                  </div>
                  <TextField label="Special Line (Optional)" value={form.specialMessage} onChange={v => setForm({ ...form, specialMessage: v })} placeholder="A specific line or phrase to include" />
                  <TextField label="Reference Song Link (Optional)" value={form.referenceSong} onChange={v => setForm({ ...form, referenceSong: v })} placeholder="YouTube or Spotify URL for style reference" />
                </div>
              </div>

              {/* Section 3 – File Upload */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C4DFF]/20 text-xs font-bold text-[#A78BFA]">3</span>
                  Upload Files
                  <span className="text-sm font-normal text-white/40">(Optional)</span>
                </h3>
                <p className="text-xs text-white/40 mb-5">Upload a photo, script or audio reference to help us create a better song.</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: 'Photo / Image', accept: 'image/*', icon: '🖼️' },
                    { label: 'Audio Reference', accept: '.mp3,.wav', icon: '🎵' },
                    { label: 'Script / Lyrics', accept: '.pdf,.doc,.docx,.txt', icon: '📄' },
                  ].map(f => (
                    <div key={f.label} className="rounded-2xl border border-dashed border-white/20 p-4 text-center hover:border-[#6C4DFF]/40 transition-colors cursor-pointer">
                      <div className="text-3xl mb-2">{f.icon}</div>
                      <p className="text-xs text-white/60 mb-3">{f.label}</p>
                      <label className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition-colors">
                        Choose File
                        <input type="file" accept={f.accept} className="hidden" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4 – Add-ons */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF3B81]/20 text-xs font-bold text-[#FF3B81]">+</span>
                  Enhance Your Song
                </h3>
                <p className="text-xs text-white/40 mb-5">Select add-ons to make your song even more special.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {ADDONS.map(a => (
                    <label
                      key={a.key}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${addons[a.key] ? 'border-[#6C4DFF]/50 bg-[#6C4DFF]/10' : 'border-white/10 hover:border-white/20'}`}
                    >
                      <input
                        type="checkbox"
                        checked={addons[a.key]}
                        onChange={e => setAddons({ ...addons, [a.key]: e.target.checked })}
                        className="h-4 w-4 rounded accent-[#6C4DFF]"
                      />
                      <span className="text-xl">{a.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.label}</p>
                        <p className="text-xs text-[#A78BFA] font-semibold">+₹{a.price.toLocaleString('en-IN')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Sticky Order Summary */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:sticky lg:top-6">
                <h3 className="font-bold text-lg mb-5">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">{selectedPkg?.name}</span>
                    <span>₹{selectedPkg?.price.toLocaleString('en-IN')}</span>
                  </div>
                  {ADDONS.filter(a => addons[a.key]).map(a => (
                    <div key={a.key} className="flex justify-between text-white/70">
                      <span>{a.icon} {a.label}</span>
                      <span>+₹{a.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {couponData && (
                    <div className="flex justify-between text-green-400 text-xs">
                      <span>Coupon ({couponData.coupon_code})</span>
                      <span>−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-extrabold">
                    <span>Total</span>
                    <span className="text-[#A78BFA]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="text-xs font-medium">Estimated Delivery</p>
                    <p className="text-xs text-white/50">{selectedPkg?.delivery_hours} hours from order confirmation</p>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold text-white/60 mb-2">Have a coupon?</p>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="COUPON CODE"
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 font-mono uppercase focus:outline-none focus:border-[#6C4DFF]/50"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="mt-1.5 text-xs text-red-400">{couponError}</p>}
                  {couponData && <p className="mt-1.5 text-xs text-green-400">Coupon applied! Saving ₹{discount.toLocaleString('en-IN')}</p>}
                </div>

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#8B5CF6] py-4 text-base font-bold shadow-xl shadow-purple-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? 'Processing…' : user ? 'Proceed to Checkout →' : 'Login & Create Song →'}
                </button>
                {submitError && <p className="mt-2 text-xs text-red-400 text-center">{submitError}</p>}

                <p className="mt-3 text-center text-xs text-white/30">🔒 Secure & Private Order Processing</p>
              </div>

              {/* Trust badges */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 grid grid-cols-2 gap-3">
                {[
                  { icon: '🔒', text: 'Secure Checkout' },
                  { icon: '🎵', text: '100% Original Song' },
                  { icon: '🎙️', text: 'Studio Quality' },
                  { icon: '⭐', text: 'Human Reviewed' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-white/60">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 8. TRUST SECTION                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔐', title: 'Secure Payment', desc: 'All transactions are encrypted and secure' },
              { icon: '🎹', title: 'Pro Music Production', desc: 'Produced by trained musicians and composers' },
              { icon: '🎛️', title: 'Studio Mixing', desc: 'Industry-standard mixing and mastering' },
              { icon: '👥', title: 'Human Review', desc: 'Real people review every single song' },
            ].map(t => (
              <div key={t.title} className="space-y-2">
                <div className="text-4xl">{t.icon}</div>
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 9. FAQ                                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white/[0.02] border-y border-white/10 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#A78BFA] mb-3">Common Questions</p>
            <h2 className="text-3xl font-extrabold">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/5 px-6">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 10. FINAL CTA                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="pointer-events-none">
            <div className="mx-auto h-40 w-40 rounded-full bg-[#6C4DFF]/20 blur-3xl" />
          </div>
          <p className="text-xs uppercase tracking-widest text-[#A78BFA]">Ready To Begin?</p>
          <h2 className="text-4xl font-extrabold leading-tight">
            Start Creating Your<br />
            <span className="bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">
              Song Today
            </span>
          </h2>
          <p className="text-white/55 text-base">Turn your idea into a professionally produced song. It takes less than 5 minutes to place your order.</p>
          <button
            onClick={() => scrollToForm()}
            className="rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] px-10 py-4 text-base font-bold shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform"
          >
            Create Your Song Now
          </button>
          <p className="text-xs text-white/30">Starting at ₹3,999 • Fast Delivery • 100% Original</p>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
