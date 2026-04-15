interface AudioPlayerCardProps {
  title: string;
  genre: string;
  duration: string;
  audioUrl: string;
  imageUrl?: string;
}

// Genre-based gradient backgrounds
const genreGradients: Record<string, string> = {
  'Pop': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'Bollywood': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'Romantic': 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
  'Birthday': 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'Hip-Hop': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Classical': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'Rock': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'Folk': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'Jazz': 'linear-gradient(135deg, #fd746c 0%, #ff9068 100%)',
  'default': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
};

export default function AudioPlayerCard({ title, genre, duration, audioUrl, imageUrl }: AudioPlayerCardProps) {
  const hasAudio = Boolean(audioUrl?.trim());
  const bgGradient = genreGradients[genre] || genreGradients['default'];

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{
        background: imageUrl
          ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${imageUrl}') center/cover no-repeat`
          : bgGradient,
      }}
    >
      {/* Top banner area */}
      <div className="h-28 flex items-end px-5 pb-3">
        <div className="text-4xl opacity-30 select-none">♪</div>
      </div>

      {/* Card content */}
      <div className="bg-black/30 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">{title}</p>
            <p className="text-sm text-white/60">{genre} • {duration}</p>
          </div>
          <span className="rounded-full bg-[#00D4FF]/20 px-3 py-1 text-xs font-semibold text-[#00D4FF]">
            Sample
          </span>
        </div>
        {hasAudio ? (
          <audio className="mt-4 w-full" controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="mt-4 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/70">
            Audio preview unavailable
          </div>
        )}
      </div>
    </div>
  );
}
