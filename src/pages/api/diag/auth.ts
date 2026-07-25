import type { APIRoute } from 'astro';
import { isEmployeeApi } from '../../../lib/auth';

export const prerender = false;

/**
 * TEMPORARY diagnostic — shows what Clerk reports for the current session so we
 * can verify org membership + env gating. DELETE after go-live verification.
 */
export const GET: APIRoute = (context) => {
  let auth: any = null;
  try {
    auth = context.locals.auth?.();
  } catch (e) {
    /* noop */
  }
  return new Response(
    JSON.stringify(
      {
        hasAuthFn: typeof context.locals.auth === 'function',
        userId: auth?.userId ?? null,
        orgId: auth?.orgId ?? null,
        orgSlug: auth?.orgSlug ?? null,
        orgRole: auth?.orgRole ?? null,
        isEmployee: isEmployeeApi(context),
        env: {
          MIXFAI_ORG_SLUG: (import.meta.env.MIXFAI_ORG_SLUG as string | undefined) ?? null,
          MIXFAI_ORG_ID_set: Boolean(import.meta.env.MIXFAI_ORG_ID),
          MOONSHOT_KEY_set: Boolean(import.meta.env.MOONSHOT_API_KEY),
          SANITY_WRITE_set: Boolean(import.meta.env.SANITY_WRITE_TOKEN),
        },
      },
      null,
      2,
    ),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
