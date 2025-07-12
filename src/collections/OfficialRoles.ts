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
    defaultColumns: ['name', 'year', 'officials']
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
      name: 'year',
      type: 'number',
      admin: {
        description: 'For which year the officials below are'
      },
      required: true
    },
    {
      name: 'officials',
      type: 'relationship',
      relationTo: 'officials',
      filterOptions: ({ data }) => ({
        year: {
          equals: data.year
        }
      }),
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('official-roles')],
    afterDelete: [revalidateDeletedCollection('official-roles')]
  }
}
