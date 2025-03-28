import type { Block } from 'payload'

export const CommitteeBlock: Block = {
  slug: 'committee',
  interfaceName: 'CommitteeBlock',
  fields: [
    {
      name: 'officialRole',
      type: 'relationship',
      relationTo: 'official-roles',
      required: true
    }
  ]
}
