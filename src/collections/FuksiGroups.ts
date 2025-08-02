import { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
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
    create: admin,
    update: admin,
    delete: admin
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
