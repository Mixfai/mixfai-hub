import { defineField, defineType } from 'sanity';

/**
 * A single weapon in the Prompt Armory.
 * Reference copy — mirror of syntaxhq-studio/schemaTypes/prompt.ts.
 */
export const prompt = defineType({
  name: 'prompt',
  title: 'Prompt',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required().min(1) }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Marketing', 'Engineering', 'Sales', 'Security', 'Operations', 'Creative', 'Video'].map((v) => ({ title: v, value: v })),
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetModel',
      title: 'Target Model',
      type: 'string',
      options: {
        list: [
          { title: 'Kimi K2 (Moonshot)', value: 'Kimi K2' },
          { title: 'GPT-4o', value: 'GPT-4o' },
          { title: 'Claude 3.7', value: 'Claude 3.7' },
          { title: 'Gemini 2.0', value: 'Gemini 2.0' },
          { title: 'Seedance (Video)', value: 'Seedance' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'useCase', title: 'Use Case', type: 'string', description: 'One-line: when/why to use this prompt.' }),
    defineField({ name: 'promptContent', title: 'Prompt Content', type: 'text', rows: 10, validation: (Rule) => Rule.required() }),
    defineField({ name: 'executeUrl', title: 'Execute URL', type: 'url' }),
    defineField({ name: 'variables', title: 'Variables', type: 'array', of: [{ type: 'string' }], description: 'Fill-in tokens like TOPIC, KEYWORD (auto-detected from [VARS]).' }),
    defineField({ name: 'qualityScore', title: 'Quality Score', type: 'number', description: '0-100. Set by the LLM judge / aggregated ratings.', initialValue: 0 }),
    defineField({ name: 'ratingCount', title: 'Rating Count', type: 'number', initialValue: 0 }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: ['manual', 'github', 'import', 'judge'].map((v) => ({ title: v, value: v })), layout: 'dropdown' },
      initialValue: 'manual',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'Published', value: 'published' }, { title: 'Archived', value: 'archived' }], layout: 'radio' },
      initialValue: 'published',
    }),
    defineField({ name: 'editorsChoice', title: "Editor's Choice", type: 'boolean', initialValue: false }),
    defineField({ name: 'submittedBy', title: 'Submitted By (userId)', type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'targetModel' } },
});
