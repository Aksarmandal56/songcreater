import { useState } from "react";
import { Link } from "react-router-dom";

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  id: string;
  icon: string;
  title: string;
  faqs: FAQ[];
}

const categories: Category[] = [
  {
    id: "general",
    icon: "🎵",
    title: "About Express In Music",
    faqs: [
      {
        q: "What is Express In Music?",
        a: "Express In Music is a creative music platform that transforms your ideas, emotions, stories, or messages into professionally produced songs. Whether you want to create a personal dedication song, a brand anthem, or a campaign song, our system helps you turn your words into music quickly and easily. You simply describe your idea, and our creative team produces a complete song based on your input.",
      },
      {
        q: "Who can use Express In Music?",
        a: "Express In Music is designed for three main types of users:\n\n• Individuals – People who want to dedicate songs to loved ones, celebrate special moments, or express emotions through music.\n\n• Businesses and Brands – Companies that want custom songs for promotions, brand identity, marketing campaigns, or social media engagement.\n\n• Institutions and Organizations – NGOs, government organizations, and political campaigns that need anthem-style songs or campaign music.",
      },
      {
        q: "Is Express In Music available globally?",
        a: "Yes. Express In Music is designed as a global platform that supports creators and clients from different countries and languages. Our goal is to make music creation accessible worldwide.",
      },
      {
        q: "Who operates Express In Music?",
        a: "Express In Music is a product developed and operated by Visionary Voice Media Private Limited, a media and technology company focused on building innovative platforms for music, creators, and digital content ecosystems.",
      },
      {
        q: "Is Express In Music only for entertainment songs?",
        a: "No. Express In Music focuses on communication through music. Songs can be created for personal expression, marketing and branding, campaign communication, social awareness, and storytelling. Music can be a powerful communication medium, and our platform is designed to support this.",
      },
      {
        q: "What is the long-term vision of Express In Music?",
        a: "Our long-term vision is to build a global music communication platform where anyone can transform their message into music. By combining technology, creativity, and distribution networks, Express In Music aims to make music creation accessible to people everywhere.",
      },
    ],
  },
  {
    id: "process",
    icon: "⚙️",
    title: "How It Works",
    faqs: [
      {
        q: "How does the song creation process work?",
        a: "The process is simple and structured:\n\n1. Choose a service package on the website.\n2. Fill out the song request form with details about your idea or message.\n3. Complete the payment to confirm your order.\n4. Our creative team writes lyrics and produces the music.\n5. The final audio is delivered to your dashboard and registered email.\n\nThis streamlined process ensures fast turnaround times.",
      },
      {
        q: "What information do I need to provide to create a song?",
        a: "You will need to provide some basic information to help our creative team understand your idea. This may include:\n\n• The purpose of the song\n• The story or message you want to express\n• Preferred language\n• Music style or mood\n• Any reference songs (optional)\n\nThe more details you provide, the better we can craft the song according to your vision.",
      },
      {
        q: "How will I receive my completed song?",
        a: "Once your song is ready, it will be delivered through your Express In Music dashboard and your registered email address. You will receive a downloadable audio file.",
      },
      {
        q: "How to start creating my song?",
        a: "Getting started is simple:\n\n1. Visit the song creation page.\n2. Choose the service package that fits your needs.\n3. Fill out the project details form.\n4. Complete the payment to confirm your order.\n\nOnce your order is confirmed, our team will begin working on your project.",
      },
    ],
  },
  {
    id: "songs",
    icon: "🎤",
    title: "Songs, Languages & Styles",
    faqs: [
      {
        q: "What kind of songs can be created?",
        a: "Express In Music can produce songs for many purposes such as:\n\n• Personal dedication songs\n• Birthday or celebration songs\n• Brand anthems\n• Promotional songs\n• Campaign songs\n• Awareness songs\n• Event songs\n\nThe platform is designed to transform almost any message into music.",
      },
      {
        q: "In which languages can songs be created?",
        a: "Express In Music supports multiple languages through our global network of lyricists and vocal artists. Common languages include Hindi, Bhojpuri, English, Spanish, French, Punjabi, Bengali, Tamil, Telugu, and Arabic. Our creator network continues to expand to support more languages worldwide.",
      },
      {
        q: "Can I request a specific music style?",
        a: "Yes. You can choose the style or mood you prefer. Some popular styles include Romantic, Folk, Pop, Rap, Devotional, Motivational, and Campaign anthem. Our production team will craft the music to match your selected style.",
      },
      {
        q: "Will I receive the full song or just a sample?",
        a: "Depending on the package selected, you may receive sample versions first or a completed audio track. Some packages allow you to review sample versions before finalizing the song. Once finalized, the complete audio will be delivered to you.",
      },
      {
        q: "Can I request songs in different languages?",
        a: "Yes. Express In Music is building a global network of lyricists and vocal artists capable of working in multiple languages. Depending on creator availability, songs can be produced in various regional and international languages.",
      },
    ],
  },
  {
    id: "delivery",
    icon: "⏱️",
    title: "Pricing & Delivery",
    faqs: [
      {
        q: "How long does it take to receive my song?",
        a: "Delivery timelines depend on the package you choose:\n\n• Individual Plan – Delivered within 24 hours\n• Business Plan – Delivered within 72 hours\n• Institution Plan – Delivered within 160 hours\n\nOur team works efficiently to deliver your project within the promised timeline.",
      },
      {
        q: "Is payment required before the project starts?",
        a: "Yes. All orders require 100% advance payment before production begins. This ensures that our creative team can start working on your project immediately.",
      },
      {
        q: "Can I cancel my order?",
        a: "Due to the customized nature of music production, orders generally cannot be canceled once the production process has started. Please review your details carefully before confirming your order.",
      },
      {
        q: "Can I request revisions to my song?",
        a: "In some cases, limited revisions may be available depending on the package selected. Providing detailed information during the order process helps minimize the need for revisions.",
      },
      {
        q: "What if I don't like the song I receive?",
        a: "Express In Music works hard to understand your input before production begins. When you submit detailed information about your idea, story, or message, our team uses that information to craft the music according to your expectations. In certain cases and depending on the selected package, limited revisions or adjustments may be possible to improve the final output. Providing clear details in the order form helps ensure the best possible results.",
      },
    ],
  },
  {
    id: "rights",
    icon: "⚖️",
    title: "Rights & Usage",
    faqs: [
      {
        q: "Can I use the song commercially?",
        a: "Commercial usage rights depend on the service package. Individual packages usually include personal usage rights, while business and institutional packages include broader usage permissions for marketing or campaigns. For full commercial ownership and distribution rights, you may upgrade or purchase additional services.",
      },
      {
        q: "Who owns the music created through Express In Music?",
        a: "Ownership and usage rights depend on the service package selected:\n\n• Individual Plans may include personal usage rights.\n• Business Plans allow brands to use songs for promotional or marketing purposes.\n• Institution Plans are designed for campaign or organizational use.\n\nUsers who wish to distribute or monetize their music can do so through the Vision Music distribution ecosystem connected to our platform.",
      },
      {
        q: "Can I use my song publicly or on social media?",
        a: "Yes. Most songs created through Express In Music can be shared on platforms such as YouTube, Instagram, Facebook, personal websites, and events or presentations. However, commercial distribution rights and monetization may depend on the selected package and additional distribution services.",
      },
      {
        q: "Is my idea or story safe with Express In Music?",
        a: "Yes. Any information you submit through our platform is used only for the purpose of producing your requested music project. We respect user privacy and handle project information carefully as described in our Privacy Policy.",
      },
      {
        q: "How do you ensure originality in the songs?",
        a: "Every project on Express In Music starts with your own idea, message, or story. Our production workflow focuses on transforming that input into a song. While we may use modern music technology tools during production, the creative direction is guided by human creators who shape the lyrics, melody, and arrangement. Because every project is based on unique input from the user, the final song is designed to feel personalized and original.",
      },
    ],
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI & Technology",
    faqs: [
      {
        q: "Is Express In Music fully AI-based?",
        a: "No. Express In Music is not a fully automated AI music generator. We are a Media and Music Technology company that combines advanced AI tools with human creativity to produce songs. Our system uses AI-assisted tools to speed up certain stages of music creation such as melody development, vocal experimentation, or sound design. However, human creators remain an essential part of the process. Professional lyricists, singers, and music producers review and shape the final output to ensure that the music feels authentic and emotionally engaging.",
      },
      {
        q: "Why do you use AI in music creation?",
        a: "AI helps us make music production faster, more accessible, and more scalable. Traditional music production can take weeks or months. By using modern music technology tools, we can significantly reduce production time while maintaining quality. AI helps with rapid melody experimentation, sound design and arrangement, style adaptation, and faster music production workflows. However, creative decisions and final production quality are guided by human creators.",
      },
      {
        q: "Do humans work on the songs as well?",
        a: "Yes. Every project created through Express In Music involves human creative supervision. Our network includes lyricists, vocal artists, music producers, and creative supervisors. These professionals review the project inputs, shape the creative direction, and ensure that the final song reflects the intended emotion and message.",
      },
      {
        q: "How is Express In Music different from simple AI music generators?",
        a: "Most AI music generators create songs entirely automatically, which often results in generic or repetitive outputs. Express In Music is different because we combine AI-assisted production tools, human songwriting insight, creative supervision, and structured music production workflows. This hybrid approach allows us to deliver music that is faster to produce but still emotionally meaningful.",
      },
      {
        q: "Will my song sound unique?",
        a: "Yes. Every project submitted to Express In Music is based on your own story, idea, or message. Our production process focuses on creating music that reflects your input rather than generating completely random songs. Because each project begins with your idea, the final output is designed to feel personalized and unique.",
      },
      {
        q: "Is Express In Music a music production studio?",
        a: "Express In Music is more than a traditional studio. We operate as a Music Technology Platform and Media Production Ecosystem. This means we combine creative professionals, digital production tools, global creator networks, and music distribution infrastructure to produce, manage, and distribute music efficiently.",
      },
    ],
  },
  {
    id: "creators",
    icon: "🌍",
    title: "Creators & Distribution",
    faqs: [
      {
        q: "Can I join Express In Music as a creator?",
        a: "Yes. Express In Music is building a global network of lyricists and vocal artists. If you are interested in collaborating with us, you can apply through the Join the Team page by submitting your portfolio and samples. Approved creators may receive project opportunities regularly.",
      },
      {
        q: "Does Express In Music work with independent artists?",
        a: "Yes. Express In Music actively collaborates with independent creators through its global creator network. Lyricists, singers, and musicians from different countries and languages can apply through the Join the Team section. Approved creators may receive project opportunities through the platform.",
      },
      {
        q: "Can I distribute my song on Spotify or other platforms?",
        a: "Yes. Through our Vision Music distribution network, creators can distribute their songs across major music streaming platforms. Vision Music allows you to distribute music globally, track streaming performance, monitor revenue and monetization, and manage your music catalog. All of this can be managed from the Vision Music Dashboard.",
      },
      {
        q: "What is Vision Music?",
        a: "Vision Music is a music distribution ecosystem connected to Express In Music. It allows creators and artists to distribute and monetize their music across multiple digital streaming platforms through a single dashboard. This ecosystem helps creators reach global audiences.",
      },
      {
        q: "Can Express In Music help promote or distribute my song?",
        a: "Yes. Express In Music is connected to Vision Music, a music distribution ecosystem that allows creators to distribute and monetize their songs across multiple digital streaming platforms. Through the Vision Music dashboard, creators can manage releases, track performance, and manage their digital music catalog.",
      },
      {
        q: "Can artists distribute their music through your platform?",
        a: "Yes. Artists can distribute and monetize their music through Vision Music, which is connected to the Express In Music ecosystem. Vision Music allows creators to distribute songs to digital streaming platforms and manage releases from a single dashboard.",
      },
    ],
  },
  {
    id: "trust",
    icon: "🤝",
    title: "Trust & Support",
    faqs: [
      {
        q: "Why should I trust Express In Music?",
        a: "Express In Music is a product of Visionary Voice Media Private Limited, a media and technology company working in the music and digital content ecosystem. Our platform combines music technology, creative professionals, and structured production workflows to deliver high-quality audio content. We also maintain transparency in how songs are created. We use a hybrid production approach that combines modern AI tools with human creativity from lyricists, vocal artists, and music producers. Our goal is to deliver meaningful music that reflects the message and intent of each client.",
      },
      {
        q: "How can I contact Express In Music?",
        a: "If you have additional questions or need support, you can contact our team through the website or email. Our support team will assist you with any queries regarding your project or account.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (faq) =>
        (activeCategory === "all" || activeCategory === cat.id) &&
        (search === "" ||
          faq.q.toLowerCase().includes(search.toLowerCase()) ||
          faq.a.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const totalFAQs = categories.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* Hero */}
      <section className="px-6 py-14 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            Everything you need to know about Express In Music — how it works, what we create, and how we can help you.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white/5 border border-white/15 text-white text-sm rounded-full px-10 py-3 focus:outline-none focus:border-[#00D4FF]/50 placeholder-white/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm">✕</button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-3xl flex flex-wrap justify-center gap-6 text-center">
          <div><span className="text-2xl font-bold text-[#00D4FF]">{totalFAQs}</span><p className="text-white/50 text-xs mt-1">Questions Answered</p></div>
          <div><span className="text-2xl font-bold text-[#00D4FF]">{categories.length}</span><p className="text-white/50 text-xs mt-1">Categories</p></div>
          <div><span className="text-2xl font-bold text-[#00D4FF]">24/7</span><p className="text-white/50 text-xs mt-1">Support Available</p></div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === "all" ? "bg-[#00D4FF] text-black border-transparent" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === cat.id ? "bg-[#00D4FF] text-black border-transparent" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">No questions found for "<span className="text-white/50">{search}</span>"</p>
              <button onClick={() => setSearch("")} className="mt-4 text-[#00D4FF] text-sm hover:underline">Clear search</button>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-xl font-bold text-white">{cat.title}</h2>
                  <span className="ml-auto text-xs text-white/30 bg-white/5 px-2 py-1 rounded-full">{cat.faqs.length} questions</span>
                </div>
                <div className="space-y-2">
                  {cat.faqs.map((faq, i) => {
                    const id = `${cat.id}-${i}`;
                    const isOpen = openId === id;
                    return (
                      <div
                        key={id}
                        className={`border rounded-2xl transition-all ${isOpen ? "border-[#00D4FF]/30 bg-[#00D4FF]/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                      >
                        <button
                          onClick={() => toggle(id)}
                          className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className={`font-medium text-sm leading-snug ${isOpen ? "text-white" : "text-white/80"}`}>
                            {faq.q}
                          </span>
                          <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-all ${isOpen ? "border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/10 rotate-45" : "border-white/20 text-white/40"}`}>
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5">
                            <div className="border-t border-white/10 pt-4">
                              {faq.a.split("\n").map((line, li) =>
                                line.trim() === "" ? (
                                  <div key={li} className="h-2" />
                                ) : (
                                  <p key={li} className="text-white/60 text-sm leading-relaxed">
                                    {line}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="px-6 py-14 bg-white/[0.02] border-t border-white/10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-4xl mb-4">💬</p>
          <h2 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h2>
          <p className="text-white/60 text-sm mb-8">
            If you have something to say, we turn it into music.<br />
            Reach out to our team and we will assist you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block bg-[#00D4FF] hover:bg-[#00b8d9] text-black font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg shadow-[#00D4FF]/30"
            >
              Contact Support
            </Link>
            <Link
              to="/create-song"
              className="inline-block border border-white/20 text-white hover:border-white/40 font-semibold px-8 py-3 rounded-full text-sm transition-all"
            >
              Create Your Song
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-8">Express In Music — We Say It For You</p>
        </div>
      </section>
    </div>
  );
}
