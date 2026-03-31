import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';

export default function PremiumLanding() {
  return (
    <div className="bg-[#0c0c0f] text-white">
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f2541] via-[#10121f] to-[#0c0c0f] opacity-90" />
        <div className="relative mx-auto max-w-6xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00D4FF]">Studio-produced music with human creative teams</p>
          <h1 className="text-3xl font-bold md:text-5xl">Professional Music Production For Every Story</h1>
          <p className="mx-auto max-w-3xl text-white/70 text-lg md:text-xl">
            Studio-quality music production for individuals, brands and institutions — created by professional composers,
            lyricists and producers.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/order"
              className="rounded-full bg-[#6C4DFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6C4DFF]/40"
            >
              Create Your Song
            </Link>
            <Link
              to="/samples"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Listen To Our Work
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Welcome To ExpressinMusic"
          title="ExpressinMusic is a modern music production platform"
          subtitle="Whether you want a personal dedication song, brand anthem, or campaign theme, our creative team turns your idea into a professional track."
        />
        <p className="mt-6 text-white/70 leading-relaxed">
          The platform combines advanced technology with human creativity to deliver high-quality music production with faster turnaround times.
        </p>
        <p className="mt-4 text-sm text-white/50">
          ExpressinMusic is developed as a digital music production platform by Visionary Voice Media Private Limited, a media and creative production company.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Professional Studio Environment" title="Studio Infrastructure" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <p className="text-white/70 leading-relaxed">
            Our music production workflow uses professional recording environments equipped with industry-grade audio equipment and digital production systems.
            Every song produced through ExpressinMusic passes through professional recording, mixing and mastering stages before delivery.
          </p>
          <ul className="space-y-2">
            {['Professional recording booths', 'High quality condenser microphones', 'Digital mixing consoles', 'Studio monitor speakers', 'Mastering systems'].map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Human Creativity Behind Every Song" title="Creative Team" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <p className="text-white/70 leading-relaxed">
            Every song created through ExpressinMusic is crafted by a team of creative professionals including lyricists, composers, vocalists and sound engineers.
            While technology helps streamline the process, creative direction and final quality control are always handled by experienced music professionals.
          </p>
          <ul className="space-y-2">
            {['Songwriters', 'Music composers', 'Vocal artists', 'Mixing engineers', 'Quality reviewers'].map((role) => (
              <li key={role} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{role}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16" id="services">
        <SectionHeading eyebrow="Music Production Services" title="Our Premium Services" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Personal Songs</h3>
            <p className="mt-2 text-white/70">Custom songs for personal moments and celebrations.</p>
            <ul className="mt-3 space-y-1 text-sm text-white/60">
              {['Birthday songs', 'Love dedication songs', 'Friendship songs', 'Inspirational songs'].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Business & Brand Music</h3>
            <p className="mt-2 text-white/70">Music designed for marketing and brand identity.</p>
            <ul className="mt-3 space-y-1 text-sm text-white/60">
              {['Brand anthem', 'Product launch song', 'Promotional jingles', 'Advertising music'].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Campaign & Institutional Songs</h3>
            <p className="mt-2 text-white/70">Music for organizations and public campaigns.</p>
            <ul className="mt-3 space-y-1 text-sm text-white/60">
              {['School anthem', 'Event theme song', 'NGO awareness music', 'Campaign songs'].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="How Your Song Is Produced" title="Our Production Process" />
        <ol className="mt-8 space-y-3 text-white/80">
          {[
            'Story Submission: The customer submits their story, message or idea.',
            'Lyrics Writing: Professional lyricists craft the song lyrics.',
            'Music Composition: Composers develop melody and arrangement.',
            'Studio Production: Vocals and music are recorded and produced.',
            'Mixing & Mastering: Sound engineers polish the final track.',
            'Quality Review: Creative team verifies the final production.',
            'Delivery: The finished song is delivered through the user dashboard.',
          ].map((step) => (
            <li key={step} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{step}</li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-white/60">Technology helps accelerate the workflow, but every song is finalized by real professionals.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Our Music Creations" title="Portfolio" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Birthday Surprise Song', category: 'Personal', duration: '3:05' },
            { title: 'Romantic Dedication Song', category: 'Personal', duration: '2:58' },
            { title: 'Brand Promotion Anthem', category: 'Business', duration: '3:20' },
            { title: 'Campaign Theme Song', category: 'Institution', duration: '3:45' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">{item.category}</p>
              <h4 className="mt-2 text-lg font-semibold">{item.title}</h4>
              <p className="mt-1 text-xs text-white/60">Duration: {item.duration}</p>
              <div className="mt-4 h-10 rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Publish Your Music Worldwide" title="Music Distribution" />
        <p className="mt-4 text-white/70 leading-relaxed">
          In addition to music production, ExpressinMusic provides support for distributing your songs to major streaming platforms. Artists and creators can publish songs globally and reach listeners worldwide.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-white/70">
          {['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'JioSaavn', 'Gaana'].map((platform) => (
            <li key={platform} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">{platform}</li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2 text-sm text-white/70">
          <p>Artist profile setup</p>
          <p>YouTube publishing</p>
          <p>Streaming distribution support</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="What Our Clients Say" title="Client Testimonials" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { quote: 'I ordered a custom birthday song and it turned out to be an incredible surprise gift. The production quality was amazing.', rating: '★★★★★' },
            { quote: 'Our company anthem produced through ExpressinMusic became the highlight of our annual event.', rating: '★★★★★' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80">"{item.quote}"</p>
              <p className="mt-3 text-xl font-semibold text-[#00D4FF]">{item.rating}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Why Choose ExpressinMusic" title="Why Choose ExpressinMusic" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { title: 'Professional Music Production', text: 'Songs produced with professional creative teams.' },
            { title: 'Studio Quality Sound', text: 'Professional mixing and mastering workflow.' },
            { title: 'Fast Production Timeline', text: 'Songs delivered within days instead of weeks.' },
            { title: 'End-to-End Music Services', text: 'Production, delivery and distribution support.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="rounded-[30px] border border-white/10 bg-gradient-to-r from-[#6C4DFF] via-[#FF3B81] to-[#00D4FF] p-10 text-center text-white">
          <h2 className="text-3xl font-semibold">Turn Your Idea Into A Professional Song</h2>
          <p className="mt-3 text-white/90">Create your custom song today with ExpressinMusic.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/order" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#111]">Create Your Song</Link>
            <Link to="/samples" className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold">Listen To Samples</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
