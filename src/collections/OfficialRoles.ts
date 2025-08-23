import { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const OfficialRoles: CollectionConfig = {
  slug: 'official-roles',
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description:
      'Manage official roles. When creating the official table for the new year, you should use the upload panel found in "/admin/actions" to upload the official table.',
    defaultColumns: ['name', 'officials']
  },
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      admin: {
        description: 'The name of the official role'
      },
      required: true
    },
    {
      name: 'officials',
      type: 'relationship',
      relationTo: 'officials',
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('official-roles')],
    afterDelete: [revalidateDeletedCollection('official-roles')]
  }
}
