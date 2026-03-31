import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';

interface Package {
  id: number;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

export default function CategoryPage() {
  const [packages] = useState<Package[]>([
    {
      id: 1,
      name: 'Personal Song',
      price: 3999,
      delivery_hours: 24,
      description: 'Perfect for birthdays, love songs, friendship, and motivation.',
      category: 'Personal'
    },
    {
      id: 2,
      name: 'Small Business Song',
      price: 9100,
      delivery_hours: 72,
      description: 'Brand anthems, product songs, and promotional tracks.',
      category: 'Business'
    },
    {
      id: 3,
      name: 'Institution Song',
      price: 21000,
      delivery_hours: 160,
      description: 'School anthems, college songs, political campaigns, and NGO tracks.',
      category: 'Institution'
    }
  ]);

  return (
    <div className="bg-[#0c0c0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Choose your song type"
          title="Select the perfect category"
          subtitle="Each category is designed for specific occasions and audiences."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <p className="mt-2 text-3xl font-semibold text-[#00D4FF]">₹{pkg.price.toLocaleString('en-IN')}</p>
              <p className="mt-1 text-sm text-white/60">Delivery in {pkg.delivery_hours} hours</p>
              <p className="mt-4 text-sm text-white/70">{pkg.description}</p>
              <Link
                to={`/order?package=${pkg.id}`}
                className="mt-6 inline-flex w-full justify-center rounded-full bg-[#6C4DFF] px-5 py-3 text-sm font-semibold"
              >
                Select {pkg.category} Song
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
