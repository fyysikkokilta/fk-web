import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  DefaultNodeTypes,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  RelationshipFeature,
  TextStateFeature,
  UploadFeature
} from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  convertLexicalToPlaintext,
  PlaintextConverters
} from '@payloadcms/richtext-lexical/plaintext'
import { s3Storage } from '@payloadcms/storage-s3'
import { Locale } from 'next-intl'
import { dirname, resolve } from 'path'
import { buildConfig, GroupField, PayloadRequest } from 'payload'
import { OAuth2Plugin } from 'payload-oauth2'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { signedIn } from './access/signed-in'
import { AlignBlock } from './blocks/Align/config'
import { BoardBlock } from './blocks/Board/config'
import { CalendarBlock } from './blocks/Calendar/config'
import { CardBlock } from './blocks/Card/config'
import { CollapsibleBlock } from './blocks/Collapsible/config'
import { CommitteeBlock } from './blocks/Committee/config'
import { CustomHTMLBlock } from './blocks/CustomHTML/config'
import { EmbedVideoBlock } from './blocks/EmbedVideo/config'
import { FormBlock } from './blocks/Form/config'
import { FuksiYearBlock } from './blocks/FuksiYear/config'
import { IconBlock } from './blocks/Icon/config'
import { NewsletterBlock } from './blocks/Newsletter/config'
import { OfficialYearBlock } from './blocks/OfficialYear/config'
import { PageNavigationBlock } from './blocks/PageNavigation/config'
import { PDFViewerBlock } from './blocks/PDFViewer/config'
import { TwoColumnsBlock } from './blocks/TwoColumns/config'
import { BoardMembers } from './collections/BoardMembers'
import { Divisions } from './collections/Divisions'
import { Documents } from './collections/Documents'
import { FuksiGroups } from './collections/FuksiGroups'
import { Fuksis } from './collections/Fuksis'
import { Media } from './collections/Media'
import { NewsItems } from './collections/NewsItems'
import { NewsItemTypes } from './collections/NewsItemTypes'
import { Newsletters } from './collections/Newsletters'
import { OfficialRoles } from './collections/OfficialRoles'
import { Officials } from './collections/Officials'
import { PageNavigations } from './collections/PageNavigations'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { env } from './env'
import { Footer } from './globals/Footer'
import { LandingPage } from './globals/LandingPage'
import { MainNavigation } from './globals/MainNavigation'
import { NewsletterSettings } from './globals/NewsletterSettings'
import { PartnerSection } from './globals/PartnerSection'
import schedulePublishHandler from './handlers/schedulePublishHandler'
import sendNewsletterHandler from './handlers/sendNewsletterHandler'
import { revalidateCollection } from './hooks/revalidateCollection'
import { revalidateDeletedCollection } from './hooks/revalidateDeletedCollection'
import { getMainNavigation } from './lib/getMainNavigation'
import { migrations } from './migrations'
import { enableCloudStorage } from './utils/enableCloudStorage'
import { enableOAuth } from './utils/enableOAuth'
import { textState } from './utils/textState'

const filename = fileURLToPath(import.meta.url)
const __dirname = dirname(filename)

const converters: PlaintextConverters<DefaultNodeTypes> = {
  link: ({ node }) => {
    return node.children
      .map((child) => {
        if (child.type === 'text' && 'text' in child) {
          return child.text as string
        }
        return ''
      })
      .filter((text) => text.length > 0)
      .join(' ')
      .trim()
  }
}

