import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

interface SampleCard {
  id: number;
  title: string;
  language: string;
  style: string;
  duration: string;
  category: "personal" | "business" | "campaign";
  audioUrl: string;
}

const samples: SampleCard[] = [
  { id: 1, title: "Romantic Memory", language: "Hindi", style: "Soft Pop", duration: "1:20", category: "personal" },
  { id: 2, title: "Happy Birthday Maa", language: "Hindi", style: "Folk", duration: "1:15", category: "personal" },
  { id: 3, title: "Best Friend Forever", language: "English", style: "Pop", duration: "1:30", category: "personal" },
  { id: 4, title: "For My Love – A Romantic Dedication", language: "Hindi", style: "Soft Pop", duration: "1:30", category: "personal" },
  { id: 5, title: "A Tribute to My Hero", language: "Bhojpuri", style: "Folk", duration: "1:25", category: "personal" },
  { id: 6, title: "Grow Fast – Startup Brand Anthem", language: "English", style: "Anthem", duration: "1:20", category: "business" },
  { id: 7, title: "Product Launch Jingle", language: "Hindi", style: "Pop", duration: "1:10", category: "business" },
  { id: 8, title: "Social Media Reel Song", language: "English", style: "Rap", duration: "0:55", category: "business" },
  { id: 9, title: "Brand Identity Anthem", language: "Hindi", style: "Anthem", duration: "1:20", category: "business" },
  { id: 10, title: "Voice of Change – Campaign Anthem", language: "Hindi", style: "Anthem", duration: "1:45", category: "campaign" },
  { id: 11, title: "NGO Awareness Song", language: "Hindi", style: "Folk", duration: "1:30", category: "campaign" },
  { id: 12, title: "Social Movement Anthem", language: "English", style: "Anthem", duration: "1:40", category: "campaign" },
  { id: 13, title: "Event Opening Anthem", language: "English", style: "Pop", duration: "1:20", category: "campaign" },
];

const languages = ["All", "Hindi", "Bhojpuri", "English", "Spanish", "French", "Arabic"];
const styles = ["All", "Folk", "Pop", "Rap", "Devotional", "Anthem"];

type CategoryKey = "personal" | "business" | "campaign";

const categoryMeta: Record<CategoryKey, {
  label: string; plan: string; desc: string; cta: string; ctaLink: string;
  icon: string; gradient: string; border: string; badge: string; ctaColor: string;
}> = {
  personal: {
    label: "Personal Songs",
    plan: "Individual Plan – ₹3,999",
    desc: "Emotional songs for love, birthdays, friendships, tributes and more.",
    cta: "Create Your Song",
    ctaLink: "/create-song",
    icon: "🎵",
    gradient: "from-pink-600/30 to-purple-700/30",
    border: "border-pink-500/30",
    badge: "bg-pink-500/20 text-pink-300",
    ctaColor: "bg-pink-600 hover:bg-pink-500",
  },
  business: {
    label: "Brand & Business Songs",
    plan: "Business Plan – ₹9,100",
    desc: "Brand anthems, product jingles and social media reels to grow your brand.",
    cta: "Create Brand Song",
    ctaLink: "/create-song",
    icon: "🏢",
    gradient: "from-blue-600/30 to-cyan-700/30",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    ctaColor: "bg-blue-600 hover:bg-blue-500",
  },
  campaign: {
    label: "Campaign & Institution Songs",
    plan: "Institution Plan – ₹21,000",
    desc: "Political campaigns, NGO anthems, social movements and large-scale events.",
    cta: "Create Campaign Song",
    ctaLink: "/create-song",
    icon: "📢",
    gradient: "from-amber-600/30 to-orange-700/30",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    ctaColor: "bg-amber-500 hover:bg-amber-400",
  },
};

type MetaType = typeof categoryMeta[CategoryKey];

