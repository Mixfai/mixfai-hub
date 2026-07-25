import { defineField, defineType } from 'sanity';

/**
 * A single weapon in the Prompt Armory.
 *
 * NOTE: This file is TypeScript for a NEW, separate Sanity Studio. It is not
 * compiled by the Astro app. Copy it (and sopPlaybook.ts + index.ts) into a
 * fresh Studio project, then register it in schemaTypes/index.ts.
 */
export const prompt = defineType({
  name: 'prompt',
  title: 'Prompt',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Marketing', value: 'Marketing' },
          { title: 'Engineering', value: 'Engineering' },
          { title: 'Sales', value: 'Sales' },
          { title: 'Security', value: 'Security' },
          { title: 'Operations', value: 'Operations' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetModel',
      title: 'Target Model',
      type: 'string',
      description: 'e.g. GPT-4o, Claude 3.7, Gemini 2.0',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'promptContent',
      title: 'Prompt Content',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'executeUrl',
      title: 'Execute URL',
      type: 'url',
      description: 'Where the "Execute" button opens (ChatGPT / Claude / Gemini).',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'targetModel' },
  },
});
