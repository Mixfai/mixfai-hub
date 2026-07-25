import type { APIRoute } from 'astro';
import { sanityWriteClient, isSanityWriteConfigured } from '../../lib/sanity';

export const prerender = false;

/**
 * Star / un-star a prompt into the current user's collection.
 * POST { promptId } → toggles. Returns { collected: boolean }.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  const userId = locals.auth()?.userId;
  if (!userId) return new Response(JSON.stringify({ error: 'sign in required' }), { status: 401 });
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  try {
    const { promptId } = await request.json();
    if (!promptId) return new Response(JSON.stringify({ error: 'promptId required' }), { status: 400 });

    const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_type == "collection" && userId == $u && promptId == $p][0]{ _id }`,
      { u: userId, p: promptId },
    );

    if (existing) {
      await sanityWriteClient.delete(existing._id);
      return new Response(JSON.stringify({ ok: true, collected: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    await sanityWriteClient.create({
      _type: 'collection',
      userId,
      promptId,
      kind: 'star',
      createdAt: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ ok: true, collected: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'collect failed', detail: String(err) }), { status: 500 });
  }
};
