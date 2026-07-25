import { defineField, defineType } from 'sanity';

/**
 * A prompt candidate in the staging inbox, awaiting judgment/review.
 * Reference copy — mirror of syntaxhq-studio/schemaTypes/candidatePrompt.ts.
 */
export const candidatePrompt = defineType({
  name: 'candidatePrompt',
  title: 'Candidate Prompt',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'promptContent', title: 'Prompt Content', type: 'text', rows: 10, validation: (Rule) => Rule.required() }),
    defineField({ name: 'suggestedModel', title: 'Suggested Model', type: 'string' }),
    defineField({ name: 'suggestedCategory', title: 'Suggested Category', type: 'string' }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'e.g. github:repo/path, user, manual' }),
    defineField({ name: 'sourceUrl', title: 'Source URL', type: 'url' }),
    defineField({ name: 'submittedBy', title: 'Submitted By (userId)', type: 'string' }),
    defineField({ name: 'judgeScore', title: 'Judge Score', type: 'number', description: '0-100 from the LLM judge.' }),
    defineField({ name: 'judgeReason', title: 'Judge Reason', type: 'text', rows: 3 }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'Pending', value: 'pending' }, { title: 'Approved', value: 'approved' }, { title: 'Rejected', value: 'rejected' }], layout: 'radio' },
      initialValue: 'pending',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
