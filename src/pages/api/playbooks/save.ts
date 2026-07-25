import type { APIRoute } from 'astro';
import { sanityWriteClient, isSanityWriteConfigured } from '../../../lib/sanity';
import { isEmployeeApi } from '../../../lib/auth';

export const prerender = false;

/**
 * EMPLOYEE-ONLY. Save an internal project playbook: an ordered set of prompt
 * "steps" that deliver a site / brand / marketing build.
 * POST { title, goal, description?, steps: [{ promptId, note? }] }
 */
export const POST: APIRoute = async (context) => {
  if (!isEmployeeApi(context)) {
    return new Response(JSON.stringify({ error: 'employee access required (Mixfai org)' }), { status: 403 });
  }
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  try {
    const userId = context.locals.auth()?.userId;
    const { title, goal, description = '', steps = [] } = await context.request.json();
    if (!title || !goal || !Array.isArray(steps) || steps.length === 0) {
      return new Response(JSON.stringify({ error: 'title, goal, and at least one step required' }), { status: 400 });
    }
    const doc = await sanityWriteClient.create({
      _type: 'projectPlaybook',
      title: String(title).slice(0, 120),
      goal,
      description,
      steps: steps.map((s: any) => ({ _key: crypto.randomUUID(), promptId: s.promptId, note: s.note ?? '' })),
      createdBy: userId,
    });
    return new Response(JSON.stringify({ ok: true, id: doc._id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'save failed', detail: String(err) }), { status: 500 });
  }
};
