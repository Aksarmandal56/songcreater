import { useRef, useState } from 'react';
import { SERVER_BASE_URL } from '../lib/api';

export interface Sample {
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
  personal: { badge: 'bg-pink-500/20 text-pink-300' },
  business: { badge: 'bg-blue-500/20 text-blue-300' },
  campaign: { badge: 'bg-orange-500/20 text-orange-300' },
} as const;

function resolveUrl(url?: string) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${SERVER_BASE_URL}${url}`;
}

export default function SampleCard({ sample }: { sample: Sample }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageSrc = resolveUrl(sample.image_url);
  const audioSrc = resolveUrl(sample.audio_url);
  const meta = categoryMeta[sample.category] ?? categoryMeta.personal;

  const toggle = () => {
    if (!audioRef.current || !audioSrc) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition">
      <div className="relative aspect-video bg-gradient-to-br from-[#6C4DFF]/30 to-[#FF3B81]/20 flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={sample.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>
        )}
        <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${meta.badge}`}>{sample.genre}</div>
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white transition opacity-0 group-hover:opacity-100">
          {playing ? (
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          ) : (
            <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
          )}
        </button>
        {audioSrc && <audio ref={audioRef} src={audioSrc} preload="none" onEnded={() => setPlaying(false)} />}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-base font-semibold text-white leading-tight">{sample.title}</p>
        <p className="text-sm text-white/60">{sample.language} &bull; {sample.genre} &bull; {sample.duration}</p>
      </div>
    </div>
  );
}
