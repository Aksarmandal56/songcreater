import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import StatusBadge from '../components/StatusBadge';

interface Package {
  id: number;
  name: string;
  price: number;
  delivery_hours: number;
}

interface Order {
  id: number;
  order_code: string;
  status: string;
  packages?: {
    name: string;
  };
}

export default function MobileScreens() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, ordersData] = await Promise.all([
          fetchJson<Package[]>('/api/packages'),
          fetchJson<Order[]>('/api/orders'),
        ]);
        setPackages(packagesData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Mobile data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="px-6 py-20 text-center text-white">Loading mobile screens...</div>;
  }

  return (
    <div className="bg-[#0c0c0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="mx-auto w-full max-w-[375px] rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">Home</p>
            <h3 className="mt-3 text-xl font-semibold">Turn Your Story Into a Song</h3>
            <div className="mt-4 space-y-3">
              {packages.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-white/60">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-full bg-[#6C4DFF] px-4 py-2 text-sm">Create Song</button>
          </div>

          <div className="mx-auto w-full max-w-[375px] rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">Order Form</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="font-semibold">Song Language</p>
              <p className="text-white/60">Hindi</p>
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="font-semibold">Mood</p>
              <p className="text-white/60">Celebratory</p>
            </div>
            <button className="mt-4 w-full rounded-full bg-[#FF3B81] px-4 py-2 text-sm">Next</button>
          </div>

          <div className="mx-auto w-full max-w-[375px] rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">Dashboard</p>
            <div className="mt-4 space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">{order.packages?.name}</p>
                  <div className="mt-2">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-sm">View Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
}
