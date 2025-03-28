import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const CollapsibleBlock: Block = {
  slug: 'collapsible',
  interfaceName: 'CollapsibleBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
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
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: ['align', 'card'],
              inlineBlocks: ['icon']
            })
          ]
        }
      })
    },
    {
      name: 'isOpenByDefault',
      type: 'checkbox',
      defaultValue: false
    }
  ]
}
