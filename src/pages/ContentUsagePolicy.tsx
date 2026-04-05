import { Link } from 'react-router-dom';

export default function ContentUsagePolicy() {
  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C4DFF]/20 via-transparent to-[#FF3B81]/10 pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-widest uppercase text-white/70 mb-4">
            Legal &amp; Policies
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">
            Content Usage Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Last updated: April 5, 2026 &nbsp;|&nbsp; Effective immediately
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-12">

        {/* Introduction */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Welcome to <strong className="text-white">ExpressinMusic</strong>, a digital music production platform developed and operated by <strong className="text-white">Visionary Voice Media Private Limited</strong>. These Content Usage Policy terms govern how music, audio files, lyrics, artwork, and all other creative content (collectively, "Content") created through or delivered by our platform may be used, shared, reproduced, or distributed.
          </p>
          <p className="text-white/70 leading-relaxed">
            By placing an order, downloading a file, or accessing any Content on ExpressinMusic, you agree to be bound by this Content Usage Policy in full. If you do not agree, please do not use or access our Content.
          </p>
        </section>

        {/* Ownership & Rights */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Ownership &amp; Intellectual Property Rights</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            All Content created by ExpressinMusic's team of songwriters, composers, vocalists, and producers is the intellectual property of Visionary Voice Media Private Limited, unless explicitly transferred to the customer through a written licensing agreement.
          </p>
          <ul className="space-y-3 mt-4">
            {[
              'All musical compositions, sound recordings, lyrics, and arrangements created on our platform are protected by applicable copyright laws.',
              'ExpressinMusic retains all master rights and publishing rights unless a full buyout or exclusive license is purchased.',
              'Artwork, logos, brand identity materials, and visual assets provided as part of any package remain the property of ExpressinMusic.',
              'Customers receive a limited, non-exclusive, non-transferable license to use the delivered Content as specified in their purchased package.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#6C4DFF]/30 flex items-center justify-center text-xs text-[#6C4DFF] font-bold">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Permitted Uses */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">3. Permitted Uses</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Subject to the terms of your purchased package, you are permitted to use the delivered Content for the following purposes:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Personal Use', desc: 'Play, share, and enjoy the song for personal, non-commercial purposes such as gifts, celebrations, or personal milestones.' },
              { title: 'Social Media Sharing', desc: 'Post and share the track on personal social media profiles (Instagram, Facebook, TikTok, YouTube, etc.) with appropriate credit to ExpressinMusic.' },
              { title: 'Brand & Business (Business Package)', desc: 'Use the Content in advertisements, marketing campaigns, product promotions, and branded content when a Business Package is purchased.' },
              { title: 'Institutional & Campaign (Institution Package)', desc: 'School anthems, college songs, political campaigns, and NGO tracks are permitted for institutional and public-interest use.' },
              { title: 'Streaming Platforms', desc: 'Distribute and monetise the track on streaming platforms (Spotify, Apple Music, etc.) only when a full buyout or exclusive license has been purchased.' },
              { title: 'Live Performance', desc: 'Perform the song live at events, concerts, and ceremonies for personal or institutional use, subject to applicable performing-rights rules.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6C4DFF] inline-block" />
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Uses */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Prohibited Uses</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            The following uses of ExpressinMusic Content are strictly prohibited without prior written consent from Visionary Voice Media Private Limited:
          </p>
          <ul className="space-y-3">
            {[
              'Reselling, sublicensing, or redistributing the Content to third parties.',
              'Claiming authorship or original ownership of any Content created by ExpressinMusic.',
              'Using the Content in a manner that infringes upon the rights of any third party.',
              'Reproducing, modifying, or creating derivative works without an appropriate license upgrade.',
              'Using Content in connection with illegal, defamatory, hateful, or otherwise harmful material.',
              'Registering the Content with any copyright office, music royalty body, or licensing platform without our explicit written permission.',
              'Synchronisation (sync) licensing of Content for TV, film, or video games without purchasing the appropriate sync license.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 flex-shrink-0 text-[#FF3B81]">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* License Tiers */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">5. License Tiers &amp; Packages</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            ExpressinMusic offers three core service packages, each carrying a different scope of content usage rights:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4 text-white font-semibold">Feature</th>
                  <th className="py-3 pr-4 text-white font-semibold">Personal<br/><span className="text-white/50 font-normal">₹11,000</span></th>
                  <th className="py-3 pr-4 text-white font-semibold">Business<br/><span className="text-white/50 font-normal">₹15,000</span></th>
                  <th className="py-3 text-white font-semibold">Institution<br/><span className="text-white/50 font-normal">₹21,000</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['Personal / Gift Use', '✓', '✓', '✓'],
                  ['Social Media Sharing', '✓', '✓', '✓'],
                  ['Commercial Advertising', '✗', '✓', '✓'],
                  ['Brand / Campaign Use', '✗', '✓', '✓'],
                  ['Institutional Anthem', '✗', '✗', '✓'],
                  ['Streaming Monetisation', 'Add-on', 'Add-on', 'Add-on'],
                  ['Full Buyout / Exclusive', 'Add-on', 'Add-on', 'Add-on'],
                ].map(([feature, personal, business, institution]) => (
                  <tr key={feature} className="text-white/60">
                    <td className="py-3 pr-4 text-white/80">{feature}</td>
                    <td className="py-3 pr-4">{personal === '✓' ? <span className="text-green-400">✓</span> : personal === '✗' ? <span className="text-red-400">✗</span> : <span className="text-yellow-400">{personal}</span>}</td>
                    <td className="py-3 pr-4">{business === '✓' ? <span className="text-green-400">✓</span> : business === '✗' ? <span className="text-red-400">✗</span> : <span className="text-yellow-400">{business}</span>}</td>
                    <td className="py-3">{institution === '✓' ? <span className="text-green-400">✓</span> : institution === '✗' ? <span className="text-red-400">✗</span> : <span className="text-yellow-400">{institution}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User-Generated Content */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">6. User-Submitted Content</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            When you submit briefs, stories, lyrics ideas, reference tracks, voice recordings, or any other materials to ExpressinMusic for the purpose of creating your custom song, you grant us a limited, royalty-free license to use that material solely for completing your order.
          </p>
          <p className="text-white/70 leading-relaxed">
            ExpressinMusic will never sell, publish, or use your submitted personal stories or materials for any purpose other than creating your custom song without your explicit written consent. All submitted materials are treated as confidential.
          </p>
        </section>

        {/* AI & Technology */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">7. AI-Assisted &amp; Human Creation</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            ExpressinMusic combines advanced AI technology with human songwriters, composers, and producers. Our final deliverables are always reviewed, refined, and approved by qualified music professionals before delivery.
          </p>
          <p className="text-white/70 leading-relaxed">
            The use of AI tools in our production process does not diminish the quality, originality, or commercial viability of the delivered Content. All Content undergoes a quality assurance review before delivery to the customer.
          </p>
        </section>

        {/* Delivery & Revisions */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">8. Delivery, Revisions &amp; Turnaround</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Delivered Content is provided in high-quality audio formats (MP3 and WAV) via your dashboard. You may download your files at any time after delivery is confirmed.
          </p>
          <ul className="space-y-2 text-white/70 mt-4">
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Standard turnaround is based on the package selected and the delivery hours specified at the time of order.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Minor revision requests (lyrical adjustments, tone changes) are included as per your package terms.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Major structural changes or full re-records may incur additional charges.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> ExpressinMusic reserves the right to decline revision requests that alter the fundamental nature of the original brief.</li>
          </ul>
        </section>

        {/* Refund & Cancellation */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">9. Refund &amp; Cancellation Policy</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Due to the highly personalised and custom nature of our music production services, all payments are non-refundable once production has commenced.
          </p>
          <ul className="space-y-2 text-white/70 mt-4">
            <li className="flex items-start gap-2"><span className="text-[#FF3B81] mt-1">→</span> Cancellations requested before production begins may be eligible for a partial refund, less any processing fees.</li>
            <li className="flex items-start gap-2"><span className="text-[#FF3B81] mt-1">→</span> Once a final delivery is accepted or downloaded, no refunds will be issued.</li>
            <li className="flex items-start gap-2"><span className="text-[#FF3B81] mt-1">→</span> In the unlikely event of a technical failure or inability to deliver, a full refund will be issued at our discretion.</li>
          </ul>
        </section>

        {/* Privacy & Data */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">10. Privacy &amp; Data Usage</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Your personal information, order details, and submitted content are handled in accordance with our Privacy Policy. We do not sell or share personal data with third parties for marketing purposes.
          </p>
          <p className="text-white/70 leading-relaxed">
            Any anonymised, non-identifiable data may be used to improve our platform's AI capabilities and service quality. You may request deletion of your personal data at any time by contacting our support team.
          </p>
        </section>

        {/* DMCA & Takedowns */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">11. Copyright Infringement &amp; DMCA</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            ExpressinMusic respects intellectual property rights. If you believe that Content on our platform infringes upon your copyright, please submit a written notice to our support team with the following information:
          </p>
          <ul className="space-y-2 text-white/70 mt-4">
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Identification of the copyrighted work you believe has been infringed.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Identification of the infringing material and its location on our platform.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> Your contact information including name, address, and email.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> A statement that you have a good-faith belief that the use is not authorised.</li>
            <li className="flex items-start gap-2"><span className="text-[#6C4DFF] mt-1">→</span> A statement, under penalty of perjury, that the information in your notice is accurate.</li>
          </ul>
        </section>

        {/* Governing Law */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">12. Governing Law &amp; Jurisdiction</h2>
          <p className="text-white/70 leading-relaxed">
            This Content Usage Policy is governed by the laws of India. Any disputes arising out of or in connection with this policy shall be subject to the exclusive jurisdiction of the courts of India. Visionary Voice Media Private Limited reserves all rights not expressly granted in this policy.
          </p>
        </section>

        {/* Amendments */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">13. Amendments to This Policy</h2>
          <p className="text-white/70 leading-relaxed">
            ExpressinMusic reserves the right to update or modify this Content Usage Policy at any time. Changes will be effective immediately upon posting to this page. Continued use of our platform and Content after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this page periodically.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF3B81]/20 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">14. Contact Us</h2>
          <p className="text-white/70 mb-6">
            For any questions, licensing inquiries, or concerns regarding this Content Usage Policy, please reach out to us:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Company</p>
              <p className="text-white font-semibold">Visionary Voice Media Private Limited</p>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Platform</p>
              <p className="text-white font-semibold">ExpressinMusic</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
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
