interface AdminStatusCardProps {
  email?: string | null;
  isAdmin: boolean;
}

export default function AdminStatusCard({ email, isAdmin }: AdminStatusCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
      <p className="text-white/70">Signed in as</p>
      <p className="mt-1 font-semibold text-white">{email || 'Unknown'}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-white/60">Admin access</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isAdmin ? 'bg-green-500/20 text-green-200' : 'bg-[#FF3B81]/20 text-[#FF3B81]'}`}>
          {isAdmin ? 'Granted' : 'Not granted'}
        </span>
      </div>
    </div>
  );
}
