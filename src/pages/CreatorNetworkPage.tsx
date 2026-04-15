import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://204.168.208.53:5000/api';

export default function CreatorNetworkPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    whatsapp: "",
    role: "",
    languages: "",
    genres: [] as string[],
    portfolio: "",
    recordingSetup: "",
    experienceLevel: "",
    availability: "",
    additionalInfo: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const genreOptions = ["Folk", "Pop", "Rap", "Devotional", "Classical", "Campaign / Anthem", "Other"];
  const languagesList = ["Hindi", "Bhojpuri", "English", "Spanish", "French", "Punjabi", "Bengali", "Tamil", "Telugu", "Arabic"];

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/creator-network`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          phone: formData.whatsapp,
          role: formData.role,
          languages: formData.languages,
          genres: formData.genres,
          portfolio: formData.portfolio,
          recordingSetup: formData.recordingSetup,
          experienceLevel: formData.experienceLevel,
          availability: formData.availability,
          additionalInfo: formData.additionalInfo,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Submission failed');
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* ── Hero ── */}
      <section className="px-6 py-14 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-4 py-1.5 rounded-full mb-4">
            Join the Creator Network
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Create. Collaborate. Earn.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Express In Music is building a global network of lyricists, vocal artists, and music creators who collaborate on projects for individuals, brands, and institutions across languages and cultures.
          </p>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Why Join Express In Music</h2>
            <p className="text-white/50 text-sm mt-2">Collaborate on music projects from different regions and industries</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🎵", title: "Real Music Projects", desc: "Personal dedications, brand anthems, campaign songs, awareness music and more." },
              { icon: "🌍", title: "Global Collaboration", desc: "Work with clients and creators from different countries, cultures and languages." },
              { icon: "🏠", title: "Flexible Remote Work", desc: "Contribute from anywhere in the world — home studio or professional setup." },
              { icon: "🚀", title: "Creative Exposure", desc: "Expand your portfolio working with real clients across diverse music projects." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 gap-3">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="text-white font-semibold text-base">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Can Join ── */}
      <section className="px-6 pb-12 bg-white/[0.02] border-t border-b border-white/10 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Who Can Join</h2>
            <p className="text-white/50 text-sm mt-2">Creative professionals who contribute to music production in different roles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✍️",
                title: "Lyricists",
                color: "from-pink-600/20 to-purple-700/20",
                border: "border-pink-500/30",
                badge: "text-pink-300",
                desc: "Songwriters, poets, and creative writers who transform ideas into meaningful lyrics.",
                points: ["Writing lyrics based on project briefs", "Adapting style based on theme or emotion", "Writing in multiple languages or styles"],
              },
              {
                icon: "🎤",
                title: "Vocal Artists / Singers",
                color: "from-blue-600/20 to-cyan-700/20",
                border: "border-blue-500/30",
                badge: "text-blue-300",
                desc: "Singers who can record vocals and deliver expressive performances.",
                points: ["Recording vocals for songs", "Performing in different music styles", "Delivering clean audio recordings"],
              },
              {
                icon: "🎸",
                title: "Music Producers & Composers",
                color: "from-amber-600/20 to-orange-700/20",
                border: "border-amber-500/30",
                badge: "text-amber-300",
                desc: "Producers who compose melodies, create arrangements, or contribute to music production.",
                points: ["Composing melodies and arrangements", "Music production workflows", "Blending AI tools with creativity"],
              },
            ].map((role) => (
              <div key={role.title} className={`rounded-2xl border ${role.border} bg-gradient-to-br ${role.color} p-6`}>
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className={`font-bold text-lg text-white mb-2`}>{role.title}</h3>
                <p className="text-white/50 text-sm mb-4">{role.desc}</p>
                <ul className="space-y-1">
                  {role.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-white/60 text-xs">
                      <span className="text-[#00D4FF] mt-0.5">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Languages ── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Languages We Are Expanding In</h2>
          <p className="text-white/50 text-sm mb-8">Express In Music is building a multilingual creator network worldwide</p>
          <div className="flex flex-wrap justify-center gap-3">
            {languagesList.map((lang) => (
              <span key={lang} className="px-4 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium rounded-full">
                {lang}
              </span>
            ))}
            <span className="px-4 py-2 bg-white/5 border border-white/20 text-white/50 text-sm font-medium rounded-full">
              + More Regional Languages
            </span>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 pb-12 bg-white/[0.02] border-t border-b border-white/10 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">How the Creator Network Works</h2>
            <p className="text-white/50 text-sm mt-2">A simple process to join and start collaborating</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            {[
              { step: "1", icon: "📝", title: "Submit Application", desc: "Fill out the creator form below" },
              { step: "2", icon: "🔍", title: "Profile Review", desc: "Our team reviews your work samples" },
              { step: "3", icon: "✅", title: "Get Approved", desc: "Added to the creator network" },
              { step: "4", icon: "🎵", title: "Receive Projects", desc: "Matched to your language & style" },
              { step: "5", icon: "💰", title: "Get Paid", desc: "Payment on project completion" },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                {i < 4 && (
                  <div className="hidden sm:block absolute top-7 left-[60%] w-[80%] h-px bg-[#00D4FF]/20" />
                )}
                <div className="w-14 h-14 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-2xl mb-3 relative z-10">
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

      {/* ── Application Form ── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-4 py-1.5 rounded-full mb-3">
              Creator Application Form
            </span>
            <h2 className="text-3xl font-bold text-white">Apply to Join the Network</h2>
            <p className="text-white/50 text-sm mt-2">If you are ready to collaborate, submit your application today.</p>
          </div>

          {submitted ? (
            <div className="text-center bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-2xl p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
              <p className="text-white/60 mb-6">Thank you for applying to the Express In Music Creator Network. Our team will review your profile and reach out soon.</p>
              <Link to="/" className="inline-block bg-[#00D4FF] hover:bg-[#00b8d9] text-black font-bold px-8 py-3 rounded-full transition-all">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4 border-b border-white/10 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Full Name *</label>
                    <input required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Email Address *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Country *</label>
                    <input required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                      placeholder="Country" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">City / Region</label>
                    <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                      placeholder="City or region" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-white/60 text-xs mb-1 block">WhatsApp / Contact Number</label>
                    <input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                      placeholder="+91 xxxxx xxxxx" />
                  </div>
                </div>
              </div>

              {/* Creative Role */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4 border-b border-white/10 pb-2">Creative Role *</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Lyricist", "Vocal Artist", "Music Producer / Composer", "Multiple Roles"].map((r) => (
                    <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === r ? "border-[#00D4FF]/50 bg-[#00D4FF]/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
                      <input type="radio" name="role" value={r} required checked={formData.role === r} onChange={() => setFormData({ ...formData, role: r })} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.role === r ? "border-[#00D4FF]" : "border-white/30"}`}>
                        {formData.role === r && <div className="w-2 h-2 bg-[#00D4FF] rounded-full" />}
                      </div>
                      <span className="text-white/80 text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Languages You Work In *</h3>
                <p className="text-white/40 text-xs mb-3">List the languages in which you can write lyrics or perform vocals.</p>
                <input required value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20"
                  placeholder="e.g. Hindi, English, Bhojpuri" />
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Musical Genres</h3>
                <p className="text-white/40 text-xs mb-3">Select the styles you are comfortable working in.</p>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((genre) => (
                    <button type="button" key={genre} onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${formData.genres.includes(genre) ? "bg-purple-600 border-purple-500 text-white" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}>
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Portfolio / Work Samples</h3>
                <p className="text-white/40 text-xs mb-3">YouTube, SoundCloud, Google Drive, or portfolio website links.</p>
                <textarea value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20 resize-none"
                  placeholder="https://youtube.com/... or https://soundcloud.com/..." />
              </div>

              {/* Recording Setup */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Recording Setup (For Vocal Artists)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {["Home Recording Setup", "Professional Studio Access", "Basic Recording Equipment"].map((setup) => (
                    <label key={setup} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.recordingSetup === setup ? "border-[#00D4FF]/50 bg-[#00D4FF]/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
                      <input type="radio" name="setup" value={setup} checked={formData.recordingSetup === setup} onChange={() => setFormData({ ...formData, recordingSetup: setup })} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.recordingSetup === setup ? "border-[#00D4FF]" : "border-white/30"}`}>
                        {formData.recordingSetup === setup && <div className="w-2 h-2 bg-[#00D4FF] rounded-full" />}
                      </div>
                      <span className="text-white/80 text-xs">{setup}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience + Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Experience Level *</h3>
                  <div className="flex flex-col gap-2">
                    {["Beginner", "Intermediate", "Professional"].map((lvl) => (
                      <label key={lvl} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.experienceLevel === lvl ? "border-[#00D4FF]/50 bg-[#00D4FF]/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
                        <input type="radio" name="experience" required value={lvl} checked={formData.experienceLevel === lvl} onChange={() => setFormData({ ...formData, experienceLevel: lvl })} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.experienceLevel === lvl ? "border-[#00D4FF]" : "border-white/30"}`}>
                          {formData.experienceLevel === lvl && <div className="w-2 h-2 bg-[#00D4FF] rounded-full" />}
                        </div>
                        <span className="text-white/80 text-sm">{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Availability *</h3>
                  <div className="flex flex-col gap-2">
                    {["Occasional Projects", "Regular Work"].map((avail) => (
                      <label key={avail} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.availability === avail ? "border-[#00D4FF]/50 bg-[#00D4FF]/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
                        <input type="radio" name="availability" required value={avail} checked={formData.availability === avail} onChange={() => setFormData({ ...formData, availability: avail })} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.availability === avail ? "border-[#00D4FF]" : "border-white/30"}`}>
                          {formData.availability === avail && <div className="w-2 h-2 bg-[#00D4FF] rounded-full" />}
                        </div>
                        <span className="text-white/80 text-sm">{avail}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 border-b border-white/10 pb-2">Additional Information</h3>
                <p className="text-white/40 text-xs mb-3">Any additional details about your experience, creative background, or special skills.</p>
                <textarea value={formData.additionalInfo} onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/20 resize-none"
                  placeholder="Tell us more about yourself..." />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-60 text-black font-bold py-4 rounded-full text-base transition-all shadow-lg shadow-[#00D4FF]/30">
                {submitting ? "Submitting..." : "Apply to Join the Creator Network"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-12 bg-white/[0.02] border-t border-white/10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-white/50 text-sm mb-2">Connected to Visionary Voice Media Private Limited &amp; Vision Music distribution network</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Join the Global Creator Community
          </h2>
          <p className="text-white/60 text-sm mb-6">Become part of a growing platform where creators collaborate to produce music for audiences worldwide.</p>
          <p className="text-white/40 text-xs">Express In Music — We Say It For You</p>
        </div>
      </section>
    </div>
  );
}
