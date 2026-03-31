import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import PricingCard from '../components/PricingCard';
import AudioPlayerCard from '../components/AudioPlayerCard';
import TestimonialCard from '../components/TestimonialCard';
import InputField from '../components/InputField';
import Dropdown from '../components/Dropdown';
import StatusBadge from '../components/StatusBadge';
import SectionHeading from '../components/SectionHeading';

interface Package {
  id: number;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
}

interface Sample {
  id: number;
  title: string;
  genre: string;
  duration: string;
  audio_url: string;
}

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
  photo_url: string;
}

interface Option {
  id: number;
  option_type: string;
  value: string;
}

export default function DesignSystem() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, samplesData, testimonialsData, optionsData] = await Promise.all([
          fetchJson<Package[]>('/api/packages'),
          fetchJson<Sample[]>('/api/samples'),
          fetchJson<Testimonial[]>('/api/testimonials'),
          fetchJson<Option[]>('/api/options'),
        ]);
        setPackages(packagesData);
        setSamples(samplesData);
        setTestimonials(testimonialsData);
        setOptions(optionsData);
      } catch (error) {
        console.error('Design system fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="px-6 py-20 text-center text-white">Loading design system...</div>;
  }

  const dropdownOptions = options.filter((item) => item.option_type === 'language').map((item) => item.value);

  return (
    <div className="bg-[#0c0c0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Design System"
          title="Foundation, Components, and Tokens"
          subtitle="A unified system for the SongCraft AI brand, covering colors, typography, and component library snapshots."
        />
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { label: 'Primary', value: '#6C4DFF' },
            { label: 'Secondary', value: '#FF3B81' },
            { label: 'Accent', value: '#00D4FF' },
            { label: 'Dark', value: '#111111' },
            { label: 'Light', value: '#F8F8F8' },
          ].map((color) => (
            <div key={color.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="h-12 w-full rounded-xl" style={{ background: color.value }}></div>
              <p className="mt-3 text-sm font-semibold">{color.label}</p>
              <p className="text-xs text-white/60">{color.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Heading</p>
            <p className="mt-3 text-3xl font-semibold">Poppins Bold</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Subheading</p>
            <p className="mt-3 text-2xl font-medium">Poppins Medium</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Body</p>
            <p className="mt-3 text-base">Inter Regular</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <button className="rounded-full bg-[#6C4DFF] px-4 py-2 text-sm font-semibold">Primary Button</button>
          <button className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold">Secondary Button</button>
          <button className="rounded-full bg-[#FF3B81] px-4 py-2 text-sm font-semibold">CTA Button</button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">Components</p>
            <div className="grid gap-6">
              {packages.slice(0, 2).map((item, index) => (
                <PricingCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  deliveryHours={item.delivery_hours}
                  description={item.description}
                  buttonLabel="Create"
                  accent={index === 0}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {samples.slice(0, 2).map((sample) => (
              <AudioPlayerCard
                key={sample.id}
                title={sample.title}
                genre={sample.genre}
                duration={sample.duration}
                audioUrl={sample.audio_url}
              />
            ))}
            {testimonials.slice(0, 1).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                quote={testimonial.quote}
                rating={testimonial.rating}
                photoUrl={testimonial.photo_url}
              />
            ))}
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Input Field" value="" onChange={() => null} placeholder="Enter value" />
              <Dropdown label="Dropdown" value="" onChange={() => null} options={dropdownOptions} />
            </div>
            <div className="flex gap-3">
              <StatusBadge status="Writing Lyrics" />
              <StatusBadge status="Ready" />
              <StatusBadge status="Pending" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
