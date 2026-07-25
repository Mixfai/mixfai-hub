/**
 * Shared Clerk `appearance` theme so sign-in / sign-up match the cyber-terminal
 * SyntaxHQ aesthetic (dark zinc + emerald neon, monospace accents).
 */
export const clerkAppearance = {
  variables: {
    colorBackground: '#09090b', // zinc-950
    colorInputBackground: '#18181b', // zinc-900
    colorInputText: '#e4e4e7', // zinc-200
    colorText: '#e4e4e7',
    colorTextSecondary: '#a1a1aa', // zinc-400
    colorPrimary: '#10b981', // emerald-500
    colorTextOnPrimaryBackground: '#09090b',
    colorDanger: '#f87171',
    borderRadius: '0.75rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  elements: {
    card: 'bg-transparent shadow-none border-0',
    headerTitle: 'text-zinc-50 font-bold',
    headerSubtitle: 'text-zinc-500',
    socialButtonsBlockButton:
      'border border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800 hover:border-emerald-500/40',
    formFieldLabel: 'text-zinc-400 font-mono text-xs',
    formFieldInput:
      'border border-zinc-700 bg-zinc-900/70 text-zinc-200 focus:border-emerald-500/60 focus:ring-emerald-500/30',
    formButtonPrimary:
      'bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 shadow-[0_0_16px_-4px_rgba(16,185,129,0.6)]',
    footerActionLink: 'text-emerald-400 hover:text-emerald-300',
    identityPreviewEditButton: 'text-emerald-400',
    formFieldAction: 'text-emerald-400',
    dividerLine: 'bg-zinc-800',
    dividerText: 'text-zinc-600',
  },
} as const;
