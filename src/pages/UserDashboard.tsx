import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchJson } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import OrderCard from '../components/OrderCard';
import StatusBadge from '../components/StatusBadge';

interface Order {
  _id: string;
  order_code: string;
  status: string;
  delivery_date?: string;
  customer_name: string;
  customer_email: string;
  package_id?: {
    name: string;
    price: number;
    delivery_hours: number;
  };
  story?: string;
  music_style?: string;
  mood?: string;
  language?: string;
  special_message?: string;
  reference_song?: string;
  created_at: string;
}

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });
  const [ticketSent, setTicketSent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const ordersData = await fetchJson<Order[]>('/orders/my');
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchJson<{ photo_url: string }>('/profile/me')
      .then(data => setPhotoUrl(data.photo_url))
      .catch(() => {});
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/profile/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.photo_url) setPhotoUrl(`http://localhost:5000${data.photo_url}`);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setPhotoUploading(false);
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => ['completed', 'delivered'].includes(o.status)).length;
    const pending = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
    return { total, completed, pending };
  }, [orders]);

  const detailOrder = orders.find(o => o._id === selectedOrderId) || orders[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6C4DFF] mx-auto"></div>
          <p className="mt-4 text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-16">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 lg:flex">
          <div className="mb-2 px-4">
            <p className="text-xs text-white/40 uppercase tracking-widest">My Account</p>
            <p className="mt-1 text-sm font-medium text-white/80">{user?.name}</p>
            <p className="text-xs text-white/40">{user?.email}</p>
          </div>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'orders', label: 'My Orders' },
            { id: 'details', label: 'Order Details' },
            { id: 'support', label: 'Support' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`rounded-full px-4 py-2 text-left text-sm ${
                view === item.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={signOut}
            className="mt-auto rounded-full border border-white/20 px-4 py-2 text-left text-sm text-white/70 hover:text-white"
          >
            Sign Out
          </button>
        </aside>

        <div className="flex-1 space-y-8">
          {/* Mobile nav */}
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 lg:hidden">
            {['dashboard', 'orders', 'details', 'support', 'settings'].map((id) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`rounded-full px-3 py-1.5 text-xs capitalize ${view === id ? 'bg-white/10 text-white' : 'text-white/60'}`}
              >
                {id === 'details' ? 'Order Details' : id === 'orders' ? 'My Orders' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Dashboard ── */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Total Orders" value={stats.total} />
                <StatCard label="Completed" value={stats.completed} accent="text-green-300" />
                <StatCard label="Pending" value={stats.pending} accent="text-[#FF3B81]" />
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-white/20 p-8 text-center">
                    <p className="text-white/50">No orders yet.</p>
                    <a href="/order" className="mt-3 inline-block rounded-full bg-[#FF3B81] px-5 py-2 text-sm font-semibold">
                      Create Your Song
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-white/50">
                        <tr>
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Package</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Delivery</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 4).map((order) => (
                          <tr key={order._id} className="border-t border-white/10 text-white/80">
                            <td className="py-3 font-mono text-xs">{order.order_code}</td>
                            <td className="py-3">{order.package_id?.name || '—'}</td>
                            <td className="py-3"><StatusBadge status={order.status} /></td>
                            <td className="py-3">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── My Orders ── */}
          {view === 'orders' && (
            <div className="grid gap-6 md:grid-cols-2">
              {orders.length === 0 ? (
                <div className="col-span-2 rounded-3xl border border-dashed border-white/30 p-12 text-center">
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-white/60 mb-6">Create your first custom song to get started!</p>
                  <a href="/order" className="inline-block rounded-full bg-[#FF3B81] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF3B81]/30">
                    Create Your Song
                  </a>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    orderCode={order.order_code}
                    title={`${order.package_id?.name || 'Custom Song'} for ${order.customer_name}`}
                    status={order.status}
                    deliveryDate={order.delivery_date}
                    onViewDetails={() => {
                      setSelectedOrderId(order._id);
                      setView('details');
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* ── Order Details ── */}
          {view === 'details' && (
            <div>
              {!detailOrder ? (
                <div className="rounded-3xl border border-dashed border-white/20 p-12 text-center text-white/50">
                  No order details available yet.
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Order Details</h3>
                    <button onClick={() => setView('orders')} className="text-xs text-white/40 hover:text-white">← Back to orders</button>
                  </div>
                  <div className="mt-2 grid gap-6 md:grid-cols-2">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Order ID</span>
                        <span className="font-mono text-xs">{detailOrder.order_code}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Package</span>
                        <span>{detailOrder.package_id?.name || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Status</span>
                        <StatusBadge status={detailOrder.status} />
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Music Style</span>
                        <span>{detailOrder.music_style || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Mood</span>
                        <span>{detailOrder.mood || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-white/50">Language</span>
                        <span>{detailOrder.language || '—'}</span>
                      </div>
                      {detailOrder.delivery_date && (
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/50">Delivery Date</span>
                          <span>{new Date(detailOrder.delivery_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 text-sm">
                      {detailOrder.story && (
                        <div>
                          <p className="text-white/50 mb-1">Your Story</p>
                          <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80 leading-relaxed">{detailOrder.story}</p>
                        </div>
                      )}
                      {detailOrder.special_message && (
                        <div>
                          <p className="text-white/50 mb-1">Special Message</p>
                          <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">{detailOrder.special_message}</p>
                        </div>
                      )}
                      {detailOrder.reference_song && (
                        <div>
                          <p className="text-white/50 mb-1">Reference Song</p>
                          <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">{detailOrder.reference_song}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {detailOrder.status === 'delivered' && (
                    <div className="mt-6 flex gap-3">
                      <button className="rounded-full bg-[#6C4DFF] px-4 py-2 text-sm">Download MP3</button>
                      <button className="rounded-full border border-white/20 px-4 py-2 text-sm">Download WAV</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Support ── */}
          {view === 'support' && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Support</h3>
              <p className="mt-1 text-sm text-white/50">Have a question about your order? Reach out below.</p>
              {ticketSent ? (
                <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-6 text-center text-green-300">
                  Message sent! We'll get back to you soon.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <input
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Subject"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  />
                  <textarea
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    placeholder="Describe your issue..."
                    className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  />
                  <button
                    onClick={() => {
                      if (ticketForm.subject && ticketForm.message) setTicketSent(true);
                    }}
                    className="rounded-full bg-[#6C4DFF] px-6 py-3 text-sm font-semibold"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Settings ── */}
          {view === 'settings' && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Profile Settings</h3>

              {/* Photo upload */}
              <div className="mt-5 flex items-center gap-5">
                <div className="relative">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-[#6C4DFF]/50" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-[#6C4DFF]/20 border-2 border-[#6C4DFF]/30 flex items-center justify-center text-2xl font-bold text-[#6C4DFF]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-white/40 mb-2">{user?.email}</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/70 hover:text-white disabled:opacity-50"
                  >
                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/50">Full Name</label>
                  <input defaultValue={user?.name} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Email</label>
                  <input defaultValue={user?.email} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
                </div>
              </div>
              <button className="mt-6 rounded-full bg-[#6C4DFF] px-6 py-3 text-sm font-semibold">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
