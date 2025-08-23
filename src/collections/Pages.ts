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
                description:
                  'Banner image of the page. Please ensure to provide a high enough quality image.'
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
          'The URL path for this page. This will be auto-generated from the title if left empty. Please prefer flat paths, for example "/about" instead of "/about/index".'
      }
    },
    {
      name: 'showTableOfContents',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.fullWidth,
        description:
          'Show a table of contents for the page. This will be shown in the left sidebar or above the content on mobile.'
      }
    },
    {
      name: 'showPartners',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show the partners of the page. This will be shown above the footer.'
      }
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Make the page full width. This should be used pretty much only for official, fuksi and board pages.'
      }
    },
    {
      name: 'hidden',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Hide the page from public view. This will be set to false when publishing the page via schedule publish.'
      }
    },
    {
      name: 'boardMember',
      label: 'Board Members',
      type: 'relationship',
      relationTo: 'board-members',
      hasMany: true,
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.fullWidth,
        description:
          'Select the board members that are responsible for the page. These will be shown in the right sidebar or below the content mobile.'
      }
    }
  ],
  versions: {
    maxPerDoc: env.NODE_ENV === 'production' ? 100 : 20,
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
