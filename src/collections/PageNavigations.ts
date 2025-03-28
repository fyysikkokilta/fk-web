import { CollectionConfig } from 'payload'

import { publishedAndVisibleOrSignedIn } from '@/access/published-and-visible-or-signed-in'
import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const PageNavigations: CollectionConfig = {
  slug: 'page-navigations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pages'],
    group: 'Pages',
    description: 'Manage website page navigations'
  },
  access: {
    read: publishedAndVisibleOrSignedIn,
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
