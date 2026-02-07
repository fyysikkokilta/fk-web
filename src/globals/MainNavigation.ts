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
    options: [
      { value: 'page', label: 'Page' },
      { value: 'page-navigation', label: 'Page Navigation' },
      { value: 'external', label: 'External' },
      { value: 'menu', label: 'Menu' }
    ],
    required: true,
    defaultValue: 'page',
    admin: {
      description:
        'The type of the navigation item. If the item is a menu, it will be shown as a dropdown menu. If the item is a page navigation, you can select to show the first or last page of the page navigation.'
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
    name: 'pageNavigation',
    type: 'relationship',
    relationTo: 'page-navigations',
    required: true,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData.type === 'page-navigation'
      }
    }
  },
  {
    name: 'pageIndex',
    type: 'number',
    defaultValue: 0,
    required: true,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData.type === 'page-navigation'
      },
      description:
        'The index of the page to show. Indexing is 0-based. Write a negative number to count from the end.'
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
      if (!value) return 'URL is required'
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([^\s]*)\/?$/
      if (!regex.test(value)) {
        return 'URL is invalid'
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
    description: 'Main navigation menu items.'
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
