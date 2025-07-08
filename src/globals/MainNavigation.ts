import type { Field, GlobalConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { env } from '@/env'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

const fields = (required = false): Field[] => [
  {
    name: 'label',
    type: 'text',
    required: true,
    localized: true
  },
  {
    name: 'type',
    type: 'select',
    options: ['page', 'external'],
    required: true,
    defaultValue: 'page'
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    required,
    hasMany: false,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData.type === 'page'
      }
    }
  },
  {
    name: 'url',
    type: 'text',
    required,
    localized: true,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData.type === 'external'
      }
    },
    validate: (value: string | null | undefined) => {
      if (!value) return true
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([^\s]*)\/?$/
      if (!regex.test(value)) {
        return 'Invalid URL'
      }
      return true
    }
  }
]

export const MainNavigation: GlobalConfig = {
  slug: 'main-navigation',
  access: {
    read: () => true,
    update: signedIn
  },
  admin: {
    group: 'Globals',
    description: 'Main navigation menu items'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        ...fields(false),
        {
          name: 'children',
          type: 'array',
          fields: [
            ...fields(false),
            {
              name: 'subchildren',
              type: 'array',
              fields: fields(true)
            }
          ]
        }
      ]
    }
  ],
  versions: {
    max: env.NODE_ENV === 'production' ? 20 : 2,
    drafts: {
      autosave: {
        interval: 200
      },
      validate: true
    }
  },
  hooks: {
    afterChange: [revalidateGlobal('main-navigation')]
  }
}
