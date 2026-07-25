import type { APIRoute } from 'astro';
import { sanityWriteClient, isSanityWriteConfigured } from '../../../lib/sanity';
import { isEmployeeApi } from '../../../lib/auth';

export const prerender = false;

/**
 * EMPLOYEE-ONLY. POST { candidateId, action, editorsChoice?, judge? }.
 * Approve → creates a published `prompt` (optionally Editor's Choice, carrying
 * the judge score) and marks the candidate approved. Reject → marks rejected.
 */
export const POST: APIRoute = async (context) => {
  if (!isEmployeeApi(context)) {
    return new Response(JSON.stringify({ error: 'employee access required (Mixfai org)' }), { status: 403 });
  }
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  try {
    const { candidateId, action, editorsChoice = false, judge } = await context.request.json();
    if (!candidateId || (action !== 'approve' && action !== 'reject')) {
      return new Response(JSON.stringify({ error: 'candidateId + action(approve|reject) required' }), { status: 400 });
    }

    if (action === 'approve') {
      const c = await sanityWriteClient.fetch<any>(`*[_type == "candidatePrompt" && _id == $id][0]`, { id: candidateId });
      if (!c) return new Response(JSON.stringify({ error: 'candidate not found' }), { status: 404 });
      const score = judge?.score ?? c.judgeScore ?? 0;
      await sanityWriteClient.create({
        _type: 'prompt',
        title: c.title,
        category: c.suggestedCategory ?? 'Operations',
        targetModel: c.suggestedModel ?? 'Kimi K2',
        promptContent: c.promptContent,
        useCase: judge?.reason ?? c.judgeReason,
        qualityScore: score,
        ratingCount: 0,
        source: c.source === 'user' ? 'manual' : 'judge',
        editorsChoice: Boolean(editorsChoice),
        submittedBy: c.submittedBy,
        status: 'published',
      });
    }

    await sanityWriteClient.patch(candidateId).set({ status: action === 'approve' ? 'approved' : 'rejected' }).commit();
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'moderate failed', detail: String(err) }), { status: 500 });
  }
};
