/**
 * Shared content types for SyntaxHQ. Mirror the Sanity schema + GROQ query shapes.
 */

export type PromptStatus = 'draft' | 'published' | 'archived';
export type PromptSource = 'manual' | 'github' | 'import' | 'judge';

export interface Prompt {
  _id: string;
  title: string;
  category: string;
  targetModel: string;
  promptContent: string;
  executeUrl?: string;
  status?: PromptStatus;
  useCase?: string;
  variables?: string[];
  qualityScore?: number;
  ratingCount?: number;
  source?: PromptSource;
  editorsChoice?: boolean;
  submittedBy?: string;
}

export type SopStatus = 'active' | 'standby' | 'archived';

export interface SopPlaybook {
  _id: string;
  code: string;
  name: string;
  status: SopStatus;
  description?: string;
}

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

export interface CandidatePrompt {
  _id: string;
  title: string;
  promptContent: string;
  suggestedModel?: string;
  suggestedCategory?: string;
  source?: string;
  sourceUrl?: string;
  judgeScore?: number;
  judgeReason?: string;
  status: CandidateStatus;
}

export interface JudgeResult {
  score: number; // 0-100
  verdict: 'approve' | 'review' | 'reject';
  clarity: number;
  specificity: number;
  reusability: number;
  safety: number;
  reason: string;
}

export interface CollectionEntry {
  _id: string;
  userId: string;
  promptId: string;
  kind: 'star' | 'fork';
  createdAt?: string;
}

export type PlaybookGoal = 'site' | 'brand' | 'marketing' | 'ops';

export interface PlaybookStep {
  promptId: string;
  note?: string;
}

export interface ProjectPlaybook {
  _id: string;
  title: string;
  goal: PlaybookGoal;
  description?: string;
  steps: PlaybookStep[];
  createdBy?: string;
}
