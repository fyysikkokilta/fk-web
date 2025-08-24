import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

import { admin } from '@/access/admin'

export const NewsletterSettings: GlobalConfig = {
  slug: 'newsletter-settings',
  access: {
    read: admin,
    update: admin
  },
  admin: {
    group: 'Newsletters',
    description: 'Settings for the weekly and career newsletters'
  },
  typescript: {
    interface: 'NewsletterSettings'
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Weekly',
          name: 'weekly',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Logo to be used in the weekly newsletter'
              }
            },
            {
              name: 'titlePrefix',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description:
                  'Prefix for the title of the weekly newsletter. For example: "Kilta tiedottaa" or "Weekly News"'
              }
            },
            {
              name: 'footer',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                    BlocksFeature({
                      blocks: [],
                      inlineBlocks: []
                    })
                  ]
                }
              }),
              localized: true,
              admin: {
                description:
                  'Footer text for the weekly newsletter. This will shown below the closing words in the newsletter email. This is not shown in the Newsletter block.'
              }
            },
            {
              name: 'senderEmail',
              type: 'email',
              required: true,
              admin: {
                description:
                  'Sender email for the weekly newsletter. This is the email address that will be shown in the newsletter email.'
              }
            },
            {
              name: 'recipientEmail',
              type: 'email',
              required: true,
              localized: true,
              admin: {
                description:
                  'Recipient email for the weekly newsletter. This is the email address that will receive the newsletter email. Google groups should be configured to allow emails from Mailgun.'
              }
            },
            {
              name: 'weeklyPage',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
              admin: {
                description: 'Weekly page for the newsletter. Linked to the Telegram message.'
              }
            },
            {
              name: 'telegramBotToken',
              type: 'text',
              required: true,
              admin: {
                description: 'Telegram bot token for the newsletter. Get it from @BotFather'
              }
            },
            {
              name: 'telegramChannelId',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Telegram channel name for the newsletter. For example: @fktieto'
              }
            }
          ]
        },
        {
          label: 'Career',
          name: 'career',
          fields: [
            {
              name: 'titlePrefix',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Prefix for the title of the career newsletter. For example: "Career News"'
              }
            },
            {
              name: 'footer',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                    BlocksFeature({
                      blocks: [],
                      inlineBlocks: []
                    })
                  ]
                }
              }),
              admin: {
                description: 'Footer text for the career newsletter'
              }
            },
            {
              name: 'senderEmail',
              type: 'email',
              required: true,
              admin: {
                description: 'Sender email for the career newsletter'
              }
            },
            {
              name: 'recipientEmail',
              type: 'email',
              required: true,
              admin: {
                description:
                  'Recipient email for the career newsletter. This is the email address that will receive the newsletter email. Google groups should be configured to allow emails from Mailgun.'
              }
            }
          ]
        }
      ]
    }
  ]
}
