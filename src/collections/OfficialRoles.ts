import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const OfficialRoles: CollectionConfig = {
  slug: 'official-roles',
  admin: {
    useAsTitle: 'title',
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
    // We need to explicitly populate the title field to show it in the admin selects
    {
      name: 'title',
      type: 'text',
      virtual: 'name.translation',
      admin: {
        hidden: true
      }
    },
    {
      name: 'name',
      type: 'relationship',
      relationTo: 'translations',
      filterOptions: () => ({
        type: {
          equals: 'officialRole'
        }
      }),
      required: true
    },
    {
      name: 'year',
      type: 'number',
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
