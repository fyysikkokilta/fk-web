import { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin
  },
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description: 'Manage divisions',
    defaultColumns: ['name', 'officialRoles']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      admin: {
        description: 'The name of the division'
      },
      required: true
    },
    {
      name: 'officialRoles',
      type: 'relationship',
      relationTo: 'official-roles',
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('divisions')],
    afterDelete: [revalidateDeletedCollection('divisions')]
  }
}
