import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'
import { cache } from 'react'

import { isDraftMode } from '../utils/draftMode'

export const getLandingPage = cache(async function getLandingPage(
  locale: Locale,
  req?: PayloadRequest
) {
  const payload = await getPayload({ config: configPromise })

  const isDraft = await isDraftMode()

  try {
    const landingPage = await payload.findGlobal({
      slug: 'landing-page',
      depth: 5,
      draft: isDraft,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return landingPage
  } catch (error) {
    payload.logger.error(
      `Error fetching landing page: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return null
  }
})
