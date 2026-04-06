import { useEffect, useMemo, useState } from 'react';
import { fetchJson, postJson, putJson, deleteJson, SERVER_BASE_URL } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  _id: string;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: string;
  delivery_date?: string;
  deadline?: string;
  package_id?: { _id: string; name: string; price: number; delivery_hours: number };
  story?: string;
  music_style?: string;
  mood?: string;
  language?: string;
  singer_voice?: string;
  special_message?: string;
  reference_song?: string;
  lyrics?: string;
  music_prompt?: string;
  ai_music_prompt?: string;
  audio_mp3?: string;
  audio_wav?: string;
  audio_instrumental?: string;
  video_reel?: string;
  lyrics_pdf?: string;
  admin_notes?: string;
  qa_notes?: string;
  rework_reason?: string;
  assigned_staff?: string;
  assigned_lyrics_team?: string;
  assigned_production_team?: string;
  assigned_qa_team?: string;
  total_price?: number;
  upsell_options?: string[];
  created_at: string;
  updated_at?: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  total_orders: number;
  created_at: string;
}

interface Package {
  _id: string;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  department?: string;
  phone?: string;
  created_at: string;
}

interface Coupon {
  _id: string;
  code: string;
  description: string;
  coupon_type: 'fixed' | 'percentage';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  usage_count: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

interface Ticket {
  _id: string;
  ticket_code: string;
  customer_email: string;
  customer_name: string;
  order_code?: string;
  subject: string;
  message: string;
  status: string;
  assigned_staff?: string;
  replies: { sender_name: string; sender_role: string; message: string; created_at: string }[];
  created_at: string;
}

interface Affiliate {
  _id: string;
  name: string;
  coupon_code: string;
  coupon_type: 'fixed' | 'percentage';
  discount_value: number;
  usage_count: number;
  usage_limit?: number;
  orders_generated: number;
  revenue_generated: number;
  commission_percent: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

interface Setting {
  _id: string;
  type: string;
  value: string;
  price: number;
  description?: string;
  is_active: boolean;
}

interface Log {
  _id: string;
  action: string;
  user_email: string;
  user_role: string;
  description: string;
  created_at: string;
}

interface Banner {
  _id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered', 'cancelled'];
const STAFF_ROLES = ['operator', 'lyrics_team', 'music_production', 'qa_team', 'support'];
const SETTING_TYPES = ['music_style', 'language', 'mood', 'order_type', 'upsell'];

function statusColor(status: string) {
  const map: Record<string, string> = {
    received: 'bg-blue-400/10 text-blue-400',
    processing: 'bg-yellow-400/10 text-yellow-400',
    lyrics_in_progress: 'bg-purple-400/10 text-purple-400',
    music_production: 'bg-pink-400/10 text-pink-400',
    final_review: 'bg-orange-400/10 text-orange-400',
    delivered: 'bg-green-400/10 text-green-400',
    cancelled: 'bg-red-400/10 text-red-400',
    open: 'bg-blue-400/10 text-blue-400',
    in_progress: 'bg-yellow-400/10 text-yellow-400',
    resolved: 'bg-green-400/10 text-green-400',
    closed: 'bg-white/10 text-white/50',
    pending: 'bg-yellow-400/10 text-yellow-400',
    completed: 'bg-green-400/10 text-green-400',
  };
  return map[status] || 'bg-white/10 text-white/50';
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(status)}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function exportCSV(data: object[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify((row as any)[k] ?? '')).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Tab definitions per role ─────────────────────────────────────────────────

const ALL_TABS = [
  { id: 'dashboard', label: 'Dashboard', roles: ['admin', 'operator'] },
  { id: 'orders', label: 'Orders', roles: ['admin', 'operator'] },
  { id: 'customers', label: 'Customers', roles: ['admin', 'operator'] },
  { id: 'production', label: 'Production', roles: ['admin', 'operator', 'lyrics_team', 'music_production', 'qa_team'] },
  { id: 'delivery', label: 'Deliveries', roles: ['admin', 'operator'] },
  { id: 'staff', label: 'Staff', roles: ['admin'] },
  { id: 'support', label: 'Support', roles: ['admin', 'operator', 'support'] },
  { id: 'analytics', label: 'Analytics', roles: ['admin'] },
  { id: 'affiliates', label: 'Affiliates', roles: ['admin'] },
  { id: 'packages', label: 'Packages', roles: ['admin'] },
  { id: 'coupons', label: 'Coupons', roles: ['admin'] },
  { id: 'banners', label: 'Banners', roles: ['admin'] },
  { id: 'settings', label: 'Settings', roles: ['admin'] },
  { id: 'logs', label: 'System Logs', roles: ['admin'] },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const role = user?.role || '';
  const isAdmin = role === 'admin';

  const tabs = ALL_TABS.filter(t => t.roles.includes(role));
  const [view, setView] = useState(tabs[0]?.id || 'orders');

  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderEditMode, setOrderEditMode] = useState(false);
  const [orderEditData, setOrderEditData] = useState<Partial<Order>>({});

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('');

  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'operator', department: '', phone: '' });
  const [staffMsg, setStaffMsg] = useState('');

  const [packageForm, setPackageForm] = useState({ name: '', price: '', delivery_hours: '', description: '', category: '' });
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const [affiliateForm, setAffiliateForm] = useState({ name: '', coupon_code: '', coupon_type: 'percentage', discount_value: '', commission_percent: '', usage_limit: '', start_date: '', end_date: '' });
  const [editingAffiliateId, setEditingAffiliateId] = useState<string | null>(null);

