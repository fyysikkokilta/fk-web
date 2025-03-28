import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const FuksiGroups: CollectionConfig = {
  slug: 'fuksi-groups',
  admin: {
    useAsTitle: 'name',
    group: 'Fuksis',
    description: 'Manage fuksi groups',
    defaultColumns: ['name', 'year', 'fuksis']
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
      required: true
    },
    {
      name: 'year',
      type: 'number',
      required: true
    },
    {
      name: 'fuksis',
      type: 'relationship',
      relationTo: 'fuksis',
      filterOptions: ({ data }) => ({
        year: {
          equals: data.year
        }
      }),
      hasMany: true,
      required: true
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('fuksi-groups')],
    afterDelete: [revalidateDeletedCollection('fuksi-groups')]
  }
}
