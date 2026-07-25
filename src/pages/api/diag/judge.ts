import type { APIRoute } from 'astro';
import { isEmployeeApi } from '../../../lib/auth';

export const prerender = false;

/**
 * TEMPORARY diagnostic — reports what the deployed function sees for the
 * Moonshot/judge config (without leaking the key). DELETE after verification.
 */
export const GET: APIRoute = (context) => {
  const raw = import.meta.env.MOONSHOT_API_KEY as string | undefined;
  const cleaned = raw ? raw.replace(/[\r\n\t]+/g, '').trim().replace(/^["']|["']$/g, '') : undefined;
  return new Response(
    JSON.stringify(
      {
        isEmployee: isEmployeeApi(context),
        moonshot: {
          keyPresent: Boolean(raw),
          keyLen: raw?.length ?? 0,
          keyPrefix: raw ? raw.slice(0, 6) + '…' : null,
          keyHasWhitespace: raw ? /[\r\n\t ]/.test(raw) : null,
          baseURL: (import.meta.env.MOONSHOT_BASE_URL as string | undefined) ?? '(unset)',
          model: (import.meta.env.MOONSHOT_MODEL as string | undefined) ?? '(unset)',
        },
      },
      null,
      2,
    ),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
