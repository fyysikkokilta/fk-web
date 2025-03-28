import type { Block } from 'payload'

export const BoardMemberGridBlock: Block = {
  slug: 'board-member-grid',
  interfaceName: 'BoardMemberGridBlock',
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
