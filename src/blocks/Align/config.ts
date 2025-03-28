import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const AlignBlock: Block = {
  slug: 'align',
  interfaceName: 'AlignBlock',
  fields: [
    {
      name: 'align',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'center',
      required: true
    },
    {
      name: 'width',
      type: 'number',
      min: 10,
      max: 100,
      defaultValue: 100,
      required: true,
      admin: {
        description: 'Width of the content in percentage (10-100%)'
      }
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: ['icon']
            })
          ]
        }
      })
    }
  ]
}
