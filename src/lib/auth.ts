import type { APIContext, AstroGlobal } from 'astro';

/**
 * Mixfai EMPLOYEE detection via Clerk Organization membership.
 *
 * A user is an employee when their active session belongs to the Mixfai org.
 * Configure the org in `.env` (either works; slug is easiest):
 *   MIXFAI_ORG_SLUG=mixfai
 *   MIXFAI_ORG_ID=org_xxx        # optional, takes precedence if set
 *
 * Employees get privileged actions: Kimi judging, review/trigger, Editor's
 * Choice, output preview, and the internal site/brand/marketing builder.
 */

const ORG_SLUG = (import.meta.env.MIXFAI_ORG_SLUG as string | undefined) ?? 'mixfai';
const ORG_ID = import.meta.env.MIXFAI_ORG_ID as string | undefined;

/**
 * `locals.auth` is injected by the Clerk middleware at REQUEST time. During
 * build/prerender it may be absent — so we read it defensively.
 */
interface AuthObject {
  userId?: string | null;
  orgId?: string | null;
  orgSlug?: string | null;
}
type LocalsLike = { auth?: () => AuthObject | null };

function getAuth(locals: unknown): AuthObject | null {
  try {
    const auth = (locals as LocalsLike)?.auth;
    return typeof auth === 'function' ? auth() : null;
  } catch {
    return null;
  }
}

export function isEmployeeAuth(auth: AuthObject | null): boolean {
  if (!auth?.userId) return false;
  if (ORG_ID) return auth.orgId === ORG_ID;
  return auth.orgSlug === ORG_SLUG;
}

/** For .astro pages. */
export function isEmployee(Astro: AstroGlobal): boolean {
  return isEmployeeAuth(getAuth(Astro.locals));
}

/** For /api endpoints. */
export function isEmployeeApi(context: APIContext): boolean {
  return isEmployeeAuth(getAuth(context.locals));
}

export function currentUserId(Astro: AstroGlobal): string {
  return getAuth(Astro.locals)?.userId ?? 'anonymous';
}
