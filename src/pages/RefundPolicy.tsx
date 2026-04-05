import { Link } from 'react-router-dom';

export default function RefundPolicy() {
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
            Refund Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Express In Music — Customized Music Services
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-8">

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-white/70 leading-relaxed">
            Due to the customized and creative nature of the services offered by <strong className="text-white">Express In Music</strong>, all projects involve significant creative effort and production work. Therefore, the following refund policy applies.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Advance Payments</h2>
          <p className="text-white/70 leading-relaxed">
            All services require <strong className="text-white">100% advance payment</strong> before production begins. Once the production process has started, payments are generally non-refundable.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Exceptions</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Refunds may be considered only under the following circumstances:
          </p>
          <ul className="space-y-4">
            {[
              'If Express In Music fails to deliver the project within the promised timeline without valid reason.',
              'If the project cannot be completed due to internal production limitations.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6C4DFF]/30 flex items-center justify-center text-xs text-[#6C4DFF] font-bold mt-0.5">{i + 1}</span>
                <span className="text-white/70">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-white/60 text-sm mt-4 italic">
            Refund decisions will be evaluated on a case-by-case basis.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">3. Revisions</h2>
          <p className="text-white/70 leading-relaxed">
            Instead of refunds, Express In Music may offer <strong className="text-white">reasonable revisions</strong> where applicable to ensure customer satisfaction.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF3B81]/20 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">Questions?</h2>
          <p className="text-white/70 mb-6">
            If you have any questions about our refund policy, please reach out to our support team.
          </p>
          <div className="bg-white/10 rounded-xl px-6 py-4 inline-block mb-6">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Email</p>
            <p className="text-white font-semibold">contact.expressinmusic@visionaryvoice.in</p>
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
