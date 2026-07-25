import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { isEmployeeApi } from '../../../lib/auth';
import { judgePrompt } from '../../../lib/judge';

export const prerender = false;

/**
 * TEMPORARY diagnostic — actually calls judgePrompt + a raw Moonshot request and
 * reports the real error. DELETE after verification.
 */
const clean = (v: string | undefined): string | undefined =>
  v ? v.replace(/[\r\n\t]+/g, '').trim().replace(/^["']|["']$/g, '') : undefined;

export const GET: APIRoute = async (context) => {
  const apiKey = clean(import.meta.env.MOONSHOT_API_KEY as string | undefined);
  const baseURL = clean(import.meta.env.MOONSHOT_BASE_URL as string | undefined) ?? 'https://api.moonshot.cn/v1';
  const model = clean(import.meta.env.MOONSHOT_MODEL as string | undefined) ?? 'kimi-k3';

  const out: Record<string, any> = {
    isEmployee: isEmployeeApi(context),
    config: { keyPresent: Boolean(apiKey), keyLen: apiKey?.length ?? 0, baseURL, model },
  };

  // 1) Raw Moonshot call (bypasses judge's try/catch) to expose the real error.
  try {
    const client = new OpenAI({ apiKey, baseURL });
    const res = await client.chat.completions.create({
      model,
      max_tokens: 400,
      messages: [{ role: 'user', content: 'Return JSON: {"ok":true}' }],
    });
    const msg: any = res.choices[0]?.message ?? {};
    out.rawCall = { ok: true, content: (msg.content ?? '').slice(0, 120), reasoning: (msg.reasoning_content ?? '').slice(0, 80) };
  } catch (e: any) {
    out.rawCall = { ok: false, error: String(e?.message ?? e), status: e?.status ?? null, name: e?.name ?? null };
  }

  // 2) judgePrompt result (what the app actually uses).
  try {
    const jr = await judgePrompt('You are a helpful assistant. Output a 3-step plan in JSON.');
    out.judgePrompt = { score: jr.score, verdict: jr.verdict, reason: jr.reason };
  } catch (e: any) {
    out.judgePrompt = { threw: String(e?.message ?? e) };
  }

  return new Response(JSON.stringify(out, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
