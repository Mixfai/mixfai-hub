import { createClient } from '@sanity/client';

/**
 * SyntaxHQ — Sanity connection (SEPARATE project from mixfai-studio).
 *
 * Fill these in after you create the new Sanity project (sanity.io/manage).
 * They are read from non-PUBLIC env vars so they are NEVER bundled into the
 * browser. The dataset should be PRIVATE and the token server-only.
 *
 *   .env
 *   ─────────────────────────────────────────────
 *   SANITY_PROJECT_ID="abcd1234"
 *   SANITY_DATASET="production"
 *   SANITY_API_VERSION="2024-01-01"
 *   SANITY_READ_TOKEN="sk..."        # server-only, Viewer/Editor token
 */

export const SANITY_PROJECT_ID = import.meta.env.SANITY_PROJECT_ID as string | undefined;
export const SANITY_DATASET = (import.meta.env.SANITY_DATASET as string | undefined) ?? 'production';
export const SANITY_API_VERSION =
  (import.meta.env.SANITY_API_VERSION as string | undefined) ?? '2024-01-01';

// Server-only read token. Keep it non-PUBLIC so it never ships to the client.
export const serverToken = import.meta.env.SANITY_READ_TOKEN as string | undefined;

/** True only when real credentials are present, so the app can fall back to mock data. */
export const isSanityConfigured = Boolean(SANITY_PROJECT_ID && serverToken);

/**
 * Authenticated server client. Because it sends a token, it works against a
 * PRIVATE dataset — required so prompt content is never publicly readable.
 * `useCdn: false` keeps reads fresh for an ops console.
 */
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      token: serverToken,
    })
  : null;
