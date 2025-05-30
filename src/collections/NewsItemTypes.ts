import type { CollectionConfig } from 'payload'

import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const NewsItemTypes: CollectionConfig = {
  slug: 'news-item-types',
  admin: {
    useAsTitle: 'label',
    group: 'Newsletters'
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier for the type (e.g., "guild-events")'
      }
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('news-item-types')],
    afterDelete: [revalidateDeletedCollection('news-item-types')]
  }
}
