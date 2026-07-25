import { useMemo, useState } from 'react';
import { Check, Copy, Wand2 } from 'lucide-react';

/**
 * Detects [VARIABLE] tokens in a prompt and renders an input for each.
 * Shows a live compiled prompt and a copy button for the filled result.
 */
export default function FillVariables({ promptContent }: { promptContent: string }) {
  const variables = useMemo(
    () => Array.from(new Set(Array.from(promptContent.matchAll(/\[([A-Z_][A-Z0-9_ ]*)\]/g)).map((m) => m[1]))),
    [promptContent],
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  if (variables.length === 0) return null;

  const compiled = variables.reduce(
    (text, v) => text.split(`[${v}]`).join(values[v]?.trim() ? values[v] : `[${v}]`),
    promptContent,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(compiled);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="rounded-xl border border-cyan-500/50 bg-cyan-500/10 p-5 shadow-[0_0_24px_-8px_rgba(34,211,238,0.4)]">
      <p className="mb-1 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-cyan-300">
        <Wand2 className="h-4 w-4" /> Customize this prompt
      </p>
      <p className="mb-4 font-mono text-[11px] text-zinc-400">
        This prompt has <span className="text-cyan-300">{variables.length}</span> variable{variables.length > 1 ? 's' : ''}. Fill them in below to generate your ready-to-use version.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {variables.map((v) => (
          <label key={v} className="block">
            <span className="mb-1 block font-mono text-[11px] text-cyan-300/80">[{v}]</span>
            <input
              value={values[v] ?? ''}
              onChange={(e) => setValues((s) => ({ ...s, [v]: e.target.value }))}
              placeholder={v.toLowerCase().replace(/_/g, ' ')}
              className="w-full rounded-lg border border-cyan-500/30 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-cyan-400/70 focus:bg-zinc-900"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">compiled output</p>
        <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-emerald-300/90">{compiled}</pre>
      </div>

      <button
        type="button"
        onClick={copy}
        className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-all active:scale-95 ${
          copied
            ? 'border-emerald-500 bg-emerald-500 text-zinc-950'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
        }`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied! (已复制)' : 'Copy compiled prompt'}
      </button>
    </div>
  );
}
