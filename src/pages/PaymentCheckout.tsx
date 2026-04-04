import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJson, postJson } from '../lib/api';
import { CheckCircle, XCircle, Loader, ShieldCheck, CreditCard, Music } from 'lucide-react';

declare global {
  interface Window { Razorpay: any; }
}

export default function PaymentCheckout() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    fetchJson<any>(`/orders/${orderId}`)
      .then(setOrder)
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayNow = async () => {
    if (!order) return;
    setPaying(true);
    setError('');
    try {
      // Step 1: Create Razorpay order on backend
      const res = await postJson<{ payment_id: string; gateway_order_id: string; amount: number; key_id: string; order_code: string; customer_email: string }>(
        '/payments/create',
        { order_id: orderId }
      );

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment gateway. Please check your internet connection.');

      // Step 3: Open Razorpay checkout
      const options = {
        key: res.key_id,
        amount: res.amount * 100,
        currency: 'INR',
        name: 'Express In Music',
        description: `Order ${res.order_code}`,
        image: '/logo.png',
        order_id: res.gateway_order_id,
        prefill: { email: res.customer_email },
        theme: { color: '#6C4DFF' },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response: any) => {
          // Step 4: Verify payment signature
          try {
            await postJson('/payments/verify', {
              payment_id: res.payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setStatus('success');
          } catch {
            setStatus('failed');
            setError('Payment verification failed. Contact support.');
          } finally {
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setStatus('failed');
        setError(resp.error?.description || 'Payment failed');
        setPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
      <Loader className="w-8 h-8 text-[#6C4DFF] animate-spin" />
    </div>
  );

  if (status === 'success') return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
        <p className="text-white/60 mb-2">Your order has been confirmed.</p>
        <p className="text-white/40 text-sm mb-8">Order: <span className="text-[#6C4DFF] font-semibold">{order?.order_code}</span></p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-[#6C4DFF] text-white rounded-xl font-semibold hover:bg-[#5B3ECC] transition">
            View Dashboard
          </button>
          <button onClick={() => navigate('/')} className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition">
            Home
          </button>
        </div>
      </div>
    </div>
  );

  if (status === 'failed') return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">Payment Failed</h1>
        <p className="text-red-400 mb-8">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setStatus('idle'); setError(''); }} className="px-6 py-3 bg-[#6C4DFF] text-white rounded-xl font-semibold hover:bg-[#5B3ECC] transition">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition">
            Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6C4DFF]/20 border border-[#6C4DFF]/30 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#6C4DFF]" />
            <span className="text-sm text-[#6C4DFF] font-medium">Secure Checkout — Test Mode</span>
          </div>
          <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          <p className="text-white/50 mt-2 text-sm">Powered by Razorpay Sandbox</p>
        </div>

        {/* Order Summary Card */}
        {order && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#6C4DFF]/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-[#6C4DFF]" />
              </div>
              <div>
                <p className="font-semibold text-white">{order.order_code}</p>
                <p className="text-white/50 text-sm">{order.customer_name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Package', order.package_id?.name || 'Custom'],
                ['Language', order.language || '—'],
                ['Music Style', order.music_style || '—'],
                ['Status', order.status],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-white/60">
                  <span>{label}</span><span className="text-white">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-white/60 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-[#6C4DFF]">₹{order.total_price?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Sandbox Notice */}
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 mb-6 text-sm text-yellow-300">
          <p className="font-semibold mb-1">🧪 Sandbox / Test Mode Active</p>
          <p className="text-yellow-300/70">Use test card: <strong>4111 1111 1111 1111</strong> | Expiry: any future | CVV: any 3 digits | OTP: 1234</p>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Payment Options Available</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Cards', icon: '💳' },
              { label: 'UPI', icon: '📲' },
              { label: 'Net Banking', icon: '🏦' },
              { label: 'Wallets', icon: '👛' },
              { label: 'EMI', icon: '📅' },
              { label: 'Pay Later', icon: '⏰' },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/5 bg-white/3 text-center">
                <span className="text-lg">{m.icon}</span>
                <span className="text-white/50 text-xs">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={paying}
          className="w-full py-4 rounded-2xl bg-[#6C4DFF] hover:bg-[#5B3ECC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center gap-3 transition"
        >
          {paying ? (
            <><Loader className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Pay ₹{order?.total_price?.toLocaleString('en-IN')}</>
          )}
        </button>

        <p className="text-center text-white/30 text-xs mt-4">
          🔒 Secured by Razorpay · 256-bit SSL Encryption
        </p>
      </div>
    </div>
  );
}
