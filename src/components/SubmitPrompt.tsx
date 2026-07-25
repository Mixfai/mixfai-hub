import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, TARGET_MODELS } from '../lib/categories';

/** Any signed-in user can submit a prompt → staging inbox (candidatePrompt). */
export default function SubmitPrompt() {
  const [title, setTitle] = useState('');
  const [model, setModel] = useState<string>(TARGET_MODELS[0]);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('saving');
    try {
      const res = await fetch('/api/prompts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, promptContent: content, suggestedModel: model, suggestedCategory: category }),
      });
      setState(res.ok ? 'done' : 'error');
      if (res.ok) {
        setTitle('');
        setContent('');
      }
    } catch {
      setState('error');
    }
  };

  const field =
    'w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/60';

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
        <p className="mt-3 font-mono text-sm text-emerald-300">Submitted! It's in the review inbox now.</p>
        <button onClick={() => setState('idle')} className="mt-4 font-mono text-xs text-zinc-400 underline hover:text-zinc-200">
          submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div>
        <label className="mb-1 block font-mono text-xs text-zinc-400">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cold Outreach Opener" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs text-zinc-400">Target model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} className={field}>
            {TARGET_MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-zinc-400">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block font-mono text-xs text-zinc-400">Prompt content</label>
        <textarea
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="You are a … Use [VARIABLES] for fill-in tokens."
          className={field}
        />
      </div>
      {state === 'error' && <p className="font-mono text-xs text-red-400">Submit failed — try again.</p>}
      <button
        type="submit"
        disabled={state === 'saving'}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
      >
        {state === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit for review
      </button>
    </form>
  );
}
