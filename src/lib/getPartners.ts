import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import configPromise from '@payload-config'

export async function getPartners(locale: Locale, req?: PayloadRequest) {
  const payload = await getPayload({
    config: configPromise
  })

  try {
    const partnerData = await payload.findGlobal({
      slug: 'partner-section',
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return partnerData
  } catch (error) {
    payload.logger.error(
      `Error fetching partners: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return null
  }
}
