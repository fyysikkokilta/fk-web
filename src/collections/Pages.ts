import type { CollectionConfig, FieldHook, FieldHookArgs } from 'payload'

import { publishedAndVisibleOrSignedIn } from '@/access/published-and-visible-or-signed-in'
import { env } from '@/env'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'
import { slugify } from '@/utils/slugify'

import { signedIn } from '../access/signed-in'

const formatPath: FieldHook = async ({ value, data, req: { payload } }: FieldHookArgs) => {
  const title = data?.title as string
  if (!title || !payload.config?.localization) {
    payload.logger.error('No title found for page')
    return
  }

  // If there's no value, generate from title
  // Since the title is localized and path is not, this is set based on the first locale's title
  if (!value) {
    return slugify(title)
  }

  // Clean up the value
  if (value) {
    return value.toLowerCase().replace(/^\/+|\/+$/g, '')
  }

  return value
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'hidden'],
    listSearchableFields: ['title', 'path'],
    preview: (doc, { req }) => {
      if (!doc?.path) return null
      const baseUrl = env.NEXT_PUBLIC_SERVER_URL
      const locale = typeof req.query?.locale === 'string' ? req.query.locale : req.locale || 'fi'
      return `${baseUrl}/api/draft?slug=/${locale}/${doc.path}`
    },
    group: 'Pages',
    description: 'Manage website pages'
  },
  access: {
    read: publishedAndVisibleOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Content of the page',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true
            },
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Banner image of the page'
              }
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true
            }
          ]
        }
      ]
    },
    {
      name: 'path',
      type: 'text',
      index: true,
      unique: true,
      required: true,
      localized: true,
      hooks: {
        beforeValidate: [formatPath]
      },
      admin: {
        position: 'sidebar',
        description:
          'The URL path for this page. Will be auto-generated from the title if left empty.'
      }
    },
    {
      name: 'showTitle',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'showTableOfContents',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'showPartners',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'hidden',
      type: 'checkbox',
      defaultValue: false,
      label: 'Hide the page from public view',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'boardMember',
      label: 'Board Members',
      type: 'relationship',
      relationTo: 'board-members',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    }
  ],
  versions: {
    maxPerDoc: env.NODE_ENV === 'production' ? 20 : 2,
    drafts: {
      autosave: {
        interval: 200
      },
      schedulePublish: {
        timeFormat: 'HH:mm',
        timeIntervals: env.NODE_ENV === 'production' ? 60 : 1
      },
      validate: true
    }
  },
  hooks: {
    afterChange: [revalidateCollection('pages')],
    afterDelete: [revalidateDeletedCollection('pages')]
  }
}
