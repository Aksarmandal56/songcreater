import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Last Updated: [Insert Date]
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-8">

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-white/70 leading-relaxed mb-3">
            Welcome to <strong className="text-white">Express In Music</strong>, a music creation platform operated by <strong className="text-white">Visionary Voice Media Private Limited</strong>.
          </p>
          <p className="text-white/70 leading-relaxed">
            By accessing or using the Express In Music website and services, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree with these terms, please refrain from using our services.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Services Provided</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Express In Music provides music creation services that transform user-submitted ideas, stories, or messages into professionally produced songs. The platform offers services for:
          </p>
          <ul className="space-y-2 mb-4">
            {['Individual users', 'Businesses and brands', 'Institutions and campaign organizations'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/70 leading-relaxed">
            Delivery timelines depend on the selected service package.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Orders and Payments</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            All orders placed on Express In Music require <strong className="text-white">100% advance payment</strong> before the production process begins. Once payment is confirmed, the production workflow is initiated.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">Delivery timelines are as follows:</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { plan: 'Individual Plan', time: 'Within 24 Hours' },
              { plan: 'Business Plan', time: 'Within 72 Hours' },
              { plan: 'Institution Plan', time: 'Within 160 Hours' },
            ].map((item) => (
              <div key={item.plan} className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <p className="text-white font-semibold mb-1">{item.plan}</p>
                <p className="text-[#6C4DFF] font-bold">{item.time}</p>
              </div>
            ))}
          </div>
          <p className="text-white/70 leading-relaxed mt-4">
            Delivery is provided through the user dashboard and/or registered email address.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">3. User Responsibilities</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Users must ensure that the information they submit is accurate and lawful. Users must not submit content that includes:
          </p>
          <ul className="space-y-3">
            {[
              'Copyright violations',
              'Hate speech',
              'Illegal or harmful content',
              'Defamatory or abusive material',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 flex-shrink-0 text-[#FF3B81]">✕</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/70 leading-relaxed mt-4">
            Express In Music reserves the right to reject or cancel projects that violate these guidelines.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Intellectual Property</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Ownership and usage rights of the produced music depend on the service package selected by the user. Certain packages may include limited or conditional usage rights, while premium packages may include broader commercial rights.
          </p>
          <p className="text-white/70 leading-relaxed">
            Express In Music reserves the right to use created works for promotional purposes unless otherwise agreed in writing.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Service Modifications</h2>
          <p className="text-white/70 leading-relaxed">
            Express In Music reserves the right to modify, update, or discontinue services without prior notice when necessary.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">6. Limitation of Liability</h2>
          <p className="text-white/70 leading-relaxed">
            Express In Music and its parent company Visionary Voice Media Private Limited shall not be held liable for any indirect damages arising from the use of the platform or services.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">7. Governing Law</h2>
          <p className="text-white/70 leading-relaxed">
            These Terms &amp; Conditions are governed by the applicable laws of the jurisdiction in which Visionary Voice Media Private Limited operates.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF3B81]/20 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">Contact Us</h2>
          <p className="text-white/70 mb-6">
            For any questions regarding these Terms &amp; Conditions, please reach out to us.
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
