import type { APIRoute } from 'astro';
import { isEmployeeApi } from '../../../lib/auth';
import { sanityClient, isSanityConfigured, isSanityWriteConfigured } from '../../../lib/sanity';
import { PENDING_CANDIDATES_QUERY } from '../../../lib/queries';

export const prerender = false;

/**
 * TEMPORARY diagnostic — exercises the exact code paths /review uses and
 * returns any thrown error so we can see the real 500 cause. DELETE after go-live.
 */
export const GET: APIRoute = async (context) => {
  let auth: any = null;
  try {
    auth = context.locals.auth?.();
  } catch (e: any) {
    auth = { authError: String(e?.message ?? e) };
  }

  const out: Record<string, any> = {
    hasAuthFn: typeof context.locals.auth === 'function',
    userId: auth?.userId ?? null,
    orgSlug: auth?.orgSlug ?? null,
    isEmployee: isEmployeeApi(context),
    sanity: { isSanityConfigured, isSanityWriteConfigured },
    env: {
      MIXFAI_ORG_SLUG: (import.meta.env.MIXFAI_ORG_SLUG as string | undefined) ?? null,
      MOONSHOT_KEY_set: Boolean(import.meta.env.MOONSHOT_API_KEY),
      SANITY_WRITE_set: Boolean(import.meta.env.SANITY_WRITE_TOKEN),
      SANITY_PROJECT_ID: (import.meta.env.SANITY_PROJECT_ID as string | undefined) ?? null,
    },
    checks: {} as Record<string, string>,
  };

  // Mimic /review's Sanity fetch exactly.
  try {
    const rows = await (isSanityConfigured && sanityClient
      ? sanityClient.fetch(PENDING_CANDIDATES_QUERY)
      : []);
    out.checks.candidatesFetch = `OK (${Array.isArray(rows) ? rows.length : '?'} rows)`;
  } catch (e: any) {
    out.checks.candidatesFetch = `THROW: ${e?.message ?? String(e)}`;
  }

  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
