import { defineField, defineType } from 'sanity';

/**
 * A Standard Operating Procedure playbook shown in the left sidebar.
 * Not compiled by Astro — copy into your new Studio's schemaTypes.
 */
export const sopPlaybook = defineType({
  name: 'sopPlaybook',
  title: 'SOP Playbook',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'SOP Code',
      type: 'string',
      description: 'e.g. SOP-001',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Standby', value: 'standby' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'code' },
  },
});
