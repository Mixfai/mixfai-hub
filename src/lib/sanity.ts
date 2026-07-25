import { createClient } from '@sanity/client';

/**
 * SyntaxHQ — Sanity connection (SEPARATE project from mixfai-studio).
 * Server-side only. Non-PUBLIC env vars never ship to the browser.
 */

export const SANITY_PROJECT_ID = import.meta.env.SANITY_PROJECT_ID as string | undefined;
export const SANITY_DATASET = (import.meta.env.SANITY_DATASET as string | undefined) ?? 'production';
export const SANITY_API_VERSION =
  (import.meta.env.SANITY_API_VERSION as string | undefined) ?? '2024-01-01';

/**
 * Strip characters that are illegal in HTTP headers (newlines, tabs, stray
 * spaces, surrounding quotes). A copy-pasted token with a trailing newline
 * otherwise makes every Sanity call throw "Invalid character in header
 * content [authorization]" → a 500 across the app.
 */
const clean = (v: string | undefined): string | undefined =>
  v ? v.replace(/[\r\n\t]+/g, '').trim().replace(/^["']|["']$/g, '') : undefined;

const readToken = clean(import.meta.env.SANITY_READ_TOKEN as string | undefined);
const writeToken = clean(import.meta.env.SANITY_WRITE_TOKEN as string | undefined);

/** True when read credentials are present (live reads; else mock fallback). */
export const isSanityConfigured = Boolean(SANITY_PROJECT_ID && readToken);
/** True when an Editor token is present (enables writes from the app). */
export const isSanityWriteConfigured = Boolean(SANITY_PROJECT_ID && writeToken);

const base = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
};

/** Authenticated read client (works against a PRIVATE dataset). */
export const sanityClient = isSanityConfigured
  ? createClient({ ...base, token: readToken })
  : null;

/** Editor client for mutations (ratings, candidates, approvals). */
export const sanityWriteClient = isSanityWriteConfigured
  ? createClient({ ...base, token: writeToken })
  : null;
