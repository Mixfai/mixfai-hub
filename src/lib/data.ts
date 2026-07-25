import { isSanityConfigured, sanityClient } from './sanity';
import { PROMPTS_QUERY, SOP_PLAYBOOKS_QUERY } from './queries';
import type { Prompt, SopPlaybook } from '../types';

/**
 * Data layer with graceful fallback.
 *
 * - When Sanity credentials ARE configured → fetch live content.
 * - When they are NOT (or a fetch fails) → return bundled mock data so the UI
 *   always renders. Swap to live data by adding keys to `.env`.
 */

const mockPrompts: Prompt[] = [
  {
    _id: 'mock-1',
    title: 'Viral Hook Generator',
    category: 'Marketing',
    targetModel: 'GPT-4o',
    executeUrl: 'https://chat.openai.com/',
    promptContent:
      'You are a world-class copywriter. Generate 10 scroll-stopping hooks for [TOPIC]. Each hook must be under 12 words, trigger curiosity, and exploit a psychological bias (loss aversion, FOMO, or pattern interrupt). Output as a numbered list with the bias used in brackets.',
  },
  {
    _id: 'mock-2',
    title: 'SQL Query Optimizer',
    category: 'Engineering',
    targetModel: 'Claude 3.7',
    executeUrl: 'https://claude.ai/',
    promptContent:
      'Act as a senior DBA. Analyze the following SQL query for performance bottlenecks:\n\n[QUERY]\n\nRewrite it for optimal execution on PostgreSQL 16. Explain each index you recommend and estimate the cost reduction. Flag any N+1 risks.',
  },
  {
    _id: 'mock-3',
    title: 'Objection Annihilator',
    category: 'Sales',
    targetModel: 'GPT-4o',
    executeUrl: 'https://chat.openai.com/',
    promptContent:
      'You are an elite sales closer. A prospect said: "[OBJECTION]". Produce 3 rebuttals using (1) the Feel-Felt-Found method, (2) a ROI reframe, and (3) a scarcity pivot. Keep each under 60 words, confident and empathetic, never pushy.',
  },
  {
    _id: 'mock-4',
    title: 'Codebase Recon Agent',
    category: 'Engineering',
    targetModel: 'Claude 3.7',
    executeUrl: 'https://claude.ai/',
    promptContent:
      'You are a staff engineer onboarding to an unfamiliar repo. Given the file tree and key snippets below, produce: (1) an architecture map, (2) the 5 riskiest hotspots, (3) dead-code candidates, and (4) a 30-60-90 refactor plan.\n\n[PASTE TREE + SNIPPETS]',
  },
  {
    _id: 'mock-5',
    title: 'SEO Content Forge',
    category: 'Marketing',
    targetModel: 'Gemini 2.0',
    executeUrl: 'https://gemini.google.com/',
    promptContent:
      'Act as an SEO strategist. For the keyword "[KEYWORD]", output a complete content brief: search intent, H1 + H2/H3 outline, semantic entities to include, target word count, 3 internal-link anchors, and a meta title/description under 160 chars.',
  },
  {
    _id: 'mock-6',
    title: 'PII Data Scrubber',
    category: 'Security',
    targetModel: 'GPT-4o',
    executeUrl: 'https://chat.openai.com/',
    promptContent:
      'You are a data-privacy compliance filter. Scan the text below and redact all PII (names, emails, phone numbers, addresses, IDs) by replacing them with typed tokens like [NAME_1], [EMAIL_1]. Then return a mapping table of what was redacted and why.\n\n[TEXT]',
  },
];

const mockPlaybooks: SopPlaybook[] = [
  { _id: 'sop-1', code: 'SOP-001', name: 'Cold Outreach Engine', status: 'active' },
  { _id: 'sop-2', code: 'SOP-002', name: 'SEO Content Forge', status: 'active' },
  { _id: 'sop-3', code: 'SOP-003', name: 'Code Review Protocol', status: 'standby' },
  { _id: 'sop-4', code: 'SOP-004', name: 'Data Extraction Ops', status: 'active' },
  { _id: 'sop-5', code: 'SOP-005', name: 'Sales Objection Crusher', status: 'standby' },
  { _id: 'sop-6', code: 'SOP-006', name: 'Incident Response Runbook', status: 'archived' },
];

export async function getPrompts(): Promise<Prompt[]> {
  if (!isSanityConfigured || !sanityClient) return mockPrompts;
  try {
    const prompts = await sanityClient.fetch<Prompt[]>(PROMPTS_QUERY);
    return prompts.length > 0 ? prompts : mockPrompts;
  } catch (err) {
    console.error('[SyntaxHQ] Failed to fetch prompts from Sanity, using mock data.', err);
    return mockPrompts;
  }
}

export async function getSopPlaybooks(): Promise<SopPlaybook[]> {
  if (!isSanityConfigured || !sanityClient) return mockPlaybooks;
  try {
    const playbooks = await sanityClient.fetch<SopPlaybook[]>(SOP_PLAYBOOKS_QUERY);
    return playbooks.length > 0 ? playbooks : mockPlaybooks;
  } catch (err) {
    console.error('[SyntaxHQ] Failed to fetch SOP playbooks from Sanity, using mock data.', err);
    return mockPlaybooks;
  }
}
