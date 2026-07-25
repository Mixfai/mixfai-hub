import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PromptCard from './PromptCard';
import type { Prompt } from '../types';

type SortKey = 'score' | 'title';

/**
 * Client-side search / filter / sort over the prompt list, rendering PromptCards.
 * Hydrated once with the full list; all filtering happens in the browser.
 */
export default function ArmoryFilter({ prompts }: { prompts: Prompt[] }) {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortKey>('score');

  const models = useMemo(() => Array.from(new Set(prompts.map((p) => p.targetModel))).sort(), [prompts]);
  const categories = useMemo(() => Array.from(new Set(prompts.map((p) => p.category))).sort(), [prompts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = prompts.filter(
      (p) =>
        (model === 'all' || p.targetModel === model) &&
        (category === 'all' || p.category === category) &&
        (q === '' ||
          p.title.toLowerCase().includes(q) ||
          p.promptContent.toLowerCase().includes(q) ||
          (p.useCase ?? '').toLowerCase().includes(q)),
    );
    list = [...list].sort((a, b) =>
      sort === 'score' ? (b.qualityScore ?? 0) - (a.qualityScore ?? 0) : a.title.localeCompare(b.title),
    );
    return list;
  }, [prompts, query, model, category, sort]);

  const select =
    'rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 font-mono text-xs text-zinc-300 outline-none transition-colors focus:border-emerald-500/60';

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search prompts, use-cases, content…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 py-2 pl-9 pr-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/60"
          />
        </div>
        <select value={model} onChange={(e) => setModel(e.target.value)} className={select}>
          <option value="all">model: all</option>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
          <option value="all">category: all</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={select}>
          <option value="score">sort: top score</option>
          <option value="title">sort: a–z</option>
        </select>
        <span className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-[11px] text-zinc-500">
          {filtered.length}/{prompts.length}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center font-mono text-sm text-zinc-500">
          no prompts match // adjust filters
        </p>
      ) : (
        <div className="columns-1 gap-6 md:columns-2 2xl:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {filtered.map((p) => (
            <PromptCard key={p._id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