function AudioCard({ sample, meta }: { sample: SampleCard; meta: MetaType }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div className={`rounded-2xl border ${meta.border} bg-gradient-to-br ${meta.gradient} backdrop-blur-sm p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-white font-semibold text-base leading-snug">{sample.title}</h4>
          <p className="text-white/50 text-xs mt-1">{sample.language} &bull; {sample.style} &bull; {sample.duration}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${meta.badge}`}>{sample.style}</span>
      </div>
      {sample.audioUrl ? (
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all ${meta.ctaColor}`}>
            {playing ? "⏸ Pause" : "▶ Play Sample"}
          </button>
          <audio ref={audioRef} src={sample.audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/30 text-xs bg-white/5 rounded-lg px-3 py-2">
          🎵 Audio preview coming soon
        </div>
      )}
      <Link to="/create-song" className={`text-center text-sm font-semibold text-white py-2 rounded-xl transition-all ${meta.ctaColor}`}>
        {meta.cta}
      </Link>
    </div>
  );
}

export default function SamplesPage() {
  const [activeLang, setActiveLang] = useState("All");
  const [activeStyle, setActiveStyle] = useState("All");

  const filtered = (cat: CategoryKey) =>
    samples.filter(
      (s) => s.category === cat &&
        (activeLang === "All" || s.language === activeLang) &&
        (activeStyle === "All" || s.style === activeStyle)
    );

  const FilterBtn = ({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) => (
    <button onClick={onClick} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${active ? `${color} text-white border-transparent` : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* Hero */}
      <section className="px-6 py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-4 py-1.5 rounded-full mb-4">
            Sample Library
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Hear What We Create</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Explore sample songs created for individuals, brands, and campaigns. Each song is crafted by professional musicians and AI-powered production.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎵", stat: "500+", label: "Songs Created" },
            { icon: "🌍", stat: "12", label: "Languages Supported" },
            { icon: "⭐", stat: "4.9/5", label: "Customer Rating" },
          ].map((item) => (
            <div key={item.stat} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl py-6 px-4">
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-2xl font-bold text-[#00D4FF]">{item.stat}</span>
              <span className="text-white/60 text-sm mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="mb-4">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Language</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <FilterBtn key={lang} label={lang} active={activeLang === lang} onClick={() => setActiveLang(lang)} color="bg-[#00D4FF]" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Music Style</p>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <FilterBtn key={s} label={s} active={activeStyle === s} onClick={() => setActiveStyle(s)} color="bg-purple-600" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {(["personal", "business", "campaign"] as CategoryKey[]).map((cat) => {
        const meta = categoryMeta[cat];
        const items = filtered(cat);
        return (
          <section key={cat} className="px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{meta.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{meta.label}</h2>
                  <p className="text-white/50 text-sm">{meta.plan} &mdash; {meta.desc}</p>
                </div>
              </div>
              {items.length === 0 ? (
                <div className="text-white/30 text-center py-10 border border-white/10 rounded-2xl">
                  No samples match the selected filters for this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.slice(0, 5).map((sample) => (
                    <AudioCard key={sample.id} sample={sample} meta={meta} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* How We Create */}
      <section className="px-6 py-12 bg-white/[0.02] border-t border-b border-white/10">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Our Process"
            title="How We Create Your Song"
            subtitle="A simple 4-step journey from idea to your custom audio masterpiece."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { step: "1", icon: "💡", title: "You Submit Your Idea", desc: "Tell us about the person, occasion, or message behind the song." },
              { step: "2", icon: "✍️", title: "Our Team Writes Lyrics", desc: "Professional lyricists craft personalized verses for your story." },
              { step: "3", icon: "🎸", title: "Music Production Begins", desc: "AI-powered production with real musicians shapes your track." },
              { step: "4", icon: "🎧", title: "Final Audio Delivered", desc: "High-quality audio delivered to you within the promised time." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-2xl mb-3">
                  {item.icon}
                </div>
                <div className="text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-1">Step {item.step}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-white/50 text-sm mb-2">Trusted by Brands &amp; Individuals in 12 Languages</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your story could be the<br />
            <span className="text-[#00D4FF]">next song here.</span>
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
