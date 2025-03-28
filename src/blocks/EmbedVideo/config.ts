import type { Block } from 'payload'

export const EmbedVideoBlock: Block = {
  slug: 'embed-video',
  interfaceName: 'EmbedVideoBlock',
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube or Vimeo video URL'
      }
    },
    {
      name: 'aspectRatio',
      type: 'select',
      required: true,
      defaultValue: '16:9',
      options: [
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' }
      ]
    }
  ]
}
