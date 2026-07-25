import { defineField, defineType } from 'sanity';

/**
 * A user's saved (starred) prompt — powers "My Collection".
 * Reference copy — mirror of syntaxhq-studio/schemaTypes/collection.ts.
 */
export const collection = defineType({
  name: 'collection',
  title: 'Collection Entry',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'promptId', title: 'Prompt ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: [{ title: 'Star', value: 'star' }, { title: 'Fork', value: 'fork' }], layout: 'radio' },
      initialValue: 'star',
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: { select: { title: 'userId', subtitle: 'promptId' } },
});
