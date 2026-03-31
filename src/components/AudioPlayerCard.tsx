interface AudioPlayerCardProps {
  title: string;
  genre: string;
  duration: string;
  audioUrl: string;
}

export default function AudioPlayerCard({ title, genre, duration, audioUrl }: AudioPlayerCardProps) {
  const hasAudio = Boolean(audioUrl?.trim());

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
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
  );
}
