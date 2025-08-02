import { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { fuksiImportController } from '@/controllers/fuksi-import-controller'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Fuksis: CollectionConfig = {
  slug: 'fuksis',
  labels: {
    singular: 'Fuksi',
    plural: 'Fuksis'
  },
  admin: {
    useAsTitle: 'name',
    group: 'Fuksis',
    description: 'Manage fuksis',
    defaultColumns: ['name', 'year', 'photo']
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media'
    }
  ],
  endpoints: [
    {
      path: '/import',
      method: 'post',
      handler: fuksiImportController
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('fuksis')],
    afterDelete: [revalidateDeletedCollection('fuksis')]
  }
}
