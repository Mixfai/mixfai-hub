/**
 * GROQ queries for the SyntaxHQ Sanity dataset. These fetch only the fields
 * the UI needs and order results deterministically.
 */

/** All published prompts for the Prompt Armory grid. */
export const PROMPTS_QUERY = /* groq */ `
  *[_type == "prompt" && status == "published"] | order(title asc) {
    _id,
    title,
    category,
    targetModel,
    promptContent,
    executeUrl,
    status
  }
`;

/** All SOP playbooks for the left sidebar, ordered by their SOP code. */
export const SOP_PLAYBOOKS_QUERY = /* groq */ `
  *[_type == "sopPlaybook"] | order(code asc) {
    _id,
    code,
    name,
    status,
    description
  }
`;
