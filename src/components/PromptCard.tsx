import { useState } from 'react';
import { Copy, Check, Terminal, Cpu, Play, Tag } from 'lucide-react';
import type { Prompt } from '../types';

/**
 * Display props derived from the shared Prompt type. `_id` and `status` are
 * optional so a prompt can be rendered without them, and extra fields from a
 * spread `{...prompt}` are accepted without breaking the type contract.
 */
export type PromptCardProps = Pick<
  Prompt,
  'title' | 'category' | 'targetModel' | 'promptContent' | 'executeUrl' | 'qualityScore' | 'editorsChoice'
> & {
  _id?: string;
  status?: Prompt['status'];
};

export default function PromptCard({
  _id,
  title,
  category,
  targetModel,
  promptContent,
  executeUrl = 'https://chat.openai.com/',
  qualityScore,
  editorsChoice,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      // Briefly flash the "Copied! (已复制)" state, then revert.
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      // Fallback for older browsers / non-secure contexts.
      const textarea = document.createElement('textarea');
      textarea.value = promptContent;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      } catch (e) {
        console.error('Copy failed', e);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)]"
    >
      {/* Neon top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm font-semibold tracking-tight text-zinc-100">
            <span className="mr-1.5 text-emerald-400">▸</span>
            {_id ? (
              <a href={`/prompts/${_id}`} className="transition-colors hover:text-emerald-300">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          {editorsChoice && (
            <span className="mt-1 inline-block rounded-md border border-yellow-500/40 bg-yellow-500/10 px-1.5 py-0.5 font-mono text-[10px] text-yellow-300">
              ★ editor's choice
            </span>
          )}
          {typeof qualityScore === 'number' && qualityScore > 0 && (
            <span className="mt-1 ml-1 inline-block rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
              {qualityScore}/100
            </span>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-fuchsia-300">
              <Tag className="h-3 w-3" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan-300">
              <Cpu className="h-3 w-3" />
              {targetModel}
            </span>
          </div>
        </div>
        <Terminal className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-emerald-400" />
      </div>

      {/* Terminal-styled prompt block */}
      <div className="relative flex-1 bg-zinc-950/70 px-5 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            prompt.txt
          </span>
        </div>
        <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-emerald-300/90 [scrollbar-width:thin]">
          <span className="select-none text-zinc-600">$ </span>
          {promptContent}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-zinc-800/80 px-5 py-3.5">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-all duration-200 active:scale-95 ${
            copied
              ? 'border-emerald-500 bg-emerald-500 text-zinc-950 shadow-[0_0_20px_-2px_rgba(16,185,129,0.6)]'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied! (已复制)
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Prompt
            </>
          )}
        </button>

        <a
          href={executeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-2 font-mono text-xs font-semibold text-fuchsia-300 transition-all duration-200 hover:bg-fuchsia-500/20 hover:shadow-[0_0_16px_-4px_rgba(217,70,239,0.5)] active:scale-95"
        >
          <Play className="h-4 w-4" />
          Execute
        </a>
      </div>
    </div>
  );
}
