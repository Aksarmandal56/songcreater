import { Link } from 'react-router-dom';

interface PricingCardProps {
  name: string;
  price: number;
  deliveryHours: number;
  description: string;
  buttonLabel: string;
  accent?: boolean;
  linkTo?: string;
}

export default function PricingCard({
  name,
  price,
  deliveryHours,
  description,
  buttonLabel,
  accent,
  linkTo = '/order',
}: PricingCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl border ${
        accent
          ? 'border-[#FF3B81] bg-[#1a0f23] shadow-lg shadow-[#FF3B81]/20'
          : 'border-white/10 bg-white/5'
      } p-6`}
    >
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>
      <div className="mt-6">
        <p className="text-3xl font-semibold text-white">₹{price.toLocaleString('en-IN')}</p>
        <p className="text-sm text-white/60">Delivery in {deliveryHours} hours</p>
      </div>
      <Link
        to={linkTo}
        className={`mt-6 rounded-full px-4 py-2 text-center text-sm font-semibold ${
          accent ? 'bg-[#FF3B81] text-white' : 'bg-white text-[#111111]'
        }`}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
