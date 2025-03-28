import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  fields: [
    {
      name: 'newsletter',
      type: 'relationship',
      relationTo: 'newsletters',
      required: true
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Logo shown in the top right corner of the weekly news'
      }
    },
    {
      name: 'footer',
      type: 'richText',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: [] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: []
            })
          ]
        }
      }),
      admin: {
        description: 'Footer text shown at the bottom of the weekly news'
      }
    }
  ]
}
