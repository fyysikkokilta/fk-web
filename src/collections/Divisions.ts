import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description: 'Manage divisions',
    defaultColumns: ['name', 'year', 'officialRoles']
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
      name: 'year',
      type: 'number',
      admin: {
        description: 'For which year the officials roles below are'
      },
      required: true
    },
    {
      name: 'officialRoles',
      type: 'relationship',
      relationTo: 'official-roles',
      filterOptions: ({ data }) => ({
        year: {
          equals: data.year
        }
      }),
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('divisions')],
    afterDelete: [revalidateDeletedCollection('divisions')]
  }
}
