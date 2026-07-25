import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';

/** Star / un-star a prompt into the current user's collection. */
export default function CollectButton({ promptId, initial = false }: { promptId: string; initial?: boolean }) {
  const [collected, setCollected] = useState(initial);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCollected(Boolean(data.collected));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
        collected
          ? 'border-amber-500 bg-amber-500 text-zinc-950'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
      }`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${collected ? 'fill-zinc-950' : ''}`} />}
      {collected ? 'Collected' : 'Collect'}
    </button>
  );
}
