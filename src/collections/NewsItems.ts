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
    group: 'Newsletters',
    description:
      'Manage news items. These are individual news items that are shown in the newsletter. You can create new news item types in the "News Item Types" section.'
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
        description:
          'The type of news item. You can create new news item types in the "News Item Types" section.'
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
        },
        description:
          'The date of the news item. The date is used to sort the news items in the newsletter and for filtering the news items in the admin panel.'
      }
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('news-items')],
    afterDelete: [revalidateDeletedCollection('news-items')]
  }
}
