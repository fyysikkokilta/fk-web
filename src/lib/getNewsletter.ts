import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import { isDraftMode } from '../utils/draftMode'

export async function getNewsletter(id: string | number, locale: Locale, req?: PayloadRequest) {
  const payload = await getPayload({ config: configPromise })

  const isDraft = await isDraftMode()

  try {
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 4,
      draft: isDraft,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return newsletter
  } catch (error) {
    payload.logger.error(
      `Error fetching newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return null
  }
}
