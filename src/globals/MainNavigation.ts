import type { Field, GlobalConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { env } from '@/env'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

const fields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    localized: true,
    admin: {
      description: 'The label of the navigation item. Remember to provide all locales.'
    }
  },
  {
    name: 'type',
    type: 'select',
    options: ['page', 'external', 'menu'],
    required: true,
    defaultValue: 'page',
    admin: {
      description:
        'The type of the navigation item. If the item is a page, it will be shown as a link to the page. If the item is an external link, it will be shown as a link to the external page. If the item is a menu, it will be shown as a dropdown menu.'
    }
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    required: true,
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
    required: true,
    localized: true,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData.type === 'external'
      },
      description: 'The URL of the external link. Remember to provide all locales.'
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
    description:
      'Main navigation menu items. These are the items that are shown in the main navigation menu.'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The title of the website. This will be shown in the header of the website.'
      }
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'The header logo of the website. This will be shown in the header of the website.'
      }
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        ...fields,
        {
          name: 'children',
          type: 'array',
          required: true,
          admin: {
            condition: (_data, siblingData) => {
              return siblingData.type === 'menu'
            }
          },
          fields: [
            ...fields,
            {
              name: 'subchildren',
              type: 'array',
              required: true,
              admin: {
                condition: (_data, siblingData) => {
                  return siblingData.type === 'menu'
                }
              },
              fields: fields
            }
          ]
        }
      ]
    }
  ],
  versions: {
    max: env.NODE_ENV === 'production' ? 100 : 20,
    drafts: {
      validate: true
    }
  },
  hooks: {
    afterChange: [revalidateGlobal('main-navigation')]
  }
}
