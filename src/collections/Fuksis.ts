import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
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
