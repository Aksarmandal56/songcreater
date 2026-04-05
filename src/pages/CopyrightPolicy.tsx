import { Link } from 'react-router-dom';

export default function CopyrightPolicy() {
  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C4DFF]/20 via-transparent to-[#FF3B81]/10 pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-widest uppercase text-white/70 mb-4">
            Legal &amp; Policies
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">
            Copyright &amp; Ownership Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Express In Music — Ownership &amp; Usage Rights
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-8">

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-white/70 leading-relaxed">
            <strong className="text-white">Express In Music</strong> creates customized music content based on the requirements provided by the user. Ownership and usage rights vary depending on the selected package.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Package Ownership Rights</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Individual Package',
                color: '#6C4DFF',
                desc: 'Users receive conditional usage rights for personal use. Commercial distribution or monetization may require additional licensing or service upgrades.',
              },
              {
                title: 'Business Package',
                color: '#FF3B81',
                desc: 'Businesses receive rights to use the music for branding, promotional campaigns, and marketing activities.',
              },
              {
                title: 'Institution Package',
                color: '#00C2FF',
                desc: 'Institutions and organizations receive rights to use the music for campaigns, movements, and public messaging.',
              },
            ].map((pkg) => (
              <div key={pkg.title} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pkg.color }} />
                  <span className="text-white">{pkg.title}</span>
                </h3>
                <p className="text-white/70 leading-relaxed pl-6">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Distribution and Monetization</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Creators who wish to distribute their music globally may use the <strong className="text-white">Vision Music</strong> distribution network connected to Express In Music.
          </p>
          <p className="text-white/70 leading-relaxed mb-6">Through Vision Music, creators can:</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Global Distribution', desc: 'Distribute music to digital streaming platforms worldwide' },
              { title: 'Analytics', desc: 'Track performance analytics across all platforms' },
              { title: 'Monetization', desc: 'Monetize their music globally and earn royalties' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-[#6C4DFF]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#6C4DFF] text-lg">→</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF3B81]/20 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">Questions About Ownership?</h2>
          <p className="text-white/70 mb-6">
            For licensing inquiries or questions about ownership rights, please contact our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Company</p>
              <p className="text-white font-semibold">Visionary Voice Media Private Limited</p>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Email</p>
              <p className="text-white font-semibold">contact.expressinmusic@visionaryvoice.in</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/order"
              className="rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
            >
              Create Your Song
            </Link>
            <Link
              to="/"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
