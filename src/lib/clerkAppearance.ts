/**
 * Shared Clerk `appearance` theme so sign-in / sign-up match the cyber-terminal
 * SyntaxHQ aesthetic (dark zinc + emerald neon, monospace accents).
 *
 * Note: Clerk renders some text (field hints, footer, OTP, subtitles) with its
 * own default dark-on-light assumptions, so we push the secondary/neutral
 * colors brighter and override the dimmest elements explicitly.
 */
export const clerkAppearance = {
  variables: {
    colorBackground: '#09090b', // zinc-950
    colorInputBackground: '#18181b', // zinc-900
    colorInputText: '#e4e4e7', // zinc-200
    colorText: '#e4e4e7', // zinc-200
    colorTextSecondary: '#d4d4d8', // zinc-300 (brighter — readable on dark)
    colorNeutral: '#e4e4e7', // Clerk default text/icons
    colorPrimary: '#10b981', // emerald-500
    colorTextOnPrimaryBackground: '#09090b',
    colorDanger: '#f87171',
    borderRadius: '0.75rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  elements: {
    card: 'bg-transparent shadow-none border-0',
    headerTitle: 'text-zinc-50 font-bold',
    headerSubtitle: 'text-zinc-400',
    socialButtonsBlockButton:
      'border border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800 hover:border-emerald-500/40',
    socialButtonsBlockButtonText: 'text-zinc-200',
    formFieldLabel: 'text-zinc-300 font-mono text-xs',
    formFieldInput:
      'border border-zinc-700 bg-zinc-900/70 text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/60 focus:ring-emerald-500/30',
    formFieldInputShowPasswordButton: 'text-zinc-400 hover:text-zinc-200',
    formFieldHintText: 'text-zinc-400',
    formFieldAction: 'text-emerald-400',
    formButtonPrimary:
      'bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 shadow-[0_0_16px_-4px_rgba(16,185,129,0.6)]',
    footer: 'bg-transparent',
    footerActionText: 'text-zinc-400',
    footerActionLink: 'text-emerald-400 hover:text-emerald-300',
    identityPreviewText: 'text-zinc-200',
    identityPreviewEditButton: 'text-emerald-400',
    dividerLine: 'bg-zinc-800',
    dividerText: 'text-zinc-500',
    otpCodeFieldInput: 'border-zinc-700 bg-zinc-900/70 text-zinc-200',
    formResendCodeLink: 'text-emerald-400',
    alertText: 'text-zinc-200',
  },
} as const;
