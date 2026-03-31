import express from 'express';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// ── Revenue Analytics ─────────────────────────────────────────────────────────

router.get('/revenue', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.period || '30');
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [allOrders, recentPayments] = await Promise.all([
      Order.find({ status: { $ne: 'cancelled' } }).populate('package_id', 'name price'),
      Payment.find({ status: 'paid', created_at: { $gte: since } }).sort({ created_at: -1 }),
    ]);

    const totalRevenue = allOrders.reduce((s, o) => s + (o.total_price || o.package_id?.price || 0), 0);
    const periodRevenue = recentPayments.reduce((s, p) => s + (p.amount || 0), 0);

    const monthlyMap = {};
    allOrders.forEach(o => {
      const m = new Date(o.created_at).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      monthlyMap[m] = (monthlyMap[m] || 0) + (o.total_price || o.package_id?.price || 0);
    });

    const packageMap = {};
    allOrders.forEach(o => {
      const name = o.package_id?.name || 'Unknown';
      if (!packageMap[name]) packageMap[name] = { name, revenue: 0, orders: 0 };
      packageMap[name].revenue += o.total_price || o.package_id?.price || 0;
      packageMap[name].orders++;
    });

    res.json({
      total_revenue: totalRevenue,
      period_revenue: periodRevenue,
      period_days: days,
      total_orders: allOrders.length,
      avg_order_value: allOrders.length ? Math.round(totalRevenue / allOrders.length) : 0,
      monthly_breakdown: monthlyMap,
      by_package: Object.values(packageMap).sort((a, b) => b.revenue - a.revenue),
      recent_payments: recentPayments.slice(0, 20),
    });
  } catch (error) {
    console.error('Analytics revenue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Orders Analytics ──────────────────────────────────────────────────────────

router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('package_id', 'name');

    const byStatus = {};
    const byLanguage = {};
    const byMusicStyle = {};
    const byMood = {};
    const byVoice = {};

    orders.forEach(o => {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      if (o.language) byLanguage[o.language] = (byLanguage[o.language] || 0) + 1;
      if (o.music_style) byMusicStyle[o.music_style] = (byMusicStyle[o.music_style] || 0) + 1;
      if (o.mood) byMood[o.mood] = (byMood[o.mood] || 0) + 1;
      if (o.singer_voice) byVoice[o.singer_voice] = (byVoice[o.singer_voice] || 0) + 1;
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyMap = {};
    orders
      .filter(o => new Date(o.created_at) >= thirtyDaysAgo)
      .forEach(o => {
        const d = new Date(o.created_at).toISOString().slice(0, 10);
        dailyMap[d] = (dailyMap[d] || 0) + 1;
      });

    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    res.json({
      total,
      by_status: byStatus,
      by_language: byLanguage,
      by_music_style: byMusicStyle,
      by_mood: byMood,
      by_voice: byVoice,
      daily_last_30: dailyMap,
      conversion_rate: total ? Math.round((delivered / total) * 100) : 0,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Upsell Analytics ──────────────────────────────────────────────────────────

router.get('/upsells', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ upsell_options: { $exists: true, $not: { $size: 0 } } });

    const upsellMap = {};
    orders.forEach(o => {
      (o.upsell_options || []).forEach(u => {
        if (!upsellMap[u]) upsellMap[u] = { count: 0 };
        upsellMap[u].count++;
      });
    });

    res.json({
      total_orders_with_upsell: orders.length,
      by_upsell: Object.entries(upsellMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count),
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Staff Productivity ────────────────────────────────────────────────────────

router.get('/staff', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('assigned_lyrics_team assigned_production_team assigned_qa_team', 'name email role');

    const staffMap = {};
    const track = (user, delivered) => {
      if (!user) return;
      const key = user._id.toString();
      if (!staffMap[key]) staffMap[key] = { name: user.name, role: user.role, email: user.email, orders: 0, delivered: 0 };
      staffMap[key].orders++;
      if (delivered) staffMap[key].delivered++;
    };

    orders.forEach(o => {
      const done = o.status === 'delivered';
      track(o.assigned_lyrics_team, done);
      track(o.assigned_production_team, done);
      track(o.assigned_qa_team, done);
    });

    res.json(Object.values(staffMap).sort((a, b) => b.orders - a.orders));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
