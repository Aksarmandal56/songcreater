import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Last Updated: 04-04-2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-8">

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-white/70 leading-relaxed mb-3">
            At <strong className="text-white">Express In Music</strong>, we respect your privacy and are committed to protecting the personal information of our users, creators, and visitors. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform, website, and related services.
          </p>
          <p className="text-white/70 leading-relaxed">
            Express In Music is a product operated by <strong className="text-white">Visionary Voice Media Private Limited</strong>, and this policy applies to all services provided through the Express In Music platform.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Information We Collect</h2>

          <h3 className="text-lg font-semibold text-white/90 mb-3">Personal Information</h3>
          <p className="text-white/70 leading-relaxed mb-3">
            We may collect personal information that you voluntarily provide when using our platform, such as:
          </p>
          <ul className="space-y-2 mb-6">
            {['Name', 'Email address', 'Phone number', 'Country and location', 'Payment details', 'Account login credentials'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-white/90 mb-3">Project Information</h3>
          <p className="text-white/70 leading-relaxed mb-3">
            When you request a song creation service, we may collect information related to your project, including:
          </p>
          <ul className="space-y-2 mb-6">
            {['Song concept or story', 'Lyrics or written content', 'Language preferences', 'Music style and references', 'Audio samples or files submitted by you'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-white/90 mb-3">Creator Information</h3>
          <p className="text-white/70 leading-relaxed mb-3">
            If you apply to join the Express In Music creator network, we may collect additional information such as:
          </p>
          <ul className="space-y-2 mb-6">
            {['Portfolio links', 'Work samples', 'Professional experience', 'Recording setup details'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-white/90 mb-3">Technical Information</h3>
          <p className="text-white/70 leading-relaxed mb-3">
            When you access our website, certain technical data may automatically be collected, including:
          </p>
          <ul className="space-y-2">
            {['IP address', 'Browser type', 'Device information', 'Website usage data', 'Cookies and analytics data'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">How We Use Your Information</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            The information collected may be used for the following purposes:
          </p>
          <ul className="space-y-3">
            {[
              'To provide and manage song creation services',
              'To process orders and deliver audio content',
              'To communicate with users regarding their projects',
              'To improve the functionality of our platform',
              'To manage creator collaborations and assignments',
              'To send service updates or important notifications',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 flex-shrink-0 text-[#6C4DFF]">→</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/70 leading-relaxed mt-4">
            We do not sell personal information to third parties.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Payment and Transaction Security</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            All payments made on Express In Music are processed through secure third-party payment gateways. Express In Music does not store complete credit card or banking information on its servers. Payment details are handled securely by the payment service provider.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Music Content and Intellectual Property</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Any content submitted by users, including text, ideas, or lyrics, is used solely for the purpose of producing the requested music project. Express In Music may store project data temporarily to complete production, delivery, and quality management processes. Ownership and usage rights of the produced music may vary depending on the selected service package and agreed terms.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Data Protection</h2>
          <p className="text-white/70 leading-relaxed">
            We implement reasonable technical and administrative safeguards to protect user data from unauthorized access, misuse, or disclosure. However, while we strive to protect your information, no internet transmission or digital storage system can be guaranteed to be completely secure.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Third-Party Services</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Express In Music may integrate with third-party platforms such as:
          </p>
          <ul className="space-y-2">
            {['Payment gateways', 'Music distribution platforms', 'Analytics services', 'Communication tools'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B81] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/70 leading-relaxed mt-4">
            These services may have their own privacy policies governing how they use your data.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Creator Network and Vision Music</h2>
          <p className="text-white/70 leading-relaxed">
            Express In Music works closely with the Vision Music distribution ecosystem, which helps creators distribute and monetize their music across various digital platforms. When creators choose to distribute their content through Vision Music, certain information related to their releases may be shared with distribution partners for publishing and monetization purposes.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Cookies and Tracking</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Our website may use cookies and similar technologies to:
          </p>
          <ul className="space-y-2">
            {['Improve user experience', 'Analyze platform usage', 'Remember user preferences'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C4DFF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/70 leading-relaxed mt-4">
            Users can manage cookie settings through their browser preferences.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Changes to This Privacy Policy</h2>
          <p className="text-white/70 leading-relaxed">
            Express In Music reserves the right to update this Privacy Policy when necessary to reflect changes in services, technology, or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF3B81]/20 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">Contact Us</h2>
          <p className="text-white/70 mb-6">
            If you have any questions regarding this Privacy Policy or how your information is handled, please contact us.
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
