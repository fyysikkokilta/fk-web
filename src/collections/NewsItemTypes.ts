import type { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const NewsItemTypes: CollectionConfig = {
  slug: 'news-item-types',
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin
  },
  admin: {
    useAsTitle: 'label',
    group: 'Newsletters',
    description:
      'Manage news item types. These are the types of news items that can be created in the "News Items" section.'
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'The label of the news item type. This is shown in the newsletter. Remember to define all locales.'
      }
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Unique identifier for the type (e.g., "guild-events"). This is used to identify the type of news item.'
      }
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('news-item-types')],
    afterDelete: [revalidateDeletedCollection('news-item-types')]
  }
}
