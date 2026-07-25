import type { APIRoute } from 'astro';
import { judgePrompt } from '../../../lib/judge';
import { sanityWriteClient, isSanityWriteConfigured } from '../../../lib/sanity';
import { isEmployeeApi } from '../../../lib/auth';

export const prerender = false;

/**
 * Legit open-source prompt collections (raw .md on GitHub). We pull the raw
 * files, judge each with Kimi, then auto-approve high scorers into `prompt`
 * and queue the rest as `candidatePrompt` for human review.
 */
const SOURCES: { name: string; urls: string[]; model: string; category: string }[] = [
  {
    name: 'github:f/awesome-chatgpt-prompts',
    model: 'GPT-4o',
    category: 'Operations',
    urls: ['https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv'],
  },
  {
    name: 'github:PlexPt/awesome-chatgpt-prompts-zh',
    model: 'GPT-4o',
    category: 'Operations',
    urls: ['https://raw.githubusercontent.com/PlexPt/awesome-chatgpt-prompts-zh/main/prompts-zh.json'],
  },
  {
    name: 'github:langgptai/awesome-claude-prompts',
    model: 'Claude 3.7',
    category: 'Engineering',
    urls: ['https://raw.githubusercontent.com/langgptai/awesome-claude-prompts/main/README.md'],
  },
  {
    name: 'github:ai-boost/awesome-prompts',
    model: 'GPT-4o',
    category: 'Marketing',
    urls: ['https://raw.githubusercontent.com/ai-boost/awesome-prompts/main/README.md'],
  },
];

const AUTO_APPROVE = Number(import.meta.env.JUDGE_AUTO_APPROVE_THRESHOLD ?? 80);
const MAX_PER_SOURCE = 20;

const usable = (s: string) => s.length > 80 && s.length < 4000;

/** Extract candidate prompts from CSV ("act","prompt"), JSON ([{act,prompt}]), or Markdown (``` fenced blocks). */
function extractPrompts(body: string, url: string): string[] {
  const out: string[] = [];

  if (url.endsWith('.csv')) {
    // CSV rows: "act","prompt" — grab the quoted prompt field.
    for (const m of body.matchAll(/"((?:[^"]|""){80,4000})"\s*(?:,|\r?\n|$)/g)) {
      out.push(m[1].replace(/""/g, '"').trim());
    }
  } else if (url.endsWith('.json')) {
    try {
      const data = JSON.parse(body);
      const arr: any[] = Array.isArray(data) ? data : Object.values(data);
      for (const item of arr) {
        const p = item?.prompt ?? item?.content ?? item?.text;
        if (typeof p === 'string') out.push(p.trim());
      }
    } catch {
      /* fall through to markdown */
    }
  }

  if (out.length === 0) {
    // Markdown fenced code blocks.
    for (const m of body.matchAll(/```(?:\w+)?\n([\s\S]*?)```/g)) out.push(m[1].trim());
  }

  return out.filter(usable).slice(0, MAX_PER_SOURCE);
}

export const POST: APIRoute = async (context) => {
  if (!isEmployeeApi(context)) {
    return new Response(JSON.stringify({ error: 'employee access required (Mixfai org)' }), { status: 403 });
  }
  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return new Response(JSON.stringify({ error: 'SANITY_WRITE_TOKEN not configured' }), { status: 503 });
  }
  const summary = { imported: 0, autoApproved: 0, queued: 0, errors: 0 };

  try {
    for (const src of SOURCES) {
      for (const url of src.urls) {
        let md = '';
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          md = await res.text();
        } catch {
          summary.errors++;
          continue;
        }

        const blocks = extractPrompts(md, url);
        for (const content of blocks) {
          summary.imported++;
          const judged = await judgePrompt(content);
          const title = content.split('\n')[0].replace(/^#+\s*/, '').slice(0, 80) || 'Imported prompt';

          if (judged.score >= AUTO_APPROVE) {
            await sanityWriteClient.create({
              _type: 'prompt',
              title,
              category: src.category,
              targetModel: src.model,
              promptContent: content,
              useCase: judged.reason,
              qualityScore: judged.score,
              ratingCount: 0,
              source: 'github',
              status: 'published',
            });
            summary.autoApproved++;
          } else {
            await sanityWriteClient.create({
              _type: 'candidatePrompt',
              title,
              promptContent: content,
              suggestedModel: src.model,
              suggestedCategory: src.category,
              source: src.name,
              sourceUrl: url,
              judgeScore: judged.score,
              judgeReason: judged.reason,
              status: 'pending',
            });
            summary.queued++;
          }
        }
      }
    }
    return new Response(JSON.stringify({ ok: true, ...summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'import failed', detail: String(err), ...summary }), { status: 500 });
  }
};
