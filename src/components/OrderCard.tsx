import StatusBadge from './StatusBadge';

interface OrderCardProps {
  orderCode: string;
  title: string;
  status: string;
  deliveryDate?: string;
  onViewDetails?: () => void;
}

export default function OrderCard({ orderCode, title, status, deliveryDate, onViewDetails }: OrderCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Order {orderCode}</p>
          <p className="text-lg font-semibold text-white">{title}</p>
          {deliveryDate && <p className="text-xs text-white/60">Delivery {new Date(deliveryDate).toLocaleDateString()}</p>}
        </div>
        <StatusBadge status={status} />
      </div>
      <button
        onClick={onViewDetails}
        className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
      >
        View Details
      </button>
    </div>
  );
}
