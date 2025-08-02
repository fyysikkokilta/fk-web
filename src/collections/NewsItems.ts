import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const NewsItems: CollectionConfig = {
  slug: 'news-items',
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date'],
    group: 'Newsletters'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'news-item-types',
      required: true,
      admin: {
        description: 'The type of news item'
      }
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: []
            })
          ]
        }
      }),
      required: true,
      localized: true
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy'
        }
      }
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('news-items')],
    afterDelete: [revalidateDeletedCollection('news-items')]
  }
}
