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
    useAsTitle: 'title',
    group: 'Officials',
    description: 'Manage divisions',
    defaultColumns: ['name', 'year', 'officialRoles']
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
          equals: 'division'
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
      name: 'officialRoles',
      type: 'relationship',
      relationTo: 'official-roles',
      filterOptions: ({ data }) => ({
        year: {
          equals: data.year
        }
      }),
      // Select appearance doesn't select the relationship field, which causes the admin not to show the name of the official roles
      // In drawer appearance, this isn't the case
      admin: {
        appearance: 'drawer'
      },
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('divisions')],
    afterDelete: [revalidateDeletedCollection('divisions')]
  }
}
