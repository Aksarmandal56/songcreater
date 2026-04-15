import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchJson, postJson } from '../lib/api';
import Dropdown from '../components/Dropdown';
import InputField from '../components/InputField';

interface Package {
  _id: string;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

interface Option {
  id: number;
  option_type: string;
  value: string;
}

interface Coupon {
  coupon_code: string;
  coupon_type: 'fixed' | 'percentage';
  discount_value: number;
}

export default function OrderFlow() {
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageIndex = searchParams.get('package');

  const [packages, setPackages] = useState<Package[]>([]);
  // Guest registration state
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', password: '' });
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState('');

  useEffect(() => {
    fetchJson<Package[]>('/packages').then(setPackages).catch(console.error);
  }, []);

  const [options] = useState<Option[]>([
    { id: 1, option_type: 'language', value: 'Hindi' },
    { id: 2, option_type: 'language', value: 'English' },
    { id: 3, option_type: 'language', value: 'Bhojpuri' },
    { id: 4, option_type: 'language', value: 'Punjabi' },
    { id: 5, option_type: 'language', value: 'Tamil' },
    { id: 6, option_type: 'language', value: 'Custom' },
    { id: 7, option_type: 'music_style', value: 'Pop' },
    { id: 8, option_type: 'music_style', value: 'Bollywood' },
    { id: 9, option_type: 'music_style', value: 'Romantic' },
    { id: 10, option_type: 'music_style', value: 'Hip-Hop' },
    { id: 11, option_type: 'music_style', value: 'Folk' },
    { id: 12, option_type: 'music_style', value: 'Devotional' },
    { id: 13, option_type: 'music_style', value: 'Motivational' },
    { id: 14, option_type: 'mood', value: 'Happy' },
    { id: 15, option_type: 'mood', value: 'Romantic' },
    { id: 16, option_type: 'mood', value: 'Emotional' },
    { id: 17, option_type: 'mood', value: 'Energetic' },
    { id: 18, option_type: 'mood', value: 'Inspirational' },
    { id: 19, option_type: 'singer_voice', value: 'Male' },
    { id: 20, option_type: 'singer_voice', value: 'Female' },
    { id: 21, option_type: 'singer_voice', value: 'Duet' },
  ]);

  const [couponLoading, setCouponLoading] = useState(false);

  const selectedPackage = useMemo(() => {
    if (!packages.length) return null;
    if (packageIndex) return packages[parseInt(packageIndex)] || packages[0];
    return packages[0];
  }, [packageIndex, packages]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const [form, setForm] = useState({
    language: '',
    musicStyle: '',
    mood: '',
    singerVoice: '',
    name: '',
    names: '',
    story: '',
    specialMessage: '',
    referenceSong: '',
  });

  const [addons, setAddons] = useState({
    fastDelivery: false,
    femaleSinger: false,
    extraVerse: false,
    musicVideo: false,
    lyricsPdf: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const optionValues = (type: string) => options.filter((item) => item.option_type === type).map((item) => item.value);

  const selectedAddons = useMemo(() => {
    return Object.entries(addons).filter(([, selected]) => selected).map(([key]) => {
      const addonPrices: Record<string, number> = {
        fastDelivery: 999,
        femaleSinger: 799,
        extraVerse: 499,
        musicVideo: 1499,
        lyricsPdf: 199,
      };
      return { name: key, price: addonPrices[key] };
    });
  }, [addons]);

  const totalPrice = useMemo(() => {
    let price = selectedPackage?.price || 0;
    selectedAddons.forEach(addon => {
      price += addon.price;
    });
    if (appliedCoupon) {
      if (appliedCoupon.coupon_type === 'fixed') {
        price = Math.max(0, price - appliedCoupon.discount_value);
      } else {
        price *= (1 - appliedCoupon.discount_value / 100);
      }
    }
    return Math.max(price, 0);
  }, [selectedPackage, selectedAddons, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter a coupon code.');
      setAppliedCoupon(null);
      return;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await postJson<Coupon>('/affiliates/validate', { coupon_code: couponCode.trim().toUpperCase() });
      setAppliedCoupon(res);
      setCouponError('');
    } catch (err: any) {
      const msg = err?.message || 'Invalid coupon code.';
      setCouponError(msg.includes('not ok') ? 'Coupon not found or expired.' : msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleGuestRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name.trim() || !guestForm.email.trim() || !guestForm.password.trim()) {
      setGuestError('All fields are required.');
      return;
    }
    if (guestForm.password.length < 6) {
      setGuestError('Password must be at least 6 characters.');
      return;
    }
    setGuestLoading(true);
    setGuestError('');
    try {
      const result = await signUp(guestForm.email, guestForm.password, guestForm.name);
      if (result.error) {
        // Try sign in if already registered
        const signInResult = await signIn(guestForm.email, guestForm.password);
        if (signInResult.error) {
          setGuestError(result.error || 'Registration failed. Please try again.');
          return;
        }
      }
      setShowGuestForm(false);
    } catch (err: any) {
      setGuestError(err?.message || 'Registration failed.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowGuestForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validation
    const errors: string[] = [];
    if (!form.language) errors.push('Song Language is required');
    if (!form.musicStyle) errors.push('Music Style is required');
    if (!form.mood) errors.push('Mood is required');
    if (!form.singerVoice) errors.push('Singer Voice is required');
    if (!form.name.trim()) errors.push('Name of Person / Brand is required');
    if (!form.story.trim()) errors.push('Story / Message is required');

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    setLoading(true);
    setError('');

    try {
      const deliveryDate = new Date();
      deliveryDate.setHours(deliveryDate.getHours() + (selectedPackage?.delivery_hours || 24));

      const orderData = {
        customer_name: form.name.trim(),
        customer_email: user.email,
        package_id: selectedPackage?._id,
        delivery_date: deliveryDate.toISOString(),
        story: form.story,
        music_style: form.musicStyle,
        singer_voice: form.singerVoice,
        mood: form.mood,
        language: form.language,
        special_message: form.specialMessage,
        reference_song: form.referenceSong,
      };

      const order = await postJson('/orders', orderData);
      navigate(`/payment/${order._id || order.id}`);
    } catch (err) {
      console.error('Order submission error:', err);
      setError('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!packages.length || !selectedPackage) {
    return <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center text-white">Loading packages...</div>;
  }

  return (
    <div className="bg-[#0c0c0f] px-6 py-16 text-white">
      {/* Guest Registration Modal */}
      {showGuestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a2e] p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Create Your Account</h2>
            <p className="text-sm text-white/60 mb-6">Register to complete your song order and track its progress.</p>
            {guestError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-sm">{guestError}</div>
            )}
            <form onSubmit={handleGuestRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                <input
                  type="text"
                  value={guestForm.name}
                  onChange={e => setGuestForm({ ...guestForm, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                <input
                  type="email"
                  value={guestForm.email}
                  onChange={e => setGuestForm({ ...guestForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                <input
                  type="password"
                  value={guestForm.password}
                  onChange={e => setGuestForm({ ...guestForm, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={guestLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {guestLoading ? 'Creating Account...' : 'Create Account & Continue'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-white/50">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-[#00D4FF] hover:underline">Sign in</button>
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Create Your Song</h1>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-sm font-medium text-red-400 mb-2">Please fix the following:</p>
                <ul className="space-y-1">
                  {validationErrors.map((e, i) => (
                    <li key={i} className="text-xs text-red-400">• {e}</li>
                  ))}
                </ul>
              </div>
            )}

                    {/* EMAIL DISPLAY SECTION */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Account Email</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/60">Email Address <span className="text-xs text-white/40">(read-only)</span></label>
            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
              <span>{user?.email || '—'}</span>
            </div>
            {!user?.email && (
              <p className="text-xs text-white/40 mt-1">Your email will appear here after you create your account above.</p>
            )}
          </div>
        </div>

        {/* FORM SECTION 1 – BASIC DETAILS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Dropdown label="Song Language" value={form.language} onChange={(value) => setForm({ ...form, language: value })} options={optionValues('language')} />
                <Dropdown label="Music Style" value={form.musicStyle} onChange={(value) => setForm({ ...form, musicStyle: value })} options={optionValues('music_style')} />
                <Dropdown label="Mood" value={form.mood} onChange={(value) => setForm({ ...form, mood: value })} options={optionValues('mood')} />
                <Dropdown label="Singer Voice" value={form.singerVoice} onChange={(value) => setForm({ ...form, singerVoice: value })} options={optionValues('singer_voice')} />
              </div>
            </div>

            {/* FORM SECTION 2 – SONG STORY */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-4">Song Story</h2>
              <div className="space-y-4">
                <InputField label="Name of Person / Brand" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="e.g. John's Birthday" />
                <InputField label="Names to include in song" value={form.names} onChange={(value) => setForm({ ...form, names: value })} placeholder="e.g. Ria, Kabir" />
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  <span className="font-medium text-white">Story / Message</span>
                  <textarea
                    value={form.story}
                    onChange={(event) => setForm({ ...form, story: event.target.value })}
                    placeholder="Share the key moments and emotions..."
                    className="min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                </label>
                <InputField label="Special Line" value={form.specialMessage} onChange={(value) => setForm({ ...form, specialMessage: value })} placeholder="Optional special line" />
                <InputField label="Reference Song Link" value={form.referenceSong} onChange={(value) => setForm({ ...form, referenceSong: value })} placeholder="YouTube URL" />
              </div>
            </div>

            {/* FORM SECTION 3 – FILE UPLOAD */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-4">File Upload (Optional)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Upload Image</label>
                  <input type="file" accept="image/*" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Upload Script</label>
                  <input type="file" accept=".pdf" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Upload Audio Reference</label>
                  <input type="file" accept=".mp3" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </div>
              </div>
            </div>

            {/* ADD-ON / UPSCALE OPTIONS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-4">Add-ons</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={addons.fastDelivery} onChange={(e) => setAddons({ ...addons, fastDelivery: e.target.checked })} className="rounded" />
                  <span className="text-sm">Fast Delivery + ₹999</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={addons.femaleSinger} onChange={(e) => setAddons({ ...addons, femaleSinger: e.target.checked })} className="rounded" />
                  <span className="text-sm">Female Singer + ₹799</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={addons.extraVerse} onChange={(e) => setAddons({ ...addons, extraVerse: e.target.checked })} className="rounded" />
                  <span className="text-sm">Extra Verse + ₹499</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={addons.musicVideo} onChange={(e) => setAddons({ ...addons, musicVideo: e.target.checked })} className="rounded" />
                  <span className="text-sm">Music Video Reel + ₹1499</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={addons.lyricsPdf} onChange={(e) => setAddons({ ...addons, lyricsPdf: e.target.checked })} className="rounded" />
                  <span className="text-sm">Lyrics PDF + ₹199</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">{selectedPackage.name}</span>
                  <span>₹{selectedPackage.price.toLocaleString('en-IN')}</span>
                </div>
                {addons.fastDelivery && <div className="flex justify-between"><span className="text-white/70">Fast Delivery</span><span>₹999</span></div>}
                {addons.femaleSinger && <div className="flex justify-between"><span className="text-white/70">Female Singer</span><span>₹799</span></div>}
                {addons.extraVerse && <div className="flex justify-between"><span className="text-white/70">Extra Verse</span><span>₹499</span></div>}
                {addons.musicVideo && <div className="flex justify-between"><span className="text-white/70">Music Video Reel</span><span>₹1499</span></div>}
                {addons.lyricsPdf && <div className="flex justify-between"><span className="text-white/70">Lyrics PDF</span><span>₹199</span></div>}
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>₹{(selectedPackage?.price || 0).toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#00D4FF]">
                    <span>Discount ({appliedCoupon.coupon_code})</span>
                            <span>-₹{(appliedCoupon.coupon_type === 'fixed' ? appliedCoupon.discount_value : Math.round((selectedPackage?.price || 0) * (appliedCoupon.discount_value / 100))).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total Payable</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm font-semibold mb-3">Apply Coupon Code</p>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Enter coupon"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-2 text-xs text-[#FF3B81]">{couponError}</p>}
                {appliedCoupon && <p className="mt-2 text-xs text-[#00D4FF]">Discount applied!</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full rounded-full bg-[#6C4DFF] px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Order...' : 'Proceed to Checkout'}
              </button>
              {error && <p className="mt-2 text-xs text-[#FF3B81]">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
