import { Show, SignInButton, UserButton } from '@clerk/astro/react';

/**
 * Right-side auth control for page headers. Shows a "Sign In" button for
 * guests and the Clerk <UserButton /> once signed in. A single client island
 * so it works on public pages (where middleware doesn't force auth).
 */
export default function AuthNav() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)] active:scale-95">
            Sign In
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="rounded-full ring-1 ring-zinc-700/80 transition-shadow hover:ring-emerald-500/50">
          <UserButton />
        </div>
      </Show>
    </>
  );
}
