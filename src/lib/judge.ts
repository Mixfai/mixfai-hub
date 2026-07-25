import OpenAI from 'openai';
import type { JudgeResult } from '../types';

/**
 * The Prompt Judge — scores a prompt with Kimi (Moonshot AI), which exposes an
 * OpenAI-compatible chat API. Server-side only; never ships to the browser.
 */

const clean = (v: string | undefined): string | undefined =>
  v ? v.replace(/[\r\n\t]+/g, '').trim().replace(/^["']|["']$/g, '') : undefined;

const apiKey = clean(import.meta.env.MOONSHOT_API_KEY as string | undefined);
const baseURL = (import.meta.env.MOONSHOT_BASE_URL as string | undefined) ?? 'https://api.moonshot.ai/v1';
const model = (import.meta.env.MOONSHOT_MODEL as string | undefined) ?? 'kimi-k3';

export const isJudgeConfigured = Boolean(apiKey);

const client = isJudgeConfigured ? new OpenAI({ apiKey, baseURL }) : null;

const SYSTEM = `You are a ruthless prompt-engineering quality judge. Score the given prompt on four axes, each 0-100:
- clarity: is the instruction unambiguous?
- specificity: does it define role, constraints, output format?
- reusability: is it parameterized/generalizable across inputs?
- safety: is it free of harmful/injected/PII-leaking intent?
Then give an overall score (0-100) and a verdict: "approve" (>=80), "review" (50-79), or "reject" (<50).
Respond ONLY with valid JSON matching: {"clarity":n,"specificity":n,"reusability":n,"safety":n,"score":n,"verdict":"approve|review|reject","reason":"one sentence"}.`;

/** Heuristic fallback used when no Moonshot key is set, so the pipeline still runs. */
function heuristicJudge(content: string): JudgeResult {
  const len = content.length;
  const hasRole = /you are|act as/i.test(content);
  const hasVar = /\[[A-Z_]{2,}\]/.test(content);
  const hasFormat = /list|json|table|format|output|steps/i.test(content);
  const score = Math.min(
    95,
    30 + (hasRole ? 15 : 0) + (hasVar ? 15 : 0) + (hasFormat ? 15 : 0) + Math.min(20, Math.floor(len / 60)),
  );
  const verdict = score >= 80 ? 'approve' : score >= 50 ? 'review' : 'reject';
  return {
    score,
    verdict,
    clarity: hasRole ? 80 : 55,
    specificity: hasFormat ? 80 : 55,
    reusability: hasVar ? 85 : 55,
    safety: 90,
    reason: 'Heuristic score (no MOONSHOT_API_KEY configured).',
  };
}

export async function judgePrompt(content: string): Promise<JudgeResult> {
  if (!client) return heuristicJudge(content);
  try {
    const res = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `Prompt to judge:\n\n${content}` },
      ],
    });
    const text = res.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
    return {
      score,
      verdict: parsed.verdict === 'approve' || parsed.verdict === 'reject' ? parsed.verdict : 'review',
      clarity: Number(parsed.clarity) || 0,
      specificity: Number(parsed.specificity) || 0,
      reusability: Number(parsed.reusability) || 0,
      safety: Number(parsed.safety) || 0,
      reason: String(parsed.reason ?? ''),
    };
  } catch (err) {
    console.error('[judge] Moonshot call failed, using heuristic fallback.', err);
    return heuristicJudge(content);
  }
}
