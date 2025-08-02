import { draftMode } from 'next/headers'
import type { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'
import { signedIn } from '@/access/signed-in'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: signedIn,
    create: admin,
    update: admin,
    delete: admin
  },
  admin: {
    useAsTitle: 'email',
    group: 'Users'
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
      defaultValue: 'user',
      admin: {
        description:
          'The role of the user. Admins can, for example, view form submissions and edit board and official information.'
      }
    }
  ],
  hooks: {
    afterLogout: [
      async () => {
        const draft = await draftMode()
        if (draft.isEnabled) {
          draft.disable()
        }
      }
    ]
  }
}
