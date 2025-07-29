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
    }
  ]
}
