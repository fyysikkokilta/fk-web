import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import { NewsletterSettings } from '@/payload-types'
import { cache } from 'react'

export const getNewsletterSettings = cache(async function getNewsletterSettings(
  locale: Locale,
  req?: PayloadRequest
) {
  const payload = await getPayload({
    config: configPromise
  })

  try {
    const result = await payload.findGlobal({
      slug: 'newsletter-settings',
      depth: 1,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return result
  } catch (error) {
    payload.logger.error(
      `Error fetching newsletter settings: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return {} as NewsletterSettings
  }
})
