import type { Block } from 'payload'

import { IconField } from '@/fields/IconField'

export const IconBlock: Block = {
  slug: 'icon',
  interfaceName: 'IconBlock',
  fields: [
    IconField({
      name: 'icon',
      required: true,
      admin: {
        description: 'The icon to display'
      }
    })
  ]
}
