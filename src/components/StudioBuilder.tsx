import { useMemo, useState } from 'react';
import { Plus, X, Loader2, Layers, CheckCircle2 } from 'lucide-react';
import type { ProjectPlaybook, Prompt, PlaybookGoal } from '../types';

const GOALS: { value: PlaybookGoal; label: string }[] = [
  { value: 'site', label: 'Site Building' },
  { value: 'brand', label: 'Brand Building' },
  { value: 'marketing', label: 'Marketing Creative' },
  { value: 'ops', label: 'Operations' },
];

/**
 * EMPLOYEE internal journey: assemble prompts into a delivery playbook
 * (ordered steps) for site / brand / marketing builds, then save to Sanity.
 */
export default function StudioBuilder({
  playbooks: initialPlaybooks,
  prompts,
}: {
  playbooks: ProjectPlaybook[];
  prompts: Prompt[];
}) {
  const [playbooks, setPlaybooks] = useState(initialPlaybooks);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState<PlaybookGoal>('site');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const promptById = useMemo(() => new Map(prompts.map((p) => [p._id, p])), [prompts]);

  const addStep = (id: string) => setSteps((s) => (id && !s.includes(id) ? [...s, id] : s));
  const removeStep = (id: string) => setSteps((s) => s.filter((x) => x !== id));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/playbooks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, goal, description, steps: steps.map((promptId) => ({ promptId })) }),
      });
      if (res.ok) {
        const { id } = await res.json();
        setPlaybooks((s) => [{ _id: id, title, goal, description, steps: steps.map((promptId) => ({ promptId })) }, ...s]);
        setTitle('');
        setDescription('');
        setSteps([]);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const field =
    'w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/60';

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Builder */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-zinc-300">
          <Layers className="h-4 w-4 text-emerald-400" /> New Playbook
        </h2>
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Playbook title (e.g. SaaS Landing Launch)" className={field} />
          <div className="grid grid-cols-2 gap-4">
            <select value={goal} onChange={(e) => setGoal(e.target.value as PlaybookGoal)} className={field}>
              {GOALS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <select onChange={(e) => { addStep(e.target.value); e.target.value = ''; }} className={field} defaultValue="">
              <option value="" disabled>+ add prompt step…</option>
              {prompts.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description (optional)" className={field} />

          {/* Ordered steps */}
          <div>
            <p className="mb-2 font-mono text-xs text-zinc-500">Steps ({steps.length})</p>
            {steps.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-700 p-4 text-center font-mono text-xs text-zinc-400">
                add prompts to build the workflow
              </p>
            ) : (
              <ol className="space-y-2">
                {steps.map((id, i) => (
                  <li key={id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                    <span className="font-mono text-xs text-emerald-400">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 truncate font-mono text-xs text-zinc-300">{promptById.get(id)?.title ?? id}</span>
                    <button onClick={() => removeStep(id)} className="text-zinc-600 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <button
            onClick={save}
            disabled={saving || !title || steps.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save playbook'}
          </button>
        </div>
      </section>

      {/* Existing playbooks */}
      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Playbooks ({playbooks.length})
        </h2>
        <div className="space-y-4">
          {playbooks.length === 0 && (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center font-mono text-sm text-zinc-500">
              no playbooks yet // build your first delivery workflow
            </p>
          )}
          {playbooks.map((pb) => (
            <article key={pb._id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold text-zinc-100">{pb.title}</h3>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-300">
                  {GOALS.find((g) => g.value === pb.goal)?.label ?? pb.goal}
                </span>
              </div>
              {pb.description && <p className="mb-3 font-mono text-xs text-zinc-500">{pb.description}</p>}
              <ol className="space-y-1">
                {pb.steps.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span className="text-emerald-400">{String(i + 1).padStart(2, '0')}</span>
                    {promptById.get(s.promptId)?.title ?? s.promptId}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
