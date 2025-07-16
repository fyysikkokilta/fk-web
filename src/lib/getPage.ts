import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import { isDraftMode } from '../utils/draftMode'

export async function getPage(path: string, locale: Locale, req?: PayloadRequest) {
  const payload = await getPayload({
    config: configPromise
  })

  const isDraft = await isDraftMode()

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        path: { equals: path },
        ...(isDraft ? {} : { hidden: { equals: false } })
      },
      depth: 5,
      draft: isDraft,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return docs[0] || null
  } catch (error) {
    payload.logger.error('Error fetching page:', error)
    return null
  }
}
