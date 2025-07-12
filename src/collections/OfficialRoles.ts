import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const OfficialRoles: CollectionConfig = {
  slug: 'official-roles',
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description: 'Manage official roles',
    defaultColumns: ['name', 'officials']
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
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
