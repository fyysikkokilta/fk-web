import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TwoColumnsBlock: Block = {
  slug: 'two-columns',
  interfaceName: 'TwoColumnsBlock',
  labels: {
    singular: 'Two Columns',
    plural: 'Two Columns'
  },
  fields: [
    {
      name: 'wrapOnMobile',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If true, the right column will be below the left column on mobile.'
      }
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: '50% / 50%', value: 'grid-cols-[1fr_1fr]' },
        { label: '33% / 66%', value: 'grid-cols-[1fr_2fr]' },
        { label: '66% / 33%', value: 'grid-cols-[2fr_1fr]' },
        { label: '25% / 75%', value: 'grid-cols-[1fr_3fr]' },
        { label: '75% / 25%', value: 'grid-cols-[3fr_1fr]' }
      ],
      required: true,
      defaultValue: 'grid-cols-[1fr_1fr]',
      admin: {
        description:
          'The layout of the columns. On mobile, the layout will be 100% if wrapOnMobile is true.'
      }
    },
    {
      name: 'contentLeft',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: ['card', 'collapsible'],
              inlineBlocks: ['icon']
            })
          ]
        }
      })
    },
    {
      name: 'contentRight',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: ['card', 'collapsible'],
              inlineBlocks: ['icon']
            })
          ]
        }
      })
    }
  ]
}
