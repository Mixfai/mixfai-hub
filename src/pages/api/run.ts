import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { isEmployeeApi } from '../../lib/auth';

export const prerender = false;

/**
 * EMPLOYEE-ONLY output preview: executes a prompt against Kimi (Moonshot) and
 * returns the model's response, so an employee can see the likely result while
 * judging. Costs tokens, hence the org gate.
 */
const apiKey = import.meta.env.MOONSHOT_API_KEY as string | undefined;
const baseURL = (import.meta.env.MOONSHOT_BASE_URL as string | undefined) ?? 'https://api.moonshot.ai/v1';
const model = (import.meta.env.MOONSHOT_MODEL as string | undefined) ?? 'kimi-k3';

export const POST: APIRoute = async (context) => {
  if (!isEmployeeApi(context)) {
    return new Response(JSON.stringify({ error: 'employee access required (Mixfai org)' }), { status: 403 });
  }
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'MOONSHOT_API_KEY not configured' }), { status: 503 });
  }
  try {
    const { content } = await context.request.json();
    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'content required' }), { status: 400 });
    }
    const client = new OpenAI({ apiKey, baseURL });
    const res = await client.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 800,
      messages: [{ role: 'user', content }],
    });
    const output = res.choices[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ ok: true, output }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'run failed', detail: String(err) }), { status: 500 });
  }
};
