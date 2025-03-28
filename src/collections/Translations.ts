import type { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Translations: CollectionConfig = {
  slug: 'translations',
  admin: {
    useAsTitle: 'translation',
    defaultColumns: ['translation', 'type']
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  fields: [
    {
      name: 'translation',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Translation for official roles and divisions for example. Take in account that changing this will change every other document using this translation. If you want to keep the others, create a new translation.'
      }
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Division',
          value: 'division'
        },
        {
          label: 'Official Role',
          value: 'officialRole'
        }
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('translations')],
    afterDelete: [revalidateDeletedCollection('translations')]
  }
}
