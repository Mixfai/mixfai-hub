/**
 * GROQ queries for the SyntaxHQ Sanity dataset.
 */

/** All published prompts for the Armory — Editor's Choice first, then score. */
export const PROMPTS_QUERY = /* groq */ `
  *[_type == "prompt" && status == "published"] | order(editorsChoice desc, qualityScore desc, title asc) {
    _id, title, category, targetModel, promptContent, executeUrl, status,
    useCase, variables, qualityScore, ratingCount, source, editorsChoice, submittedBy
  }
`;

/** Editor's Choice prompts only. */
export const EDITORS_CHOICE_QUERY = /* groq */ `
  *[_type == "prompt" && status == "published" && editorsChoice == true] | order(qualityScore desc) {
    _id, title, category, targetModel, promptContent, executeUrl, status,
    useCase, variables, qualityScore, ratingCount, source, editorsChoice
  }
`;

/** A user's collected (starred) prompt ids. */
export const MY_COLLECTION_IDS_QUERY = /* groq */ `
  *[_type == "collection" && userId == $userId]{ promptId }
`;

/** Full prompts for a set of ids (My Collection page). */
export const PROMPTS_BY_IDS_QUERY = /* groq */ `
  *[_type == "prompt" && _id in $ids] | order(qualityScore desc) {
    _id, title, category, targetModel, promptContent, executeUrl, status,
    useCase, variables, qualityScore, ratingCount, source, editorsChoice
  }
`;

/** Internal project playbooks (site/brand/marketing builder). */
export const PROJECT_PLAYBOOKS_QUERY = /* groq */ `
  *[_type == "projectPlaybook"] | order(_createdAt desc) {
    _id, title, goal, description, steps, createdBy
  }
`;

/** A single prompt by id (detail page). */
export const PROMPT_BY_ID_QUERY = /* groq */ `
  *[_type == "prompt" && _id == $id][0] {
    _id, title, category, targetModel, promptContent, executeUrl, status,
    useCase, variables, qualityScore, ratingCount, source
  }
`;

/** All SOP playbooks for the left sidebar, ordered by their SOP code. */
export const SOP_PLAYBOOKS_QUERY = /* groq */ `
  *[_type == "sopPlaybook"] | order(code asc) {
    _id, code, name, status, description
  }
`;

/** Pending candidate prompts awaiting human review. */
export const PENDING_CANDIDATES_QUERY = /* groq */ `
  *[_type == "candidatePrompt" && status == "pending"] | order(judgeScore desc) {
    _id, title, promptContent, suggestedModel, suggestedCategory,
    source, sourceUrl, judgeScore, judgeReason, status
  }
`;
