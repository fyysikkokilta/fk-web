import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const PageNavigations: CollectionConfig = {
  slug: 'page-navigations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pages'],
    group: 'Pages',
    description:
      'Manage website page navigations. These are used for the fuksi page navigation but also link lists can be created with these.'
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true
    },
    {
      name: 'pages',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true
        }
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('page-navigations')],
    afterDelete: [revalidateDeletedCollection('page-navigations')]
  }
}
