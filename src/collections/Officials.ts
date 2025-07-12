import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { officialImportController } from '@/controllers/official-import-controller'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Officials: CollectionConfig = {
  slug: 'officials',
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description: 'Manage officials',
    defaultColumns: ['name', 'photo']
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media'
    }
  ],
  endpoints: [
    {
      path: '/import',
      method: 'post',
      handler: officialImportController
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('officials')],
    afterDelete: [revalidateDeletedCollection('officials')]
  }
}