export default buildConfig({
  serverURL: env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: resolve(__dirname)
    },
    components: {
      beforeLogin: [
        {
          path: '@/components/GoogleOAuthLoginButton',
          exportName: 'GoogleOAuthLoginButton'
        }
      ],
      views: {
        CustomActions: {
          path: '/actions',
          Component: '@/views/actions/ImportView'
        }
      },
      actions: [
        {
          path: '@/views/actions/ActionsLink',
          exportName: 'ActionsLink'
        }
      ]
    },
    livePreview: {
      url: ({ collectionConfig, data, globalConfig, locale, req }) => {
        const baseUrl = env.NEXT_PUBLIC_SERVER_URL
        if (collectionConfig) {
          switch (collectionConfig.slug) {
            case Pages.slug:
              if (!data) {
                // There is no data (nor path) for new pages
                // Since the live preview is mounted for also new pages, we need to return an empty string
                return ''
              }
              return `${baseUrl}/api/draft?slug=/${locale}/${data.path}`
            case Newsletters.slug:
              if (!data) {
                // There is no data (nor id) for new newsletters
                // Since the live preview is mounted for also new newsletters, we need to return an empty string
                return ''
              }
              return `${baseUrl}/api/draft?slug=/newsletters/${locale}/${data.id}`
          }
        } else if (globalConfig) {
          switch (globalConfig.slug) {
            case LandingPage.slug:
              return `${baseUrl}/api/draft?slug=/${locale}`
          }
        }
        req.payload.logger.error('No live preview case found for collection or global')
        return ''
      },
      collections: [Pages.slug, Newsletters.slug],
      globals: [LandingPage.slug],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 414,
          height: 896
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 1024,
          height: 768
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900
        }
      ]
    },
    timezones: {
      supportedTimezones: [
        {
          label: 'Europe/Helsinki',
          value: 'Europe/Helsinki'
        }
      ],
      defaultTimezone: 'Europe/Helsinki'
    }
  },
  blocks: [
    AlignBlock,
    BoardBlock,
    CalendarBlock,
    CardBlock,
    CollapsibleBlock,
    CommitteeBlock,
    CustomHTMLBlock,
    EmbedVideoBlock,
    FormBlock,
    FuksiYearBlock,
    IconBlock,
    NewsletterBlock,
    OfficialYearBlock,
    PDFViewerBlock,
    PageNavigationBlock,
    TwoColumnsBlock
  ],
  collections: [
    BoardMembers,
    Divisions,
    Documents,
    Fuksis,
    FuksiGroups,
    Media,
    NewsItemTypes,
    NewsItems,
    Newsletters,
    OfficialRoles,
    Officials,
    Pages,
    PageNavigations,
    Users
  ],
  globals: [MainNavigation, Footer, LandingPage, PartnerSection, NewsletterSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          'align',
          'board',
          'calendar',
          'card',
          'collapsible',
          'committee',
          'custom-html',
          'embed-video',
          'form',
          'fuksi-year',
          'newsletter',
          'official-year',
          'pdf-viewer',
          'page-navigation',
          'two-columns'
        ],
        inlineBlocks: ['icon']
      }),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
      LinkFeature({
        enabledCollections: ['pages']
      }),
      RelationshipFeature({
        enabledCollections: ['pages']
      }),
      UploadFeature({
        collections: {
          [Media.slug]: {
            fields: [
              {
                name: 'caption',
                label: 'Caption',
                localized: true,
                type: 'text',
                minLength: 20,
                maxLength: 100
              }
            ]
          },
          [Documents.slug]: {
            fields: []
          }
        }
      }),
      FixedToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature({
        state: textState
      })
    ]
  }),
  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: env.DATABASE_URI || ''
    }
  }),
  email: nodemailerAdapter({
    defaultFromName: env.EMAIL_FROM_NAME,
    defaultFromAddress: env.EMAIL_FROM_ADDRESS,
    skipVerify: true,
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      }
    }
  }),
  jobs: {
    addParentToTaskLog: true,
    tasks: [
      {
        retries: 0,
        slug: 'schedulePublish',
        label: 'Schedule publish',
        handler: schedulePublishHandler
      },
      {
        retries: 0,
        slug: 'sendNewsletter',
        label: 'Send newsletter',
        inputSchema: [
          {
            name: 'newsletterId',
            type: 'number',
            required: true
          }
        ],
        handler: sendNewsletterHandler
      }
    ],
    autoRun: [
      {
        // This is for schedule publishing
        cron: '* * * * *', // Every minute
        limit: 100,
        queue: 'default'
      }
    ],
    shouldAutoRun: async (_payload) => {
      // Tell Payload if it should run jobs or not.
      // This function will be invoked each time Payload goes to pick up and run jobs.
      // If this function ever returns false, the cron schedule will be stopped.
      return true
    }
  },
  localization: {
    locales: ['fi', 'en'],
    defaultLocale: 'fi',
    fallback: true
  },
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: 1024 * 1024 * 8 // 8MB
    }
  },
  secret: env.PAYLOAD_SECRET || 'mock-value-for-ci',
  typescript: {
    outputFile: resolve(__dirname, 'payload-types.ts')
  },
  sharp,
  plugins: [
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        state: false,
        country: false,
        checkbox: true,
        number: true,
        message: true,
        date: true,
        // Maybe in the future enable this for MobilePay so that we can receive payments for membership automatically
        payment: false
      },
      redirectRelationships: [Pages.slug],
      defaultToEmail: env.FORM_BUILDER_DEFAULT_TO_EMAIL,
      beforeEmail: async (emails) => {
        return emails.map((email) => ({
          ...email,
          from: email.from || `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`
        }))
      },
      formOverrides: {
        admin: {
          group: 'Forms'
        },
        access: {
          read: signedIn,
          create: signedIn,
          update: signedIn,
          delete: signedIn
        },
        hooks: {
          afterChange: [revalidateCollection('forms')],
          afterDelete: [revalidateDeletedCollection('forms')]
        }
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms'
        },
        access: {
          read: signedIn,
          create: () => true,
          update: () => false,
          delete: signedIn
        },
        hooks: {
          afterChange: [revalidateCollection('form-submissions')],
          afterDelete: [revalidateDeletedCollection('form-submissions')]
        }
      }
    }),
    redirectsPlugin({
      collections: [Pages.slug],
      overrides: {
        access: {
          read: () => true,
          create: signedIn,
          update: signedIn,
          delete: signedIn
        },
        admin: {
          group: 'Pages'
        },
        // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  ...field.admin,
                  description:
                    'Give the path to redirect from. This should be the relative path to the page, e.g. "/kiltajarjestys" to redirect all locales or "/fi/kiltajarjestys" or "/en/kiltajarjestys" to redirect only one locale of the Kiltajärjestys page.'
                }
              }
            }
            if ('name' in field && field.name === 'to') {
              const groupField = field as GroupField
              return {
                ...field,
                fields: groupField.fields.map((field) => {
                  if ('name' in field && field.name === 'type') {
                    return {
                      ...field,
                      admin: {
                        ...field.admin,
                        description:
                          'Use a internal link to redirect to pages inside the Guild website. Otherwise, use a custom URL.'
                      }
                    }
                  }
                  return field
                })
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateCollection('redirects')],
          afterDelete: [revalidateDeletedCollection('redirects')]
        }
      }
    }),
    seoPlugin({
      collections: [Pages.slug],
      globals: [LandingPage.slug],
      uploadsCollection: 'media',
      generateTitle: async ({ doc, locale }) => {
        const mainNavigation = await getMainNavigation(locale as Locale)
        const siteName = mainNavigation.title
        if ('title' in doc) {
          const title = doc.title as string
          return `${title} - ${siteName}`
        } else {
          return siteName
        }
      },
      generateDescription: ({ doc }) => {
        const data = doc.content as unknown as SerializedEditorState
        const plainText = convertLexicalToPlaintext({ converters, data })
        const parts = plainText.split('\n')
        let description = parts[0]
        let i = 1
        while (description.length < 150 && i < parts.length) {
          const lengthAfter = description.length + parts[i].length
          if (lengthAfter > 170) {
            break
          }
          description += `\n${parts[i]}`
          i++
        }
        return description
      },
      generateImage: ({ doc }) => {
        if (doc?.bannerImage) {
          return doc.bannerImage.id || doc.bannerImage
        } else if (doc?.bannerImages?.length > 0) {
          return doc.bannerImages[0].id || doc.bannerImages[0]
        } else {
          return ''
        }
      },
      generateURL: ({ doc, locale }) => {
        if ('path' in doc) {
          return `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${doc.path}`
        } else {
          return `${env.NEXT_PUBLIC_SERVER_URL}/${locale}`
        }
      },
      tabbedUI: true
    }),
    importExportPlugin({}),
    OAuth2Plugin({
      enabled: enableOAuth(),
      strategyName: 'google',
      useEmailAsIdentity: true,
      onUserNotFoundBehavior: env.ALLOW_NON_EXISTING_USERS ? 'create' : 'error',
      serverURL: env.NEXT_PUBLIC_SERVER_URL,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorizePath: '/oauth/google',
      callbackPath: '/oauth/google/callback',
      authCollection: 'users',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      getUserInfo: async (accessToken: string, _req: PayloadRequest) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const user = await response.json()
        return { email: user.email, sub: user.sub }
      },
      successRedirect: (_req: PayloadRequest, _accessToken?: string) => {
        return '/admin'
      },
      failureRedirect: (req: PayloadRequest, err: unknown) => {
        req.payload.logger.error(err)
        return '/admin/login'
      }
    }),
    //https://payloadcms.com/posts/guides/how-to-configure-file-storage-in-payload-with-vercel-blob-r2-and-uploadthing
    s3Storage({
      enabled: enableCloudStorage(),
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: async ({ filename, prefix }) => {
            return `${env.NEXT_PUBLIC_S3_PUBLIC_URL}/${prefix}/${filename}`
          }
        },
        documents: {
          prefix: 'documents',
          generateFileURL: async ({ filename, prefix }) => {
            return `${env.NEXT_PUBLIC_S3_PUBLIC_URL}/${prefix}/${filename}`
          }
        }
      },
      bucket: env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: env.S3_SECRET || ''
        },
        region: 'auto', // Cloudflare R2 uses 'auto' as the region
        endpoint: env.S3_ENDPOINT || '',
        requestHandler: {
          httpAgent: {
            maxSockets: 300,
            keepAlive: true
          },
          httpsAgent: {
            maxSockets: 300,
            keepAlive: true
          },
          connectionTimeout: 5000,
          requestTimeout: 5000
        }
      }
    })
  ],
  graphQL: {
    schemaOutputFile: resolve(__dirname, 'generated-schema.graphql')
  }
})
