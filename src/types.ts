/**
 * Shared content types for SyntaxHQ. These mirror the Sanity schema
 * (src/sanity/schemas) and the shape returned by the GROQ queries.
 */

export type PromptStatus = 'draft' | 'published' | 'archived';

export interface Prompt {
  _id: string;
  title: string;
  category: string;
  targetModel: string;
  promptContent: string;
  executeUrl?: string;
  status?: PromptStatus;
}

export type SopStatus = 'active' | 'standby' | 'archived';

export interface SopPlaybook {
  _id: string;
  /** Human code, e.g. "SOP-001". */
  code: string;
  name: string;
  status: SopStatus;
  description?: string;
}
