import type { APIRoute } from 'astro';
import { sanityWriteClient, isSanityWriteConfigured } from '../../lib/sanity';

export const prerender = false;

/**
 * POST { promptId, userId, stars } → records a rating and updates the prompt's
 * aggregate qualityScore / ratingCount. Requires an Editor SANITY_WRITE_TOKEN.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  // Ratings are part of a user's portfolio activity — require sign-in.
  if (!locals.auth()?.userId) {
    return new Response(JSON.stringify({ error: 'sign in required' }), { status: 401 });
  }
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  try {
    const { promptId, userId, stars } = await request.json();
    if (!promptId || !userId || typeof stars !== 'number' || stars < 1 || stars > 5) {
      return new Response(JSON.stringify({ error: 'promptId, userId, stars(1-5) required' }), { status: 400 });
    }

    await sanityWriteClient.create({
      _type: 'rating',
      promptId,
      userId,
      stars,
      createdAt: new Date().toISOString(),
    });

    // Recompute the aggregate from all ratings for this prompt.
    const all = await sanityWriteClient.fetch<{ stars: number }[]>(
      `*[_type == "rating" && promptId == $id]{ stars }`,
      { id: promptId },
    );
    const ratingCount = all.length;
    const avg = all.reduce((s, r) => s + r.stars, 0) / Math.max(1, ratingCount);
    const qualityScore = Math.round((avg / 5) * 100);

    await sanityWriteClient.patch(promptId).set({ qualityScore, ratingCount }).commit();

    return new Response(JSON.stringify({ ok: true, qualityScore, ratingCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'rate failed', detail: String(err) }), { status: 500 });
  }
};
