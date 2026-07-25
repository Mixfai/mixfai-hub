import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { isEmployeeApi } from '../../lib/auth';

export const prerender = false;

/**
 * EMPLOYEE-ONLY output preview: executes a prompt against Kimi (Moonshot) and
 * returns the model's response, so an employee can see the likely result while
 * judging. Costs tokens, hence the org gate.
 */
const clean = (v: string | undefined): string | undefined =>
  v ? v.replace(/[\r\n\t]+/g, '').trim().replace(/^["']|["']$/g, '') : undefined;

const apiKey = clean(import.meta.env.MOONSHOT_API_KEY as string | undefined);
const baseURL = clean(import.meta.env.MOONSHOT_BASE_URL as string | undefined) ?? 'https://api.moonshot.cn/v1';
const model = clean(import.meta.env.MOONSHOT_MODEL as string | undefined) ?? 'kimi-k3';

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
      // kimi-k3 only allows temperature=1 (reasoning model constraint).
      temperature: 1,
      // Generous budget: kimi-k3 is a reasoning model that spends tokens on
      // reasoning_content before producing the final content.
      max_tokens: 2000,
      messages: [{ role: 'user', content }],
    });
    const msg: any = res.choices[0]?.message ?? {};
    const output: string = msg.content ?? msg.reasoning_content ?? '';
    return new Response(JSON.stringify({ ok: true, output: output || '(empty response from model)' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'run failed', detail: String(err) }), { status: 500 });
  }
};
