import { useState } from 'react';
import { Sparkles, Play, Check, X, Award, Loader2 } from 'lucide-react';
import type { CandidatePrompt, JudgeResult } from '../types';

/**
 * EMPLOYEE review console. For each pending candidate the employee can:
 *  - Run Judge (Kimi score)          → /api/judge
 *  - Preview output (Kimi execute)   → /api/run
 *  - Approve → Armory / Reject       → /api/candidates/moderate
 *  - Mark Editor's Choice on approve → /api/candidates/moderate { editorsChoice }
 */
export default function ReviewConsole({ candidates }: { candidates: CandidatePrompt[] }) {
  const [items, setItems] = useState(candidates);
  const [busy, setBusy] = useState<string | null>(null);
  const [judge, setJudge] = useState<Record<string, JudgeResult>>({});
  const [preview, setPreview] = useState<Record<string, string>>({});

  const remove = (id: string) => setItems((s) => s.filter((c) => c._id !== id));

  const runJudge = async (c: CandidatePrompt) => {
    setBusy(c._id + ':judge');
    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: c.promptContent }),
      });
      if (res.ok) {
        const data: JudgeResult = await res.json();
        setJudge((s) => ({ ...s, [c._id]: data }));
      }
    } finally {
      setBusy(null);
    }
  };

  const runPreview = async (c: CandidatePrompt) => {
    setBusy(c._id + ':preview');
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: c.promptContent }),
      });
      const data = await res.json();
      setPreview((s) => ({ ...s, [c._id]: res.ok ? data.output : `⚠ ${data.error ?? 'preview failed'}` }));
    } finally {
      setBusy(null);
    }
  };

  const moderate = async (c: CandidatePrompt, action: 'approve' | 'reject', editorsChoice = false) => {
    setBusy(c._id + ':' + action);
    try {
      const res = await fetch('/api/candidates/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: c._id, action, editorsChoice, judge: judge[c._id] }),
      });
      if (res.ok) remove(c._id);
    } finally {
      setBusy(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center font-mono text-sm text-zinc-500">
        inbox zero // no pending candidates
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((c) => {
        const j = judge[c._id];
        const p = preview[c._id];
        return (
          <article key={c._id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-mono text-sm font-semibold text-zinc-100">{c.title}</h2>
              <div className="flex items-center gap-2">
                {c.source === 'user' && (
                  <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                    user-submitted
                  </span>
                )}
                {j && (
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-300">
                    {j.score}/100 · {j.verdict}
                  </span>
                )}
              </div>
            </div>

            <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 font-mono text-xs leading-relaxed text-emerald-300/90">
              {c.promptContent}
            </pre>

            {j && <p className="mt-2 font-mono text-xs italic text-zinc-500">“{j.reason}”</p>}

            {p !== undefined && (
              <div className="mt-3 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 p-4">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">output preview</p>
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300">{p}</pre>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={() => runJudge(c)} disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50">
                {busy === c._id + ':judge' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Run Judge
              </button>
              <button onClick={() => runPreview(c)} disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-2 font-mono text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/20 disabled:opacity-50">
                {busy === c._id + ':preview' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Preview
              </button>
              <span className="flex-1" />
              <button onClick={() => moderate(c, 'approve', true)} disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 font-mono text-xs font-semibold text-yellow-300 hover:bg-yellow-500/20 disabled:opacity-50">
                <Award className="h-3.5 w-3.5" /> Editor's Choice
              </button>
              <button onClick={() => moderate(c, 'approve')} disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50">
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button onClick={() => moderate(c, 'reject')} disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50">
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
