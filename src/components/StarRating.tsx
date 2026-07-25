import { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * 1-5 star rating. POSTs to /api/rate which records the judgment in Sanity.
 * `userId` is injected server-side from Clerk on the detail page.
 */
export default function StarRating({
  promptId,
  userId,
  initial = 0,
}: {
  promptId: string;
  userId: string;
  initial?: number;
}) {
  const [stars, setStars] = useState(initial);
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const rate = async (value: number) => {
    setStars(value);
    setState('saving');
    try {
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, userId, stars: value }),
      });
      setState(res.ok ? 'saved' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => {
          const active = (hover || stars) >= i;
          return (
            <button
              key={i}
              type="button"
              aria-label={`rate ${i} star${i > 1 ? 's' : ''}`}
              onMouseEnter={() => setHover(i)}
              onClick={() => rate(i)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-5 w-5 ${active ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
              />
            </button>
          );
        })}
      </div>
      <span className="font-mono text-[11px] text-zinc-500">
        {state === 'saving' && 'saving…'}
        {state === 'saved' && <span className="text-emerald-400">rated ✓</span>}
        {state === 'error' && <span className="text-red-400">error</span>}
        {state === 'idle' && (stars > 0 ? `${stars}/5` : 'rate this')}
      </span>
    </div>
  );
}
