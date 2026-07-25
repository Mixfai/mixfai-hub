import { defineField, defineType } from 'sanity';

/**
 * An internal Mixfai playbook: an ordered workflow of prompt "steps" used to
 * deliver site-building, brand-building, marketing creative, etc.
 * Reference copy — mirror of syntaxhq-studio/schemaTypes/projectPlaybook.ts.
 */
export const projectPlaybook = defineType({
  name: 'projectPlaybook',
  title: 'Project Playbook',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'goal',
      title: 'Goal',
      type: 'string',
      options: {
        list: [
          { title: 'Site Building', value: 'site' },
          { title: 'Brand Building', value: 'brand' },
          { title: 'Marketing Creative', value: 'marketing' },
          { title: 'Operations', value: 'ops' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'promptId', title: 'Prompt ID', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: { select: { title: 'promptId', subtitle: 'note' } },
        },
      ],
    }),
    defineField({ name: 'createdBy', title: 'Created By (userId)', type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'goal' } },
});
