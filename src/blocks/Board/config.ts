import type { Block } from 'payload'

export const BoardBlock: Block = {
  slug: 'board',
  interfaceName: 'BoardBlock',
  fields: [
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'board-members',
      required: true,
      hasMany: true
    }
  ]
}
