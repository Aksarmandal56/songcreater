interface StatusBadgeProps {
  status: string;
}

const colors: Record<string, string> = {
  'Writing Lyrics': 'bg-[#6C4DFF]/20 text-[#6C4DFF]',
  'Music Production': 'bg-[#00D4FF]/20 text-[#00D4FF]',
  Mixing: 'bg-[#FF3B81]/20 text-[#FF3B81]',
  Ready: 'bg-green-500/20 text-green-300',
  Delivered: 'bg-green-500/20 text-green-300',
  Pending: 'bg-yellow-500/20 text-yellow-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status] || 'bg-white/10 text-white'
      }`}
    >
      {status}
    </span>
  );
}
