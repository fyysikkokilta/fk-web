import type { Block } from 'payload'

export const CommitteeBlock: Block = {
  slug: 'committee',
  interfaceName: 'CommitteeBlock',
  fields: [
    {
      name: 'officialRoles',
      type: 'relationship',
      relationTo: 'official-roles',
      required: true,
      hasMany: true,
      admin: {
        description: 'Select one or more official roles to display'
      }
    },
    {
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Select a default image to display there is no image for the official'
      }
    }
  ]
}