  // Coupon state
  const [couponForm, setCouponForm] = useState({ code: '', description: '', coupon_type: 'percentage', discount_value: '', min_order_value: '0', max_discount: '', usage_limit: '', start_date: '', end_date: '' });
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [settingForm, setSettingForm] = useState({ type: 'music_style', value: '', price: '0', description: '' });
  const [settingTypeFilter, setSettingTypeFilter] = useState('');
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('build_cache_enabled') !== 'false'; } catch { return true; }
  });
  const [cacheClearing, setCacheClearing] = useState(false);
  const [cacheMsg, setCacheMsg] = useState('');

  // Banner state
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerAltText, setBannerAltText] = useState('');
  const [bannerSortOrder, setBannerSortOrder] = useState('0');
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');

  // ── Fetch ──

  const fetchAll = async () => {
    try {
      const promises: Promise<any>[] = [];

      if (['admin', 'operator'].includes(role)) {
        promises.push(
          fetchJson<Order[]>('/orders').then(d => setOrders(d || [])),
          fetchJson<Customer[]>('/customers').then(d => setCustomers(d || [])),
          fetchJson<Package[]>('/packages').then(d => setPackages(d || [])),
          fetchJson<StaffMember[]>('/auth/operators').then(d => setStaff(d || [])),
          fetchJson<Ticket[]>('/tickets').then(d => setTickets(d || [])),
        );
      }

      if (['lyrics_team', 'music_production', 'qa_team'].includes(role)) {
        promises.push(fetchJson<Order[]>('/orders').then(d => setOrders(d || [])));
      }

      if (role === 'support') {
        promises.push(fetchJson<Ticket[]>('/tickets').then(d => setTickets(d || [])));
      }

      if (isAdmin) {
        promises.push(
          fetchJson<Affiliate[]>('/affiliates').then(d => setAffiliates(d || [])),
        fetchJson<Coupon[]>('/coupons').then(d => setCoupons(d || [])),
          fetchJson<Setting[]>('/settings/all').then(d => setSettings(d || [])),
          fetchJson<Log[]>('/logs').then(d => setLogs(d || [])),
          fetchJson<Banner[]>('/banners').then(d => setBanners(d || [])),
        );
      }

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Stats ──

  const stats = useMemo(() => {
    const total = orders.length;
    const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders.reduce((s, o) => s + (o.total_price || o.package_id?.price || 0), 0);
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const todayDeadlines = orders.filter(o => {
      if (!o.deadline) return false;
      const d = new Date(o.deadline).toDateString();
      return d === new Date().toDateString();
    }).length;
    return { total, active, delivered, revenue, openTickets, todayDeadlines };
  }, [orders, tickets]);

  // ── Order update ──

  const updateOrder = async (id: string, data: Partial<Order>) => {
    await putJson(`/orders/${id}`, data);
    fetchAll();
  };

  // ── Filtered orders ──

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !orderSearch ||
        o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = !orderStatusFilter || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // ── Ticket helpers ──

  const handleTicketReply = async () => {
    if (!selectedTicket || !ticketReply.trim()) return;
    await postJson(`/tickets/${selectedTicket._id}/reply`, { message: ticketReply });
    setTicketReply('');
    const updated = await fetchJson<Ticket[]>('/tickets');
    setTickets(updated || []);
    const refreshed = (updated || []).find(t => t._id === selectedTicket._id);
    if (refreshed) setSelectedTicket(refreshed);
  };

  const handleTicketStatus = async (id: string, status: string) => {
    await putJson(`/tickets/${id}`, { status });
    fetchAll();
  };

  // ── Staff ──

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffMsg('');
    try {
      await postJson('/auth/operators', staffForm);
      setStaffMsg(`Account created for ${staffForm.email}`);
      setStaffForm({ name: '', email: '', password: '', role: 'operator', department: '', phone: '' });
      fetchAll();
    } catch (err: any) {
      setStaffMsg(err.message || 'Failed to create staff');
    }
  };

  // ── Package ──

  const handleSavePackage = async () => {
    if (!packageForm.name || !packageForm.price) return;
    const payload = { name: packageForm.name, price: Number(packageForm.price), delivery_hours: Number(packageForm.delivery_hours), description: packageForm.description, category: packageForm.category };
    if (editingPackageId) await putJson(`/packages/${editingPackageId}`, payload);
    else await postJson('/packages', payload);
    setEditingPackageId(null);
    setPackageForm({ name: '', price: '', delivery_hours: '', description: '', category: '' });
    fetchAll();
  };

  // ── Affiliate ──

  const handleSaveAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...affiliateForm, discount_value: Number(affiliateForm.discount_value), commission_percent: Number(affiliateForm.commission_percent), usage_limit: affiliateForm.usage_limit ? Number(affiliateForm.usage_limit) : null };
    if (editingAffiliateId) await putJson(`/affiliates/${editingAffiliateId}`, payload);
    else await postJson('/affiliates', payload);
    setEditingAffiliateId(null);
    setAffiliateForm({ name: '', coupon_code: '', coupon_type: 'percentage', discount_value: '', commission_percent: '', usage_limit: '', start_date: '', end_date: '' });
    fetchAll();
  };

  // — Coupon —
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...couponForm,
      discount_value: Number(couponForm.discount_value),
      min_order_value: Number(couponForm.min_order_value) || 0,
      max_discount: couponForm.max_discount ? Number(couponForm.max_discount) : null,
      usage_limit: couponForm.usage_limit ? Number(couponForm.usage_limit) : null,
    };
    if (editingCouponId) await putJson(`/coupons/${editingCouponId}`, payload);
    else await postJson('/coupons', payload);
    setEditingCouponId(null);
    setCouponForm({ code: '', description: '', coupon_type: 'percentage', discount_value: '', min_order_value: '0', max_discount: '', usage_limit: '', start_date: '', end_date: '' });
    fetchAll();
  };

  // — Build Cache handlers —
  const toggleCache = (val: boolean) => {
    setCacheEnabled(val);
    localStorage.setItem('build_cache_enabled', String(val));
    setCacheMsg(val ? 'Build cache enabled.' : 'Build cache disabled.');
    setTimeout(() => setCacheMsg(''), 3000);
  };
  const handleClearCache = async () => {
    setCacheClearing(true);
    setCacheMsg('');
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k: string) => caches.delete(k)));
      }
      Object.keys(localStorage).filter(k => k.startsWith('build_') || k.startsWith('vite_')).forEach(k => localStorage.removeItem(k));
      setCacheMsg('Cache cleared successfully!');
    } catch {
      setCacheMsg('Failed to clear cache.');
    } finally {
      setCacheClearing(false);
      setTimeout(() => setCacheMsg(''), 4000);
    }
  };
  // ── Banner ──

  const handleUploadBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFile) { setBannerMsg('Please select an image file.'); return; }
    setBannerUploading(true);
    setBannerMsg('');
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('image', bannerFile);
      formData.append('altText', bannerAltText);
      formData.append('sortOrder', bannerSortOrder);
      const res = await fetch(`${(import.meta.env.VITE_API_URL || 'http://204.168.208.53:5000/api')}/banners`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      setBannerFile(null);
      setBannerAltText('');
      setBannerSortOrder('0');
      setBannerMsg('Banner uploaded successfully!');
      fetchAll();
    } catch (err: any) {
      setBannerMsg(err.message || 'Upload failed');
    } finally {
      setBannerUploading(false);
      setTimeout(() => setBannerMsg(''), 4000);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    await deleteJson(`/banners/${id}`, {});
    fetchAll();
  };

  // ── Setting ──

  const handleCreateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    await postJson('/settings', { ...settingForm, price: Number(settingForm.price) });
    setSettingForm({ type: 'music_style', value: '', price: '0', description: '' });
    fetchAll();
  };

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4DFF] mx-auto"></div>
          <p className="mt-4 text-white/60">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-white/10 px-4 py-8">
        <div className="mb-6 px-3">
          <p className="text-[10px] uppercase tracking-widest text-white/30">{role.replace(/_/g, ' ')} Panel</p>
          <p className="mt-1 text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${view === t.id ? 'bg-[#6C4DFF]/20 text-[#A78BFA]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-white/50 hover:text-white">
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top nav */}
        <div className="lg:hidden flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs ${view === t.id ? 'bg-[#6C4DFF] text-white' : 'border border-white/20 text-white/60'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* ══ DASHBOARD ══════════════════════════════════════════════════════ */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Dashboard</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Orders', value: stats.total },
                  { label: 'Active', value: stats.active },
                  { label: 'Delivered', value: stats.delivered },
                  { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}` },
                  { label: 'Open Tickets', value: stats.openTickets },
                  { label: "Today's Deadlines", value: stats.todayDeadlines },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/50">{c.label}</p>
                    <p className="mt-2 text-2xl font-bold">{c.value}</p>
                  </div>
                ))}
              </div>

              {/* Status Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Order Status Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ORDER_STATUSES.map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    return (
                      <div key={s} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <Badge status={s} />
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Upcoming Deadlines</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-white/40 text-xs"><th className="pb-2 text-left">Order</th><th className="pb-2 text-left">Customer</th><th className="pb-2 text-left">Status</th><th className="pb-2 text-left">Deadline</th></tr></thead>
                  <tbody>
                    {orders
                      .filter(o => o.deadline && !['delivered', 'cancelled'].includes(o.status))
                      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                      .slice(0, 8)
                      .map(o => (
                        <tr key={o._id} className="border-t border-white/10">
                          <td className="py-2 font-mono text-xs">{o.order_code}</td>
                          <td className="py-2">{o.customer_name}</td>
                          <td className="py-2"><Badge status={o.status} /></td>
                          <td className="py-2 text-white/60">{new Date(o.deadline!).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    {orders.filter(o => o.deadline && !['delivered', 'cancelled'].includes(o.status)).length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-white/30">No upcoming deadlines</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recent Orders */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Recent Orders</h3>
                <div className="space-y-2">
                  {orders.slice(0, 6).map(o => (
                    <div key={o._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                      <div>
                        <p className="font-mono text-xs text-white/60">{o.order_code}</p>
                        <p className="font-medium">{o.customer_name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status={o.status} />
                        <p className="text-xs text-white/40">{new Date(o.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ ORDERS ═════════════════════════════════════════════════════════ */}
          {view === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Orders</h2>
                <button
                  onClick={() => exportCSV(filteredOrders.map(o => ({ code: o.order_code, customer: o.customer_name, email: o.customer_email, status: o.status, created: o.created_at })), 'orders.csv')}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/70 hover:text-white"
                >
                  Export CSV
                </button>
              </div>
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <input
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search order / customer…"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 flex-1 min-w-[200px]"
                />
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white"
                >
                  <option value="">All Statuses</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              {/* Table */}
              {selectedOrder ? (
                <OrderDetailPanel
                  order={selectedOrder}
                  staff={staff}
                  editMode={orderEditMode}
                  editData={orderEditData}
                  onEditChange={d => setOrderEditData({ ...orderEditData, ...d })}
                  onSave={async () => {
                    await updateOrder(selectedOrder._id, orderEditData);
                    setSelectedOrder(null);
                    setOrderEditMode(false);
                    setOrderEditData({});
                  }}
                  onClose={() => { setSelectedOrder(null); setOrderEditMode(false); setOrderEditData({}); }}
                  onEdit={() => { setOrderEditMode(true); setOrderEditData(selectedOrder); }}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/10">
                      <tr className="text-white/40 text-xs">
                        <th className="px-4 py-3 text-left">Order</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Package</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs">{o.order_code}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{o.customer_name}</p>
                            <p className="text-xs text-white/40">{o.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 text-white/70">{o.package_id?.name || '—'}</td>
                          <td className="px-4 py-3"><Badge status={o.status} /></td>
                          <td className="px-4 py-3 text-white/50 text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
                              >
                                View
                              </button>
                              <select
                                value={o.status}
                                onChange={e => updateOrder(o._id, { status: e.target.value })}
                                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                              >
                                {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-[#1a1a2e]">{s.replace(/_/g, ' ')}</option>)}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={6} className="py-10 text-center text-white/30">No orders found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══ CUSTOMERS ══════════════════════════════════════════════════════ */}
          {view === 'customers' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Customers</h2>
                <button
                  onClick={() => exportCSV(customers.map(c => ({ name: c.name, email: c.email, phone: c.phone || '', orders: c.total_orders })), 'customers.csv')}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/70 hover:text-white"
                >
                  Export CSV
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/40 text-xs">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Orders</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-white/60">{c.email}</td>
                        <td className="px-4 py-3 text-white/60">{c.phone || '—'}</td>
                        <td className="px-4 py-3">{c.total_orders}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${c.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-white/30">No customers yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PRODUCTION ═════════════════════════════════════════════════════ */}
          {view === 'production' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Production Workflow</h2>
              {/* Pipeline stages */}
              {(['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review'] as const).map(stage => {
                // Filter by role
                if (role === 'lyrics_team' && stage !== 'lyrics_in_progress') return null;
                if (role === 'music_production' && stage !== 'music_production') return null;
                if (role === 'qa_team' && stage !== 'final_review') return null;

                const stageOrders = orders.filter(o => o.status === stage);
                return (
                  <div key={stage} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                      <Badge status={stage} />
                      <span className="text-sm text-white/50">{stageOrders.length} order{stageOrders.length !== 1 ? 's' : ''}</span>
                    </div>
                    {stageOrders.length === 0 ? (
                      <p className="px-5 py-6 text-sm text-white/30 text-center">No orders in this stage</p>
                    ) : (
                      <div className="divide-y divide-white/10">
                        {stageOrders.map(o => (
                          <ProductionOrderRow
                            key={o._id}
                            order={o}
                            stage={stage}
                            staff={staff}
                            onUpdate={async (data) => { await updateOrder(o._id, data); }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ DELIVERIES ═════════════════════════════════════════════════════ */}
          {view === 'delivery' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Deliveries</h2>
              {orders.filter(o => ['final_review', 'delivered'].includes(o.status)).length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/30">
                  No orders ready for delivery
                </div>
              )}
              {orders.filter(o => ['final_review', 'delivered'].includes(o.status)).map(o => (
                <div key={o._id} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-white/40">{o.order_code}</p>
                      <p className="font-semibold text-lg">{o.customer_name}</p>
                      <p className="text-sm text-white/50">{o.customer_email} {o.customer_phone && `• ${o.customer_phone}`}</p>
                    </div>
                    <Badge status={o.status} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { label: 'MP3 Link', key: 'audio_mp3' },
                      { label: 'WAV Link', key: 'audio_wav' },
                      { label: 'Instrumental Link', key: 'audio_instrumental' },
                      { label: 'Video Reel Link', key: 'video_reel' },
                      { label: 'Lyrics PDF Link', key: 'lyrics_pdf' },
                    ].map(f => (
                      <div key={f.key} className="flex gap-2">
                        <input
                          defaultValue={(o as any)[f.key] || ''}
                          placeholder={f.label}
                          onBlur={e => updateOrder(o._id, { [f.key]: e.target.value })}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {o.status === 'final_review' && (
                      <button
                        onClick={() => updateOrder(o._id, { status: 'delivered' })}
                        className="rounded-full bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 text-sm font-medium"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    <DeliveryNotesInput order={o} onSave={data => updateOrder(o._id, data)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ STAFF MANAGEMENT ═══════════════════════════════════════════════ */}
          {view === 'staff' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Staff Management</h2>

              {/* Create form */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-4">Add Team Member</h3>
                {staffMsg && (
                  <p className={`mb-3 text-sm ${staffMsg.includes('created') ? 'text-green-400' : 'text-red-400'}`}>{staffMsg}</p>
                )}
                <form onSubmit={handleCreateStaff} className="grid md:grid-cols-3 gap-3">
                  <input required value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Full name" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input required type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="Email" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input required type="password" minLength={6} value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} placeholder="Password (min 6)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <select value={staffForm.role} onChange={e => setStaffForm({ ...staffForm, role: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white">
                    {STAFF_ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                  </select>
                  <input value={staffForm.department} onChange={e => setStaffForm({ ...staffForm, department: e.target.value })} placeholder="Department (optional)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="Phone (optional)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <button type="submit" className="md:col-span-3 rounded-full bg-[#6C4DFF] py-2 text-sm font-semibold">Add Staff Member</button>
                </form>
              </div>

              {/* Staff list */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/40 text-xs">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(s => (
                      <tr key={s._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                        <td className="px-4 py-3 text-white/60">{s.email}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{s.role.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${s.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                            {s.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { putJson(`/auth/operators/${s._id}`, {}); setTimeout(fetchAll, 500); }} className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10">
                              {s.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => { deleteJson(`/auth/operators/${s._id}`, {}); setTimeout(fetchAll, 500); }} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400">
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {staff.length === 0 && (
                      <tr><td colSpan={5} className="py-10 text-center text-white/30">No staff members yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ SUPPORT ════════════════════════════════════════════════════════ */}
          {view === 'support' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Support Tickets</h2>
                <select
                  value={ticketStatusFilter}
                  onChange={e => setTicketStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white"
                >
                  <option value="">All Statuses</option>
                  {['open', 'in_progress', 'resolved', 'closed'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              {selectedTicket ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-white/40">{selectedTicket.ticket_code}</p>
                      <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                      <p className="text-sm text-white/50">{selectedTicket.customer_name} — {selectedTicket.customer_email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedTicket.status}
                        onChange={async e => {
                          await handleTicketStatus(selectedTicket._id, e.target.value);
                          setSelectedTicket({ ...selectedTicket, status: e.target.value });
                        }}
                        className="rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-1.5 text-sm text-white"
                      >
                        {['open', 'in_progress', 'resolved', 'closed'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                      <button onClick={() => setSelectedTicket(null)} className="rounded-full border border-white/20 px-3 py-1.5 text-sm">Back</button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/80">{selectedTicket.message}</p>
                    <p className="mt-2 text-xs text-white/30">{new Date(selectedTicket.created_at).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-3">
                    {selectedTicket.replies.map((r, i) => (
                      <div key={i} className={`rounded-xl p-4 ${r.sender_role === 'user' ? 'border border-white/10 bg-white/5' : 'border border-[#6C4DFF]/30 bg-[#6C4DFF]/10'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-white/70">{r.sender_name} <span className="text-white/40">({r.sender_role})</span></span>
                          <span className="text-xs text-white/30">{new Date(r.created_at).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-sm">{r.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <textarea
                      value={ticketReply}
                      onChange={e => setTicketReply(e.target.value)}
                      placeholder="Write a reply…"
                      rows={3}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30"
                    />
                    <button onClick={handleTicketReply} className="rounded-xl bg-[#6C4DFF] px-5 py-3 text-sm font-semibold self-end">
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/10">
                      <tr className="text-white/40 text-xs">
                        <th className="px-4 py-3 text-left">Ticket</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets
                        .filter(t => !ticketStatusFilter || t.status === ticketStatusFilter)
                        .map(t => (
                          <tr key={t._id} className="border-t border-white/10 hover:bg-white/5">
                            <td className="px-4 py-3 font-mono text-xs">{t.ticket_code}</td>
                            <td className="px-4 py-3">{t.customer_name}</td>
                            <td className="px-4 py-3 max-w-[200px] truncate">{t.subject}</td>
                            <td className="px-4 py-3"><Badge status={t.status} /></td>
                            <td className="px-4 py-3 text-white/40 text-xs">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => setSelectedTicket(t)} className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10">
                                Open
                              </button>
                            </td>
                          </tr>
                        ))}
                      {tickets.length === 0 && (
                        <tr><td colSpan={6} className="py-10 text-center text-white/30">No tickets</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══ ANALYTICS ══════════════════════════════════════════════════════ */}
          {view === 'analytics' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Analytics</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: stats.total },
                  { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}` },
                  { label: 'Delivery Rate', value: `${stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0}%` },
                  { label: 'Avg Order Value', value: `₹${stats.total ? Math.round(stats.revenue / stats.total).toLocaleString('en-IN') : 0}` },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs text-white/50">{c.label}</p>
                    <p className="mt-3 text-3xl font-bold">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white/80 mb-4">Orders by Status</h3>
                  <div className="space-y-2">
                    {ORDER_STATUSES.map(s => {
                      const count = orders.filter(o => o.status === s).length;
                      const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>{s.replace(/_/g, ' ')}</span>
                            <span>{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-[#6C4DFF]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white/80 mb-4">Orders by Music Style</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(orders.map(o => o.music_style).filter(Boolean))).slice(0, 8).map(style => {
                      const count = orders.filter(o => o.music_style === style).length;
                      const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <div key={style}>
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>{style}</span>
                            <span>{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-[#FF3B81]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white/80 mb-4">Revenue by Package</h3>
                  <div className="space-y-2">
                    {packages.map(pkg => {
                      const pkgOrders = orders.filter(o => o.package_id?._id === pkg._id || (o.package_id as any) === pkg._id);
                      const rev = pkgOrders.reduce((s, o) => s + (o.total_price || pkg.price || 0), 0);
                      return (
                        <div key={pkg._id} className="flex justify-between text-sm">
                          <span className="text-white/70">{pkg.name}</span>
                          <span className="font-medium">₹{rev.toLocaleString('en-IN')} ({pkgOrders.length} orders)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white/80 mb-4">Orders by Language</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(orders.map(o => o.language).filter(Boolean))).slice(0, 8).map(lang => {
                      const count = orders.filter(o => o.language === lang).length;
                      const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <div key={lang}>
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>{lang}</span>
                            <span>{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-green-400" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ AFFILIATES ═════════════════════════════════════════════════════ */}
          {view === 'affiliates' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Affiliate & Coupon Management</h2>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-4">{editingAffiliateId ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <form onSubmit={handleSaveAffiliate} className="grid md:grid-cols-3 gap-3">
                  <input required value={affiliateForm.name} onChange={e => setAffiliateForm({ ...affiliateForm, name: e.target.value })} placeholder="Affiliate name" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input required value={affiliateForm.coupon_code} onChange={e => setAffiliateForm({ ...affiliateForm, coupon_code: e.target.value.toUpperCase() })} placeholder="COUPON CODE" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white font-mono uppercase" />
                  <select value={affiliateForm.coupon_type} onChange={e => setAffiliateForm({ ...affiliateForm, coupon_type: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                  <input required type="number" value={affiliateForm.discount_value} onChange={e => setAffiliateForm({ ...affiliateForm, discount_value: e.target.value })} placeholder="Discount value" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input type="number" value={affiliateForm.commission_percent} onChange={e => setAffiliateForm({ ...affiliateForm, commission_percent: e.target.value })} placeholder="Commission %" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input type="number" value={affiliateForm.usage_limit} onChange={e => setAffiliateForm({ ...affiliateForm, usage_limit: e.target.value })} placeholder="Usage limit (blank = unlimited)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input type="date" value={affiliateForm.start_date} onChange={e => setAffiliateForm({ ...affiliateForm, start_date: e.target.value })} placeholder="Start date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input type="date" value={affiliateForm.end_date} onChange={e => setAffiliateForm({ ...affiliateForm, end_date: e.target.value })} placeholder="End date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 rounded-full bg-[#6C4DFF] py-2 text-sm font-semibold">
                      {editingAffiliateId ? 'Update' : 'Create'}
                    </button>
                    {editingAffiliateId && (
                      <button type="button" onClick={() => { setEditingAffiliateId(null); setAffiliateForm({ name: '', coupon_code: '', coupon_type: 'percentage', discount_value: '', commission_percent: '', usage_limit: '', start_date: '', end_date: '' }); }} className="rounded-full border border-white/20 px-4 py-2 text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/40 text-xs">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Code</th>
                      <th className="px-4 py-3 text-left">Discount</th>
                      <th className="px-4 py-3 text-left">Used</th>
                      <th className="px-4 py-3 text-left">Revenue</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map(a => (
                      <tr key={a._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 font-medium">{a.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#A78BFA]">{a.coupon_code}</td>
                        <td className="px-4 py-3">{a.coupon_type === 'percentage' ? `${a.discount_value}%` : `₹${a.discount_value}`}</td>
                        <td className="px-4 py-3">{a.usage_count}{a.usage_limit ? `/${a.usage_limit}` : ''}</td>
                        <td className="px-4 py-3">₹{a.revenue_generated.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${a.is_active ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                            {a.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingAffiliateId(a._id); setAffiliateForm({ name: a.name, coupon_code: a.coupon_code, coupon_type: a.coupon_type, discount_value: String(a.discount_value), commission_percent: String(a.commission_percent), usage_limit: a.usage_limit ? String(a.usage_limit) : '', start_date: a.start_date ? a.start_date.slice(0, 10) : '', end_date: a.end_date ? a.end_date.slice(0, 10) : '' }); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                              Edit
                            </button>
                            <button onClick={async () => { await putJson(`/affiliates/${a._id}`, { is_active: !a.is_active }); fetchAll(); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                              {a.is_active ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={async () => { await deleteJson(`/affiliates/${a._id}`, {}); fetchAll(); }} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {affiliates.length === 0 && (
                      <tr><td colSpan={7} className="py-10 text-center text-white/30">No affiliates yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PACKAGES ═══════════════════════════════════════════════════════ */}
          {view === 'packages' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Package Configuration</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-4">{editingPackageId ? 'Edit Package' : 'New Package'}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })} placeholder="Package name" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input value={packageForm.category} onChange={e => setPackageForm({ ...packageForm, category: e.target.value })} placeholder="Category" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })} placeholder="Price (₹)" type="number" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input value={packageForm.delivery_hours} onChange={e => setPackageForm({ ...packageForm, delivery_hours: e.target.value })} placeholder="Delivery hours" type="number" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <textarea value={packageForm.description} onChange={e => setPackageForm({ ...packageForm, description: e.target.value })} placeholder="Description" className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white min-h-[80px]" />
                  <div className="md:col-span-2 flex gap-3">
                    <button onClick={handleSavePackage} className="rounded-full bg-[#6C4DFF] px-6 py-2 text-sm font-semibold">
                      {editingPackageId ? 'Update' : 'Create'}
                    </button>
                    {editingPackageId && (
                      <button onClick={() => { setEditingPackageId(null); setPackageForm({ name: '', price: '', delivery_hours: '', description: '', category: '' }); }} className="rounded-full border border-white/20 px-4 py-2 text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {packages.map(pkg => (
                  <div key={pkg._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/40">{pkg.category}</p>
                      <p className="font-semibold">{pkg.name}</p>
                      <p className="text-sm text-white/60">₹{pkg.price} • {pkg.delivery_hours}h delivery</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPackageId(pkg._id); setPackageForm({ name: pkg.name, price: String(pkg.price), delivery_hours: String(pkg.delivery_hours), description: pkg.description, category: pkg.category }); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">Edit</button>
                      <button onClick={async () => { await deleteJson(`/packages/${pkg._id}`, {}); fetchAll(); }} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* == COUPONS ════════════════════════════════════════ */}
        {view === 'coupons' && isAdmin && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold mb-4">{editingCouponId ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <form onSubmit={handleSaveCoupon} className="grid md:grid-cols-3 gap-3">
                <input required value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="COUPON CODE" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white font-mono uppercase" />
                <input value={couponForm.description} onChange={e => setCouponForm({ ...couponForm, description: e.target.value })} placeholder="Description (optional)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <select value={couponForm.coupon_type} onChange={e => setCouponForm({ ...couponForm, coupon_type: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <input required type="number" value={couponForm.discount_value} onChange={e => setCouponForm({ ...couponForm, discount_value: e.target.value })} placeholder="Discount value" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <input type="number" value={couponForm.min_order_value} onChange={e => setCouponForm({ ...couponForm, min_order_value: e.target.value })} placeholder="Min order value (₹)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <input type="number" value={couponForm.max_discount} onChange={e => setCouponForm({ ...couponForm, max_discount: e.target.value })} placeholder="Max discount (₹, blank = unlimited)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <input type="number" value={couponForm.usage_limit} onChange={e => setCouponForm({ ...couponForm, usage_limit: e.target.value })} placeholder="Usage limit (blank = unlimited)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <input type="date" value={couponForm.start_date} onChange={e => setCouponForm({ ...couponForm, start_date: e.target.value })} placeholder="Start date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <input type="date" value={couponForm.end_date} onChange={e => setCouponForm({ ...couponForm, end_date: e.target.value })} placeholder="End date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                <div className="md:col-span-3 flex gap-2">
                  <button className="rounded-full bg-[#6C4DFF] px-6 py-2 text-sm font-semibold">
                    {editingCouponId ? 'Update' : 'Create'}
                  </button>
                  {editingCouponId && (
                    <button type="button" onClick={() => { setEditingCouponId(null); setCouponForm({ code: '', description: '', coupon_type: 'percentage', discount_value: '', min_order_value: '0', max_discount: '', usage_limit: '', start_date: '', end_date: '' }); }} className="rounded-full border border-white/20 px-4 py-2 text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-white/40 text-xs">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Discount</th>
                    <th className="px-4 py-3 text-left">Used / Limit</th>
                    <th className="px-4 py-3 text-left">Validity</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c._id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-xs text-[#A78BFA]">{c.code}</td>
                      <td className="px-4 py-3">{c.coupon_type}</td>
                      <td className="px-4 py-3">{c.coupon_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                      <td className="px-4 py-3">{c.usage_count}{c.usage_limit ? `/${c.usage_limit}` : ''}</td>
                      <td className="px-4 py-3 text-xs text-white/60">{c.start_date ? c.start_date.slice(0,10) : '—'} → {c.end_date ? c.end_date.slice(0,10) : '∞'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingCouponId(c._id); setCouponForm({ code: c.code, description: c.description, coupon_type: c.coupon_type, discount_value: String(c.discount_value), min_order_value: String(c.min_order_value), max_discount: c.max_discount ? String(c.max_discount) : '', usage_limit: c.usage_limit ? String(c.usage_limit) : '', start_date: c.start_date ? c.start_date.slice(0,10) : '', end_date: c.end_date ? c.end_date.slice(0,10) : '' }); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">Edit</button>
                          <button onClick={async () => { await putJson(`/coupons/${c._id}`, { is_active: !c.is_active }); fetchAll(); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                            {c.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button onClick={async () => { await deleteJson(`/coupons/${c._id}`, {}); fetchAll(); }} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr><td colSpan={7} className="py-10 text-center text-white/30">No coupons yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


          {/* ══ SETTINGS ═══════════════════════════════════════════════════════ */}
          {view === 'settings' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Master Settings</h2>
              <p className="text-sm text-white/50">Manage dropdown options shown during order checkout (music styles, languages, moods, etc.)</p>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-4">Add Option</h3>
                <form onSubmit={handleCreateSetting} className="grid md:grid-cols-4 gap-3">
                  <select value={settingForm.type} onChange={e => setSettingForm({ ...settingForm, type: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2 text-sm text-white">
                    {SETTING_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                  <input required value={settingForm.value} onChange={e => setSettingForm({ ...settingForm, value: e.target.value })} placeholder="Value (e.g. Bollywood)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <input type="number" value={settingForm.price} onChange={e => setSettingForm({ ...settingForm, price: e.target.value })} placeholder="Price add-on (₹)" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
                  <button type="submit" className="rounded-full bg-[#6C4DFF] py-2 text-sm font-semibold">Add</button>
                </form>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSettingTypeFilter('')} className={`rounded-full px-4 py-1.5 text-xs border ${!settingTypeFilter ? 'bg-[#6C4DFF] border-[#6C4DFF]' : 'border-white/20 text-white/60'}`}>All</button>
                {SETTING_TYPES.map(t => (
                  <button key={t} onClick={() => setSettingTypeFilter(t)} className={`rounded-full px-4 py-1.5 text-xs border ${settingTypeFilter === t ? 'bg-[#6C4DFF] border-[#6C4DFF]' : 'border-white/20 text-white/60'}`}>
                    {t.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/40 text-xs">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Value</th>
                      <th className="px-4 py-3 text-left">Price Add-on</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.filter(s => !settingTypeFilter || s.type === settingTypeFilter).map(s => (
                      <tr key={s._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3"><span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{s.type.replace(/_/g, ' ')}</span></td>
                        <td className="px-4 py-3 font-medium">{s.value}</td>
                        <td className="px-4 py-3 text-white/60">{s.price ? `+₹${s.price}` : '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${s.is_active ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                            {s.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={async () => { await putJson(`/settings/${s._id}`, { is_active: !s.is_active }); fetchAll(); }} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                              {s.is_active ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={async () => { await deleteJson(`/settings/${s._id}`, {}); fetchAll(); }} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {settings.filter(s => !settingTypeFilter || s.type === settingTypeFilter).length === 0 && (
                      <tr><td colSpan={5} className="py-10 text-center text-white/30">No settings found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BANNERS ════════════════════════════════════════════════════ */}
          {view === 'banners' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Landing Page Banners</h2>
              {/* Upload form */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-4">Upload New Banner</h3>
                <form onSubmit={handleUploadBanner} className="grid md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-white/40 mb-1">Image File (PNG / JPG / WebP, max 5 MB)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={e => setBannerFile(e.target.files?.[0] ?? null)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-[#6C4DFF] file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                  </div>
                  <input
                    value={bannerAltText}
                    onChange={e => setBannerAltText(e.target.value)}
                    placeholder="Alt text (optional)"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                  />
                  <input
                    type="number"
                    value={bannerSortOrder}
                    onChange={e => setBannerSortOrder(e.target.value)}
                    placeholder="Sort order (0 = first)"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                  />
                  <button
                    type="submit"
                    disabled={bannerUploading || !bannerFile}
                    className="rounded-full bg-[#6C4DFF] px-6 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {bannerUploading ? 'Uploading…' : 'Upload Banner'}
                  </button>
                  {bannerMsg && (
                    <p className={`md:col-span-3 text-sm ${bannerMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                      {bannerMsg}
                    </p>
                  )}
                </form>
              </div>
              {/* Banner grid */}
              {banners.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-10">No banners uploaded yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {banners.map(b => (
                    <div key={b._id} className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden group">
                      <img
                        src={`${SERVER_BASE_URL}${b.imageUrl}`}
                        alt={b.altText || 'Banner'}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-white/40 truncate">{b.altText || '—'}</p>
                        <p className="text-xs text-white/30">Order: {b.sortOrder}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(b._id)}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                        title="Delete banner"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SYSTEM LOGS ════════════════════════════════════════════════════ */}
          {view === 'logs' && isAdmin && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">System Logs</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/40 text-xs">
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{new Date(l.created_at).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3"><span className="rounded-full border border-white/20 px-2 py-0.5 text-xs font-mono">{l.action}</span></td>
                        <td className="px-4 py-3 text-white/60 text-xs">{l.user_email} <span className="text-white/30">({l.user_role})</span></td>
                        <td className="px-4 py-3 text-white/70">{l.description}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr><td colSpan={4} className="py-10 text-center text-white/30">No logs yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {/* Build Cache Control */}
            {view === 'settings' && isAdmin && (
              <div className="mx-auto max-w-6xl px-6 pb-10">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">⚙️ Build Cache Control</h2>
                      <p className="text-sm text-white/50 mt-1">Manage frontend build cache. Disable to force fresh loads; clear to wipe cached assets.</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cacheEnabled ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                      {cacheEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                      <p className="text-xs text-white/50 uppercase tracking-wide">Cache Status</p>
                      <p className="text-sm text-white">{cacheEnabled ? '✅ Active — assets served from cache' : '🚫 Inactive — fresh loads on every request'}</p>
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => toggleCache(true)} disabled={cacheEnabled}
                          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-all ${cacheEnabled ? 'bg-green-500/20 text-green-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-400'}`}>
                          Enable
                        </button>
                        <button onClick={() => toggleCache(false)} disabled={!cacheEnabled}
                          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-all ${!cacheEnabled ? 'bg-red-500/20 text-red-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-400'}`}>
                          Disable
                        </button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                      <p className="text-xs text-white/50 uppercase tracking-wide">Clear Cache</p>
                      <p className="text-sm text-white/70">Wipe all browser-cached assets, service worker caches, and local build data.</p>
                      <button onClick={handleClearCache} disabled={cacheClearing}
                        className="mt-auto rounded-full bg-[#6C4DFF] hover:bg-[#7C5DFF] disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-all">
                        {cacheClearing ? 'Clearing…' : '🗑️ Clear Cache Now'}
                      </button>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                      <p className="text-xs text-white/50 uppercase tracking-wide">Cache Info</p>
                      <ul className="text-xs text-white/60 space-y-1 mt-1">
                        <li>• Browser cache: <span className="text-white">Auto-managed</span></li>
                        <li>• Build tool: <span className="text-white">Vite 5.4.21</span></li>
                        <li>• Strategy: <span className="text-white">{cacheEnabled ? 'Cache-first' : 'Network-first'}</span></li>
                      </ul>
                      {cacheMsg && (
                        <p className={`text-xs mt-2 font-semibold ${cacheMsg.includes('success') || cacheMsg.includes('enabled') ? 'text-green-400' : cacheMsg.includes('disabled') ? 'text-yellow-400' : 'text-red-400'}`}>
                          {cacheMsg}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderDetailPanel({ order, staff, editMode, editData, onEditChange, onSave, onClose, onEdit }: {
  order: Order;
  staff: StaffMember[];
  editMode: boolean;
  editData: Partial<Order>;
  onEditChange: (d: Partial<Order>) => void;
  onSave: () => void;
  onClose: () => void;
  onEdit: () => void;
}) {
  const f = editMode ? editData : order;
  const inp = (key: keyof Order, label: string, type = 'text') => (
    <div>
      <label className="block text-xs text-white/40 mb-1">{label}</label>
      {editMode ? (
        <input type={type} value={(f as any)[key] || ''} onChange={e => onEditChange({ [key]: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
      ) : (
        <p className="text-sm text-white/80">{(order as any)[key] || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-white/40">{order.order_code}</p>
          <h3 className="text-xl font-bold">{order.customer_name}</h3>
          <p className="text-sm text-white/50">{order.customer_email}</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={onSave} className="rounded-full bg-[#6C4DFF] px-4 py-2 text-sm font-semibold">Save</button>
              <button onClick={onClose} className="rounded-full border border-white/20 px-4 py-2 text-sm">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={onEdit} className="rounded-full border border-white/20 px-4 py-2 text-sm">Edit</button>
              <button onClick={onClose} className="rounded-full border border-white/20 px-4 py-2 text-sm">Back</button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-white/40 mb-1">Status</label>
          {editMode ? (
            <select value={(f as any).status || ''} onChange={e => onEditChange({ status: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-2 text-sm text-white">
              {['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered', 'cancelled'].map(s => (
                <option key={s} value={s} className="bg-[#1a1a2e]">{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          ) : <Badge status={order.status} />}
        </div>
        {inp('music_style', 'Music Style')}
        {inp('mood', 'Mood')}
        {inp('language', 'Language')}
        {inp('singer_voice', 'Singer Voice')}
        {inp('deadline', 'Deadline', 'date')}
        {inp('admin_notes', 'Admin Notes')}
        {inp('qa_notes', 'QA Notes')}
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1">Story / Brief</label>
        <p className="text-sm text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">{order.story || '—'}</p>
      </div>

      {editMode && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white/60">Production Content</h4>
          <div className="grid gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Lyrics</label>
              <textarea value={(f as any).lyrics || ''} onChange={e => onEditChange({ lyrics: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white min-h-[100px]" />
            </div>
            {inp('music_prompt', 'Music Prompt')}
            {inp('ai_music_prompt', 'AI Music Prompt')}
            {inp('audio_mp3', 'MP3 Link')}
            {inp('audio_wav', 'WAV Link')}
            {inp('video_reel', 'Video Reel Link')}
          </div>
        </div>
      )}

      {!editMode && (order.lyrics || order.audio_mp3) && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white/60">Production Content</h4>
          {order.lyrics && <div><label className="block text-xs text-white/40 mb-1">Lyrics</label><p className="text-sm text-white/70 bg-white/5 rounded-xl p-3 border border-white/10 whitespace-pre-wrap">{order.lyrics}</p></div>}
          {order.audio_mp3 && <div><label className="block text-xs text-white/40 mb-1">MP3</label><a href={order.audio_mp3} target="_blank" rel="noreferrer" className="text-sm text-[#A78BFA] underline">{order.audio_mp3}</a></div>}
          {order.audio_wav && <div><label className="block text-xs text-white/40 mb-1">WAV</label><a href={order.audio_wav} target="_blank" rel="noreferrer" className="text-sm text-[#A78BFA] underline">{order.audio_wav}</a></div>}
        </div>
      )}
    </div>
  );
}

function ProductionOrderRow({ order, stage, staff, onUpdate }: {
  order: Order;
  stage: string;
  staff: StaffMember[];
  onUpdate: (data: Partial<Order>) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(order.admin_notes || '');
  const [lyrics, setLyrics] = useState(order.lyrics || '');
  const [saving, setSaving] = useState(false);

  const nextStage: Record<string, string> = {
    received: 'processing',
    processing: 'lyrics_in_progress',
    lyrics_in_progress: 'music_production',
    music_production: 'final_review',
    final_review: 'delivered',
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ admin_notes: notes, lyrics });
    setSaving(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-white/40">{order.order_code}</p>
          <p className="font-semibold">{order.customer_name}</p>
          <p className="text-xs text-white/50">{order.package_id?.name} • {order.music_style} • {order.mood} • {order.language}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setExpanded(!expanded)} className="rounded-full border border-white/20 px-3 py-1 text-xs">
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          {nextStage[stage] && (
            <button
              onClick={() => onUpdate({ status: nextStage[stage] })}
              className="rounded-full bg-[#6C4DFF] px-3 py-1 text-xs font-medium"
            >
              Move to {nextStage[stage].replace(/_/g, ' ')}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {order.story && (
            <div>
              <p className="text-xs text-white/40 mb-1">Customer Story</p>
              <p className="text-sm text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">{order.story}</p>
            </div>
          )}
          {order.special_message && (
            <div>
              <p className="text-xs text-white/40 mb-1">Special Message</p>
              <p className="text-sm text-white/70">{order.special_message}</p>
            </div>
          )}
          <div>
            <label className="block text-xs text-white/40 mb-1">Lyrics</label>
            <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={6}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <button onClick={handleSave} disabled={saving} className="rounded-full bg-[#6C4DFF] px-4 py-2 text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

function DeliveryNotesInput({ order, onSave }: { order: Order; onSave: (d: Partial<Order>) => void }) {
  const [note, setNote] = useState(order.admin_notes || '');
  return (
    <div className="flex gap-2 flex-1">
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Delivery notes…"
        className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30" />
      <button onClick={() => onSave({ admin_notes: note })} className="rounded-full border border-white/20 px-4 py-2 text-sm">
        Save Note
      </button>
    </div>
  );
}
