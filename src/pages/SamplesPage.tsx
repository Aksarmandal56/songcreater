import { useEffect, useState, useRef } from 'react';
import { fetchJson, SERVER_BASE_URL } from '../lib/api';
import { Link } from 'react-router-dom';


interface Sample {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  language: string;
  category: 'personal' | 'business' | 'campaign';
  audio_url: string;
  image_url: string;
}

const categoryMeta = {
  personal: {
    label: 'Personal Songs',
    plan: 'Individual Plan - Rs.3,999',
    desc: 'Emotional songs for love, birthdays, friendships, tributes and more.',
    cta: 'Create Your Song',
    ctaLink: '/create-song',
    ctaColor: 'bg-pink-600 hover:bg-pink-500',
    badge: 'bg-pink-500/20 text-pink-300',
  },
  business: {
    label: 'Brand & Business Songs',
    plan: 'Business Plan - Rs.9,100',
    desc: 'Brand anthems, product jingles and social media reels to grow your brand.',
    cta: 'Create Brand Song',
    ctaLink: '/create-song',
    ctaColor: 'bg-blue-600 hover:bg-blue-500',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  campaign: {
    label: 'Campaign & Institution Songs',
    plan: 'Institution Plan - Rs.21,000',
    desc: 'Political campaigns, NGO anthems, social movements and large-scale events.',
    cta: 'Create Campaign Song',
    ctaLink: '/create-song',
    ctaColor: 'bg-orange-600 hover:bg-orange-500',
    badge: 'bg-orange-500/20 text-orange-300',
  },
};

function AudioCard({ sample, meta }: { sample: Sample; meta: typeof categoryMeta.personal }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = sample.audio_url
    ? (sample.audio_url.startsWith('http') ? sample.audio_url : `${SERVER_BASE_URL}${sample.audio_url}`)
    : '';

  const imageSrc = sample.image_url
    ? (sample.image_url.startsWith('http') ? sample.image_url : `${SERVER_BASE_URL}${sample.image_url}`)
    : '';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener('ended', onEnd);
    return () => el.removeEventListener('ended', onEnd);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex flex-col group hover:border-white/20 transition-all">
      {/* Banner */}
      <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={sample.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40">
            <span className="text-4xl opacity-30">🎵</span>
          </div>
        )}
        {/* Genre badge */}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${meta.badge}`}>
          {sample.genre}
        </span>
        {/* Play button overlay */}
        {audioSrc && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${playing ? 'bg-white/90' : 'bg-white/80'}`}>
              {playing ? (
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
          </button>
        )}
        {!audioSrc && (
          <div className="absolute bottom-2 left-2 text-xs text-white/40 bg-black/40 px-2 py-1 rounded">
            Preview coming soon
          </div>
        )}
        {audioSrc && (
          <audio ref={audioRef} src={audioSrc} preload="none" />
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-base font-semibold text-white leading-tight">{sample.title}</p>
        <p className="text-sm text-white/60">
          {sample.language} &bull; {sample.genre} &bull; {sample.duration}
        </p>
        {/* Audio progress bar if playing */}
        {playing && audioRef.current && (
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C4DFF] animate-pulse rounded-full" style={{ width: '60%' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState('All');
  const [activeStyle, setActiveStyle] = useState('All');

  useEffect(() => {
    fetchJson('/samples')
      .then((data: unknown) => { if (Array.isArray(data)) setSamples(data as any); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derive filter options from data
  const languages = ['All', ...Array.from(new Set(samples.map(s => s.language).filter(Boolean)))];
  const styles = ['All', ...Array.from(new Set(samples.map(s => s.genre).filter(Boolean)))];

  // Filtered samples
  const filtered = samples.filter(s => {
    const langOk = activeLang === 'All' || s.language === activeLang;
    const styleOk = activeStyle === 'All' || s.genre === activeStyle;
    return langOk && styleOk;
  });

  const filterByCategory = (cat: string) => filtered.filter(s => s.category === cat);

  const pillClass = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
      active
        ? 'bg-[#6C4DFF] border-[#6C4DFF] text-white'
        : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
    }`;

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* Hero */}
      <section className="px-6 pt-16 pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-[#6C4DFF]/20 border border-[#6C4DFF]/40 px-4 py-1 text-xs font-semibold tracking-widest text-[#6C4DFF] uppercase mb-4">
            Sample Library
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hear What We Create</h1>
          <p className="text-white/60 text-lg mb-8">Explore sample songs created for individuals, brands, and campaigns.</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[['500+', 'Songs Created'], ['12', 'Languages Supported'], ['4.9/5', 'Customer Rating']].map(([val, lbl]) => (
              <div key={lbl} className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 min-w-[140px]">
                <p className="text-2xl font-bold text-[#6C4DFF]">{val}</p>
                <p className="text-sm text-white/50 mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      {!loading && samples.length > 0 && (
        <section className="px-6 pb-6">
          <div className="mx-auto max-w-5xl bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-white/40 uppercase tracking-wide w-24">Language</span>
              <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                  <button key={l} onClick={() => setActiveLang(l)} className={pillClass(activeLang === l)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-white/40 uppercase tracking-wide w-24">Music Style</span>
              <div className="flex flex-wrap gap-2">
                {styles.map(s => (
                  <button key={s} onClick={() => setActiveStyle(s)} className={pillClass(activeStyle === s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="px-6 pb-20">
        {loading ? (
          <div className="text-center py-24 text-white/30 text-lg">Loading samples...</div>
        ) : samples.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg mb-2">No samples available yet.</p>
            <p className="text-white/20 text-sm">Check back soon — our team is uploading new samples!</p>
          </div>
        ) : (
          <>
            {(['personal', 'business', 'campaign'] as const).map(cat => {
              const list = filterByCategory(cat);
              if (list.length === 0) return null;
              const meta = categoryMeta[cat];
              return (
                <section key={cat} className="mb-14">
                  <div className="mx-auto max-w-5xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white">{meta.label}</h2>
                        <p className="text-sm text-white/50">{meta.plan} – {meta.desc}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {list.map(s => (
                        <AudioCard key={s._id} sample={s} meta={meta} />
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
            {filtered.length === 0 && samples.length > 0 && (
              <div className="text-center py-16 text-white/30">No samples match your filters.</div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-white/3 border-t border-white/10">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your story could be the next song here.</h2>
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
