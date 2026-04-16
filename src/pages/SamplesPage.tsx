import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface SampleCard {
  id: number;
  title: string;
  language: string;
  style: string;
  duration: string;
  category: 'personal' | 'business' | 'campaign';
  banner: string;
  videoUrl?: string;
}

const samples: SampleCard[] = [
  { id: 1, title: 'Romantic Memory', language: 'Hindi', style: 'Soft Pop', duration: '1:20', category: 'personal', banner: '/1.png' },
  { id: 2, title: 'Happy Birthday Maa', language: 'Hindi', style: 'Folk', duration: '1:15', category: 'personal', banner: '/2.png' },
  { id: 3, title: 'Best Friend Forever', language: 'English', style: 'Pop', duration: '1:30', category: 'personal', banner: '/3.png' },
  { id: 4, title: 'For My Love - A Romantic Dedication', language: 'Hindi', style: 'Soft Pop', duration: '1:30', category: 'personal', banner: '/4.png' },
  { id: 5, title: 'A Tribute to My Hero', language: 'Bhojpuri', style: 'Folk', duration: '1:25', category: 'personal', banner: '/5.png' },
  { id: 6, title: 'Grow Fast - Startup Brand Anthem', language: 'English', style: 'Anthem', duration: '1:20', category: 'business', banner: '/6.png' },
  { id: 7, title: 'Product Launch Jingle', language: 'Hindi', style: 'Pop', duration: '1:10', category: 'business', banner: '/7.png' },
  { id: 8, title: 'Social Media Reel Song', language: 'English', style: 'Rap', duration: '0:55', category: 'business', banner: '/8.png' },
  { id: 9, title: 'Brand Identity Anthem', language: 'Hindi', style: 'Anthem', duration: '1:20', category: 'business', banner: '/9.png' },
  { id: 10, title: 'Voice of Change - Campaign Anthem', language: 'Hindi', style: 'Anthem', duration: '1:45', category: 'campaign', banner: '/1.png' },
  { id: 11, title: 'NGO Awareness Song', language: 'Hindi', style: 'Folk', duration: '1:30', category: 'campaign', banner: '/2.png' },
  { id: 12, title: 'Social Movement Anthem', language: 'English', style: 'Anthem', duration: '1:40', category: 'campaign', banner: '/3.png' },
  { id: 13, title: 'Event Opening Anthem', language: 'English', style: 'Pop', duration: '1:20', category: 'campaign', banner: '/4.png' },
];

type CategoryKey = 'personal' | 'business' | 'campaign';

const categoryMeta = {
  personal: {
    label: 'Personal Songs',
    plan: 'Individual Plan - Rs.3,999',
    desc: 'Emotional songs for love, birthdays, friendships, tributes and more.',
    cta: 'Create Your Song',
    ctaLink: '/create-song',
    border: 'border-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-300',
    ctaColor: 'bg-pink-600 hover:bg-pink-500',
  },
  business: {
    label: 'Brand & Business Songs',
    plan: 'Business Plan - Rs.9,100',
    desc: 'Brand anthems, product jingles and social media reels to grow your brand.',
    cta: 'Create Brand Song',
    ctaLink: '/create-song',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    ctaColor: 'bg-blue-600 hover:bg-blue-500',
  },
  campaign: {
    label: 'Campaign & Institution Songs',
    plan: 'Institution Plan - Rs.21,000',
    desc: 'Political campaigns, NGO anthems, social movements and large-scale events.',
    cta: 'Create Campaign Song',
    ctaLink: '/create-song',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300',
    ctaColor: 'bg-amber-500 hover:bg-amber-400',
  },
} as const;

type MetaType = typeof categoryMeta[CategoryKey];

function VideoCard({ sample, meta }: { sample: SampleCard; meta: MetaType }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`rounded-2xl border ${meta.border} overflow-hidden bg-black/40 backdrop-blur-sm flex flex-col`}>
      <div className="relative w-full" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={sample.banner} alt={sample.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${meta.badge}`}>
          {sample.style}
        </span>
      </div>
      {sample.videoUrl ? (
        <div className="w-full bg-black">
          <video
            ref={videoRef}
            src={sample.videoUrl}
            className="w-full"
            controls
            onEnded={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/30 text-xs bg-white/5 px-4 py-2">
          Video preview coming soon
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-base font-semibold text-white leading-tight">{sample.title}</p>
        <p className="text-sm text-white/60">{sample.language} &bull; {sample.style} &bull; {sample.duration}</p>
        <Link
          to={meta.ctaLink}
          className={`mt-auto text-center text-sm font-semibold text-white py-2 rounded-xl transition-all ${meta.ctaColor}`}
        >
          {meta.cta}
        </Link>
      </div>
    </div>
  );
}

export default function SamplesPage() {
  const [activeLang, setActiveLang] = useState('All');
  const [activeStyle, setActiveStyle] = useState('All');

  const filtered = (cat: CategoryKey) =>
    samples.filter(
      (s) =>
        s.category === cat &&
        (activeLang === 'All' || s.language === activeLang) &&
        (activeStyle === 'All' || s.style === activeStyle)
    );

  const FilterBtn = ({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
        active ? `${color} text-white border-transparent` : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
      }`}
    >
      {label}
    </button>
  );

  const languages = ['All', 'Hindi', 'English', 'Bhojpuri', 'Spanish', 'French', 'Arabic'];
  const styles = ['All', 'Folk', 'Pop', 'Rap', 'Devotional', 'Anthem'];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative px-6 pt-24 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl relative">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-semibold uppercase tracking-widest mb-4">
            Sample Library
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hear What We Create</h1>
          <p className="text-white/60 text-lg mb-8">
            Explore sample songs created for individuals, brands, and campaigns.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: '500+', label: 'Songs Created' },
              { value: '12', label: 'Languages Supported' },
              { value: '4.9/5', label: 'Customer Rating' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xl font-bold text-[#00D4FF]">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <FilterBtn key={l} label={l} active={activeLang === l} onClick={() => setActiveLang(l)} color="bg-[#00D4FF]" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Music Style</p>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <FilterBtn key={s} label={s} active={activeStyle === s} onClick={() => setActiveStyle(s)} color="bg-purple-600" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {(['personal', 'business', 'campaign'] as CategoryKey[]).map((cat) => {
        const meta = categoryMeta[cat];
        const list = filtered(cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{meta.label}</h2>
                  <p className="text-sm text-white/50">{meta.plan} - {meta.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((sample) => (
                  <VideoCard key={sample.id} sample={sample} meta={meta} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your story could be the next song here.
          </h2>
          <p className="text-white/60 mb-8">Join 500+ creators who turned their stories into unforgettable songs.</p>
          <Link
            to="/create-song"
            className="inline-block bg-[#00D4FF] hover:bg-[#00b8d9] text-black font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg shadow-[#00D4FF]/30"
          >
            Create Your Song Now
          </Link>
        </div>
      </section>
    </div>
  );
}