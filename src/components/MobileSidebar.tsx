import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import type { SopPlaybook } from '../types';

const statusStyles: Record<string, string> = {
  active: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  standby: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  archived: 'text-zinc-500 border-zinc-700 bg-zinc-800/40',
};

/**
 * Mobile-only slide-in drawer for the SOP Playbooks list (the desktop sidebar
 * is hidden below `lg`). Trigger sits in the sticky navbar.
 */
export default function MobileSidebar({ playbooks }: { playbooks: SopPlaybook[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open SOP Playbooks"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300 lg:hidden"
      >
        <BookOpen className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-zinc-800 bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
                SOP Playbooks
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/70 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {playbooks.map((sop) => (
                <div
                  key={sop._id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-emerald-400/80">{sop.code}</p>
                    <p className="truncate text-sm font-medium text-zinc-200">{sop.name}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${statusStyles[sop.status]}`}
                  >
                    {sop.status}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
