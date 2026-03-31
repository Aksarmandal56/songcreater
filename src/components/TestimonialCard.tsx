interface TestimonialCardProps {
  name: string;
  quote: string;
  rating: number;
  photoUrl: string;
}

export default function TestimonialCard({ name, quote, rating, photoUrl }: TestimonialCardProps) {
  const fallbackPhoto = photoUrl || 'https://via.placeholder.com/48x48.png?text=User';
  const fallbackPhotoUrl = 'https://via.placeholder.com/48x48.png?text=User';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-4">
        <img
          src={fallbackPhoto}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            if (target.src !== fallbackPhotoUrl) {
              target.src = fallbackPhotoUrl;
            }
          }}
        />
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/60">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/70">“{quote}”</p>
      <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-xs text-white/60">
        Video testimonial available
      </div>
    </div>
  );
}
