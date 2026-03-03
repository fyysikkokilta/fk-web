import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'
import { cache } from 'react'

import { MainNavigation } from '@/payload-types'

export const getMainNavigation = cache(async function getMainNavigation(
  locale: Locale,
  req?: PayloadRequest
) {
  const payload = await getPayload({
    config: configPromise
  })

  try {
    const result = await payload.findGlobal({
      slug: 'main-navigation',
      depth: 2,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return result
  } catch (error) {
    payload.logger.error(
      `Error fetching main navigation: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return {} as MainNavigation
  }
})
