import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

import { publishedOrSignedIn } from '@/access/published-or-signed-in'
import { signedIn } from '@/access/signed-in'
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
    description: 'Settings for the landing page'
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'bannerImages',
              type: 'upload',
              relationTo: 'media',
              required: true,
              hasMany: true,
              admin: {
                description: 'Banner images of the landing page slideshow'
              }
            },
            {
              name: 'announcement',
              type: 'group',
              admin: {
                description: 'Announcement for the landing page'
              },
              fields: [
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
                    description: 'Content of the announcement'
                  },
                  localized: true
                },
                ColorField({
                  name: 'color',
                  label: 'Background Color',
                  required: true,
                  admin: {
                    description: 'Background color of the announcement'
                  },
                  defaultValue: '#fbdb1d'
                }),
                ColorField({
                  name: 'textColor',
                  label: 'Text Color',
                  required: true,
                  admin: {
                    description: 'Text color of the announcement'
                  },
                  defaultValue: '#000000'
                })
              ]
            },
            {
              name: 'calendar',
              type: 'group',
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
                        description: 'Google Calendar ID (found in calendar settings)'
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
                        description: 'Select icons for the calendar'
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
                    description: 'Maximum number of events to display'
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
    max: process.env.NODE_ENV === 'production' ? 20 : 2,
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
