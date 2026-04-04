import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import AudioPlayerCard from '../components/AudioPlayerCard';
import SectionHeading from '../components/SectionHeading';

interface Sample {
  id: number;
  title: string;
  genre: string;
  duration: string;
  audio_url: string;
}

export default function SamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const samplesData = await fetchJson<Sample[]>('/api/samples');
        setSamples(samplesData);
      } catch (error) {
        console.error('Samples fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="px-6 py-20 text-center text-white">Loading samples...</div>;
  }

  return (
    <div className="bg-[#0c0c0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Sample library"
          title="Listen to the Express In Music vault"
          subtitle="Audio previews spanning birthday anthems, brand jingles, and campaign tracks."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {samples.map((sample) => (
            <AudioPlayerCard
              key={sample.id}
              title={sample.title}
              genre={sample.genre}
              duration={sample.duration}
              audioUrl={sample.audio_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
