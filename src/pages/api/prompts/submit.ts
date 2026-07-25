import type { APIRoute } from 'astro';
import { sanityWriteClient, isSanityWriteConfigured } from '../../../lib/sanity';

export const prerender = false;

/**
 * Any signed-in user can submit a prompt. It lands in the staging inbox
 * (candidatePrompt, status=pending) for an employee to judge/review — it is
 * NOT auto-judged here, because judging costs Kimi tokens (employee-triggered).
 */
export const POST: APIRoute = async ({ locals, request }) => {
  const userId = locals.auth()?.userId;
  if (!userId) return new Response(JSON.stringify({ error: 'sign in required' }), { status: 401 });
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  try {
    const { title, promptContent, suggestedModel, suggestedCategory } = await request.json();
    if (!title || !promptContent) {
      return new Response(JSON.stringify({ error: 'title + promptContent required' }), { status: 400 });
    }
    const doc = await sanityWriteClient.create({
      _type: 'candidatePrompt',
      title: String(title).slice(0, 120),
      promptContent: String(promptContent),
      suggestedModel: suggestedModel ?? 'Kimi K2',
      suggestedCategory: suggestedCategory ?? 'Operations',
      source: 'user',
      submittedBy: userId,
      status: 'pending',
    });
    return new Response(JSON.stringify({ ok: true, id: doc._id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'submit failed', detail: String(err) }), { status: 500 });
  }
};
