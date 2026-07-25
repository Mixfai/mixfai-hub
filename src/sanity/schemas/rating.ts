import { defineField, defineType } from 'sanity';

/**
 * A single user's judgment on a prompt (1-5 stars).
 * Reference copy — mirror of syntaxhq-studio/schemaTypes/rating.ts.
 */
export const rating = defineType({
  name: 'rating',
  title: 'Rating',
  type: 'document',
  fields: [
    defineField({ name: 'promptId', title: 'Prompt ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'stars', title: 'Stars', type: 'number', validation: (Rule) => Rule.required().min(1).max(5) }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: { select: { title: 'promptId', subtitle: 'stars' } },
});
