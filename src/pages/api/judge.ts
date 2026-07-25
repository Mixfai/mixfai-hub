import type { APIRoute } from 'astro';
import { judgePrompt } from '../../lib/judge';
import { isEmployeeApi } from '../../lib/auth';

export const prerender = false;

/** EMPLOYEE-ONLY. POST { content } → JudgeResult. Scoring costs Kimi tokens. */
export const POST: APIRoute = async (context) => {
  if (!isEmployeeApi(context)) {
    return new Response(JSON.stringify({ error: 'employee access required (Mixfai org)' }), { status: 403 });
  }
  const { request } = context;
  try {
    const { content } = await request.json();
    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'content is required' }), { status: 400 });
    }
    const result = await judgePrompt(content);
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'judge failed', detail: String(err) }), { status: 500 });
  }
};
