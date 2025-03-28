import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { ColorField } from '@/fields/ColorField'

export const CardBlock: Block = {
  slug: 'card',
  interfaceName: 'CardBlock',
  fields: [
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
    },
    ColorField({
      name: 'backgroundColor',
      required: true,
      defaultValue: '#ffffff'
    }),
    ColorField({
      name: 'textColor',
      required: true,
      defaultValue: '#000000'
    })
  ]
}
