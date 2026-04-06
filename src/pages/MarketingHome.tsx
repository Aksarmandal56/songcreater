import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJson, SERVER_BASE_URL } from '../lib/api';
import PricingCard from '../components/PricingCard';
import AudioPlayerCard from '../components/AudioPlayerCard';
import TestimonialCard from '../components/TestimonialCard';
import SectionHeading from '../components/SectionHeading';
import BannerSlider from '../components/BannerSlider';

interface Package {
  _id: string;
  name: string;
  price: number;
  delivery_hours: number;
  description: string;
  category: string;
}

interface Sample {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  audio_url: string;
}

interface Testimonial {
  _id: string;
  name: string;
  quote: string;
  rating: number;
  photo_url: string;
}

interface Logo {
  id: number;
  name: string;
  logo_url: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ApiBanner {
  _id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

export default function MarketingHome() {
  const [packages, setPackages] = useState<Package[]>([
    {
      _id: '1',
      name: 'Personal Song',
      price: 3999,
      delivery_hours: 24,
      description: 'Perfect for birthdays, love songs, friendship, and motivation.',
      category: 'Personal'
    },
    {
      _id: '2',
      name: 'Small Business Song',
      price: 9100,
      delivery_hours: 72,
      description: 'Brand anthems, product songs, and promotional tracks.',
      category: 'Business'
    },
    {
      _id: '3',
      name: 'Institution Song',
      price: 21000,
      delivery_hours: 160,
      description: 'School anthems, college songs, political campaigns, and NGO tracks.',
      category: 'Institution'
    }
  ]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [steps] = useState<Step[]>([
    { id: 1, title: 'Tell Your Story', description: 'Share your message, occasion, and preferences through our simple form.' },
    { id: 2, title: 'AI + Human Creation', description: 'Our songwriters and composers craft your personalized track.' },
    { id: 3, title: 'Studio Delivery', description: 'Receive your professional recording ready for sharing and streaming.' }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load packages
        const packagesData = await fetchJson('/packages') as Package[];
        setPackages(packagesData);

        // Load samples
        const samplesData = await fetchJson('/samples') as Sample[];
        setSamples(samplesData);

        // Load testimonials
        const testimonialsData = await fetchJson('/testimonials') as Testimonial[];
        setTestimonials(testimonialsData);

        // Load logos (placeholder for now)
        setLogos([]);

        // Load banners
        const bannersData = await fetchJson('/banners') as ApiBanner[];
        setBanners(bannersData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data if API fails
        setPackages([
          {
            _id: '1',
            name: 'Personal Song',
            price: 3999,
            delivery_hours: 24,
            description: 'Perfect for birthdays, love songs, friendship, and motivation.',
            category: 'Personal'
          },
          {
            _id: '2',
            name: 'Small Business Song',
            price: 9100,
            delivery_hours: 72,
            description: 'Brand anthems, product songs, and promotional tracks.',
            category: 'Business'
          },
          {
            _id: '3',
            name: 'Institution Song',
            price: 21000,
            delivery_hours: 160,
            description: 'School anthems, college songs, political campaigns, and NGO tracks.',
            category: 'Institution'
          }
        ]);
        setSamples([]);
        setTestimonials([]);
        setLogos([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="px-6 py-20 text-center text-white">Loading marketing content...</div>;
  }

  const sampleData = samples.length > 0 ? samples : [
    { _id: '1', title: 'Birthday Surprise Song', genre: 'Pop', duration: '3:05', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { _id: '2', title: 'Brand Anthem Track', genre: 'Corporate', duration: '3:40', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { _id: '3', title: 'Love Dedication Ballad', genre: 'Romantic', duration: '3:20', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { _id: '4', title: 'Motivational Startup Jingle', genre: 'Corporate', duration: '2:58', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { _id: '5', title: 'College Anthem', genre: 'Institutional', duration: '3:15', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { _id: '6', title: 'Festival Celebration Song', genre: 'Pop', duration: '3:10', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { _id: '7', title: 'Product Launch Theme', genre: 'Corporate', duration: '3:00', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { _id: '8', title: 'NGO Awareness Track', genre: 'Institutional', duration: '3:25', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { _id: '9', title: 'Friendship Tribute Song', genre: 'Pop', duration: '3:02', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { _id: '10', title: 'Campaign Success Anthem', genre: 'Institutional', duration: '3:30', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  ];

  const testimonialData = testimonials.length > 0 ? testimonials : [
    { _id: '1', name: 'Aarav S.', quote: 'The birthday track was magical—studio quality and fast delivery.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Aarav+S&background=6C4DFF&color=fff&size=96' },
    { _id: '2', name: 'Priya M.', quote: 'Our brand anthem exceeded expectations, and the whole team loved it.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Priya+M&background=FF3B81&color=fff&size=96' },
    { _id: '3', name: 'Rohit T.', quote: 'The corporate jingle gave our campaign serious momentum.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Rohit+T&background=00D4FF&color=fff&size=96' },
    { _id: '4', name: 'Sneha K.', quote: 'High-quality production and fast turnaround—exactly what we needed.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Sneha+K&background=FF6B35&color=fff&size=96' },
    { _id: '5', name: 'Neha P.', quote: 'I love the personalized storytelling in my custom song.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Neha+P&background=7B2FF7&color=fff&size=96' },
    { _id: '6', name: 'Vikram D.', quote: 'From brief to final delivery, the professionalism was great.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Vikram+D&background=00BFA5&color=fff&size=96' },
    { _id: '7', name: 'Meera L.', quote: 'Studio sound is crisp and modern—perfect for social sharing.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Meera+L&background=E91E63&color=fff&size=96' },
    { _id: '8', name: 'Aditya G.', quote: 'The campaign theme they made boosted our event turnout significantly.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Aditya+G&background=FF9800&color=fff&size=96' },
    { _id: '9', name: 'Kavya R.', quote: 'Amazing singer selection and/mixing—phenomenal results.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Kavya+R&background=4CAF50&color=fff&size=96' },
    { _id: '10', name: 'Sahil J.', quote: 'I recommend ExpressinMusic for every brand music need.', rating: 5, photo_url: 'https://ui-avatars.com/api/?name=Sahil+J&background=2196F3&color=fff&size=96' },
  ];

  const logoData = logos.length > 0 ? logos : [
    { id: 1, name: 'DreamCorp', logo_url: '' },
    { id: 2, name: 'BrightMedia', logo_url: '' },
  ];

  return (
    <div className="bg-[#0c0c0f] text-white">
      {/* Banner Section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <BannerSlider
          banners={banners.map(b => ({
            id: b._id,
            src: `${SERVER_BASE_URL}${b.imageUrl}`,
            alt: b.altText || 'Banner',
          }))}
          autoPlay={true}
          autoPlayInterval={4000}
        />
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:flex-row">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">Music meets storytelling</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Turn Your Story Into a Song</h1>
          <p className="mt-4 text-white/70">
            Create a personalized song for birthdays, love, brands, campaigns, and every moment in between.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/order" className="rounded-full bg-[#6C4DFF] px-5 py-3 text-sm font-semibold">Create Your Song</Link>
            <Link to="/samples" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Listen to Samples</Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#24123f] via-[#111111] to-[#0c0c0f] p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6C4DFF]/40 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#FF3B81]/40 blur-3xl"></div>
            <div className="relative">
              <p className="text-sm text-white/60">Singer + music production visual</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Vocalist</p>
                  <p className="text-xs text-white/60">Studio-grade recording</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Composer</p>
                  <p className="text-xs text-white/60">AI + human craft</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Mixing</p>
                  <p className="text-xs text-white/60">Radio ready output</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Delivery</p>
                  <p className="text-xs text-white/60">Shareable tracks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="How it works"
          title="From story to finished song"
          subtitle="A simple three-step flow handled by AI, songwriters, and producers."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-semibold">{step.title}</p>
              <p className="mt-3 text-sm text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Song categories"
          title="Choose the perfect package"
          subtitle="Personal, business, and campaign tracks crafted by professional musicians."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((item, index) => (
            <PricingCard
              key={item._id}
              name={item.name}
              price={item.price}
              deliveryHours={item.delivery_hours}
              description={item.description}
              buttonLabel={`Create ${item.category} Song`}
              accent={index === 1}
              linkTo="/category"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Sample songs"
          title="Listen to recent creations"
          subtitle="Audio previews across genres and storytelling styles."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {sampleData.map((sample) => (
            <AudioPlayerCard
              key={sample._id}
              title={sample.title}
              genre={sample.genre}
              duration={sample.duration}
              audioUrl={sample.audio_url}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Testimonials"
          title="Stories from our customers"
          subtitle="Video testimonials from birthday surprises, startups, and creators."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonialData.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id}
              name={testimonial.name}
              quote={testimonial.quote}
              rating={testimonial.rating}
              photoUrl={testimonial.photo_url}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Trusted by"
          title="Schools, companies, and creators"
          subtitle="We partner with teams of all sizes to craft memorable audio experiences."
        />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {logoData.map((logo) => (
            <div key={logo.id} className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
              {logo.logo_url ? (
                <img src={logo.logo_url} alt={logo.name} className="h-10 object-contain" />
              ) : (
                <span className="text-sm text-white/70">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-[#6C4DFF] via-[#FF3B81] to-[#00D4FF] p-10 text-white">
          <h3 className="text-3xl font-semibold">Your Story Deserves Its Own Song</h3>
          <p className="mt-3 text-white/90">Start your custom song journey today with our dedicated producers.</p>
          <Link to="/order" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111]">
            Create Your Song Now
          </Link>
        </div>
      </section>
    </div>
  );
}
