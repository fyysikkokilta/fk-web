import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

import { publishedOrSignedIn } from '@/access/published-or-signed-in'
import { signedIn } from '@/access/signed-in'
import { env } from '@/env'
import { ColorField } from '@/fields/ColorField'
import { IconField } from '@/fields/IconField'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  access: {
    read: publishedOrSignedIn,
    update: signedIn
  },
  admin: {
    group: 'Pages',
    description: 'Settings for the landing page',
    preview: (doc, { req }) => {
      const baseUrl = env.NEXT_PUBLIC_SERVER_URL
      const locale = typeof req.query?.locale === 'string' ? req.query.locale : req.locale || 'fi'
      return `${baseUrl}/api/draft?slug=/${locale}`
    }
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Title of the landing page'
              }
            },
            {
              name: 'bannerImages',
              type: 'upload',
              relationTo: 'media',
              required: true,
              hasMany: true,
              admin: {
                description:
                  'Banner images of the landing page slideshow. Multiple images are shown in a slideshow.'
              }
            },
            {
              name: 'announcement',
              type: 'group',
              admin: {
                description:
                  'Announcement for the landing page. This is shown above the calendar. Used for example for guild meeting announcements.'
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Enable the announcement. If disabled, the announcement will not be shown.'
                  }
                },
                {
                  name: 'content',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                        BlocksFeature({
                          blocks: [],
                          inlineBlocks: ['icon']
                        })
                      ]
                    }
                  }),
                  admin: {
                    description: 'Content of the announcement. Remember to provide all locales.'
                  },
                  localized: true
                },
                ColorField({
                  name: 'color',
                  label: 'Background Color',
                  required: true,
                  admin: {
                    description: 'Background color of the announcement.'
                  },
                  defaultValue: '#fbdb1d'
                }),
                ColorField({
                  name: 'textColor',
                  label: 'Text Color',
                  required: true,
                  admin: {
                    description: 'Text color of the announcement.'
                  },
                  defaultValue: '#000000'
                })
              ]
            },
            {
              name: 'calendar',
              type: 'group',
              admin: {
                description:
                  'Calendars for the landing page. This is shown below the announcement. Multiple calendars can be added.'
              },
              fields: [
                {
                  name: 'calendars',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  fields: [
                    {
                      name: 'calendarId',
                      type: 'text',
                      required: true,
                      admin: {
                        description:
                          'Google Calendar ID (the address of google calendar). This is found in the calendar settings.'
                      }
                    },
                    ColorField({
                      name: 'color',
                      label: 'Background Color',
                      required: true,
                      defaultValue: '#ff8a04'
                    }),
                    ColorField({
                      name: 'textColor',
                      label: 'Text Color',
                      required: true,
                      defaultValue: '#ffffff'
                    }),
                    IconField({
                      name: 'icon',
                      label: 'Icons',
                      admin: {
                        description:
                          'Select icons for the calendar. These are random icons that are shown in the calendar. The icon is shown in the top right corner of the calendar event.'
                      },
                      hasMany: true
                    })
                  ]
                },
                {
                  name: 'maxEvents',
                  type: 'number',
                  required: true,
                  defaultValue: 8,
                  admin: {
                    description: 'Maximum number of events to display.'
                  }
                }
              ]
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
    }
  ],
  versions: {
    max: env.NODE_ENV === 'production' ? 100 : 20,
    drafts: {
      autosave: {
        interval: 200
      },
      schedulePublish: true,
      validate: true
    }
  },
  hooks: {
    afterChange: [revalidateGlobal('landing-page')]
  }
}
