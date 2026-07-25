import { Show, UserButton } from '@clerk/astro/react';

/**
 * Right-side auth control for page headers. Guests get a "Sign In" link to the
 * branded /sign-in page; signed-in users get the Clerk <UserButton />. A single
 * client island so it works on public pages (where middleware doesn't force auth).
 *
 * Uses a plain <a href="/sign-in"> rather than SignInButton mode="modal" — the
 * modal popup is unreliable inside Astro islands; the dedicated page always works.
 */
export default function AuthNav() {
  return (
    <>
      <Show when="signed-out">
        <a
          href="/sign-in"
          className="inline-block rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)] active:scale-95"
        >
          Sign In
        </a>
      </Show>
      <Show when="signed-in">
        <div className="rounded-full ring-1 ring-zinc-700/80 transition-shadow hover:ring-emerald-500/50">
          <UserButton />
        </div>
      </Show>
    </>
  );
}
