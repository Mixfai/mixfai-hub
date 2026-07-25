/** Central category list — used by schemas, filters, and the submit form. */
export const CATEGORIES = [
  'Marketing',
  'Engineering',
  'Sales',
  'Security',
  'Operations',
  'Creative',
  'Video',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Central target-model list (Kimi-first per product focus). */
export const TARGET_MODELS = ['Kimi K2', 'GPT-4o', 'Claude 3.7', 'Gemini 2.0', 'Seedance'] as const;
export type TargetModel = (typeof TARGET_MODELS)[number];
