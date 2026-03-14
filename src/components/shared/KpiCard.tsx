interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  variant?: 'default' | 'blue' | 'emerald';
}

export function KpiCard({ label, value, sub, highlight, variant }: KpiCardProps) {
  const isHighlight = highlight || variant === 'emerald' || variant === 'blue';
  const isBlue = variant === 'blue';

  if (isHighlight) {
    return (
      <div className={`rounded-xl p-4 shadow-sm bg-gradient-to-br ${isBlue ? 'from-blue-600 to-blue-700' : 'from-emerald-600 to-emerald-700'}`}>
        <div className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1.5">{label}</div>
        <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-white/50 mt-1">{sub}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-slate-800 font-mono tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
