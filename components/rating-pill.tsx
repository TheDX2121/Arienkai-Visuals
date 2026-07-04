export function RatingPill({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-black backdrop-blur">
      <span className="text-gold">★</span>
      <span>{rating.toFixed(1)}</span>
      <span className="font-medium text-white/45">preview score</span>
    </div>
  );
}
