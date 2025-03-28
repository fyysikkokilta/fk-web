import type { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    useAsTitle: 'role',
    group: 'Officials',
    description: 'Manage board members',
    defaultColumns: ['name', 'role']
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
      name: 'role',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'email',
      type: 'text',
      required: true
    },
    {
      name: 'telegram',
      type: 'text',
      required: false
    },
    {
      name: 'phone',
      type: 'text',
      required: false
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('board-members')],
    afterDelete: [revalidateDeletedCollection('board-members')]
  }
}
