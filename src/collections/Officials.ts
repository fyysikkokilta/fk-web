import { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { officialImportController } from '@/controllers/official-import-controller'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Officials: CollectionConfig = {
  slug: 'officials',
  admin: {
    useAsTitle: 'name',
    group: 'Officials',
    description:
      'Manage officials. When creating the official table for the new year, you should use the upload panel found in "/admin/actions" to upload the official table.',
    defaultColumns: ['name', 'photo']
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'telegramNick',
      type: 'text',
      admin: {
        description: 'Telegram username (with or without @)'
      }
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
