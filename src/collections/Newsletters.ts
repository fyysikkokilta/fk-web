import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  addDays,
  addHours,
  getISOWeek,
  getYear,
  isAfter,
  parse,
  parseISO,
  startOfHour
} from 'date-fns'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { publishedOrSignedIn } from '@/access/published-or-signed-in'
import { signedIn } from '@/access/signed-in'
import { env } from '@/env'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'
import type { Newsletter as NewsletterType } from '@/payload-types'

const getNextClockHour = () => {
  return startOfHour(addHours(new Date(), 1))
}

const updateReadyToSend: CollectionBeforeChangeHook<NewsletterType> = async ({
  originalDoc,
  data,
  req
}) => {
  // Skip if the document is not yet created or has already been sent or is being sent
  if (!originalDoc || originalDoc.sent || data.sent) {
    return data
  }

  // Cancel the previous job if it exists
  if (originalDoc.jobId) {
    await req.payload.jobs.cancelByID({
      id: originalDoc.jobId,
      req
    })

    data.jobId = null
  }

  const parsedSendTime = data.sendTime ? parseISO(data.sendTime) : null
  const sendTime =
    parsedSendTime && isAfter(parsedSendTime, new Date()) ? parsedSendTime : getNextClockHour()

  // If the newsletter is ready to be sent, schedule a job to send it
  if (data.readyToSend) {
    const job = await req.payload.jobs.queue({
      task: 'sendNewsletter',
      waitUntil: sendTime,
      input: {
        newsletterId: originalDoc.id
      },
      req
    })

    data.jobId = job.id
  }

  return data
}

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'newsletterNumber', 'newsItems', 'sent'],
    preview: (doc, { req }) => {
      const baseUrl = env.NEXT_PUBLIC_SERVER_URL
      const locale = typeof req.query?.locale === 'string' ? req.query.locale : req.locale || 'fi'
      return `${baseUrl}/api/draft?slug=/newsletters/${locale}/${doc.id}`
    },
    group: 'Newsletters'
  },
  access: {
    read: publishedOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description:
          'Title of the newsletter. If not set, the title will be "Kilta tiedottaa {weekNumber}/{year}" in Finnish and "Weekly News {weekNumber}/{year}" in English.'
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req: { locale } }) => {
            if (value) return value

            const newsletterNumber = data?.newsletterNumber

            if (!newsletterNumber) return value

            if (locale === 'fi') {
              return `Kilta tiedottaa ${newsletterNumber}`
            }
            return `Weekly News ${newsletterNumber}`
          }
        ]
      }
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Weekly',
          value: 'weekly'
        },
        {
          label: 'Career',
          value: 'career'
        }
      ],
      defaultValue: 'weekly',
      required: true,
      admin: {
        description: 'Type of the newsletter'
      }
    },
    {
      name: 'newsletterNumber',
      type: 'text',
      unique: true,
      defaultValue: () => {
        const date = new Date()
        const sixDaysFromNow = addDays(date, 6)
        const weekNumber = getISOWeek(sixDaysFromNow)
        const year = getYear(sixDaysFromNow)
        return `${weekNumber}/${year}`
      },
      required: true,
      admin: {
        description: 'Newsletter week number and year in format "1/25"'
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Newsletter number is required'
        const [week, year] = value.split('/')
        if (!week || !year) return 'Week and year are required'
        if (Number(week) < 1 || Number(week) > 53) return 'Week must be between 1 and 53'
        return true
      }
    },
    {
      name: 'greetings',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: [] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: []
            })
          ]
        }
      }),
      localized: true
    },
    {
      name: 'closingWords',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: [] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: []
            })
          ]
        }
      }),
      localized: true
    },
    {
      name: 'newsItems',
      type: 'relationship',
      relationTo: 'news-items',
      hasMany: true,
      admin: {
        description:
          'News items to be included in the newsletter. Only future news items are shown based on the newsletter number.'
      },
      filterOptions: ({ data }) =>
        !!data.newsletterNumber && {
          date: {
            greater_than_equal: parse(data.newsletterNumber, 'R/I', new Date())
          }
        },
      required: true,
      minRows: 1
    },
    {
      name: 'readyToSend',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Whether the newsletter is ready to be sent. The newsletter will be sent automatically when this is checked at the time specified below or the next clock hour. Unchecking will cancel the scheduled email. Remember to save the newsletter when changing this.'
      }
    },
    {
      name: 'sendTime',
      type: 'date',
      timezone: true,
      defaultValue: getNextClockHour,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd.MM.YYYY HH:mm',
          timeIntervals: env.NODE_ENV === 'production' ? 60 : 1
        },
        description:
          'The time of day to send the newsletter. Make sure the time is in the future, else it will be sent at the next clock hour.'
      }
    },
    {
      name: 'sent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Whether the newsletter has been sent',
        readOnly: env.NODE_ENV === 'production'
      }
    },
    {
      name: 'jobId',
      type: 'number',
      admin: {
        hidden: true
      }
    }
  ],
  versions: {
    maxPerDoc: env.NODE_ENV === 'production' ? 5 : 2,
    drafts: {
      autosave: {
        interval: 200
      },
      validate: true
    }
  },
  hooks: {
    beforeChange: [updateReadyToSend],
    afterChange: [revalidateCollection('newsletters')],
    afterDelete: [revalidateDeletedCollection('newsletters')]
  }
}
