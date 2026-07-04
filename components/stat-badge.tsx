export function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-panel rounded-2xl px-4 py-3">
      <div className="text-xl font-black">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</div>
    </div>
  );
}
