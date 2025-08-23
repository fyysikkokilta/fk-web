import type { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    useAsTitle: 'role',
    group: 'Officials',
    description:
      'Manage board members. When creating the board members for the new year, you can just replace the information for the current entries instead of creating new ones.',
    defaultColumns: ['name', 'role']
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
