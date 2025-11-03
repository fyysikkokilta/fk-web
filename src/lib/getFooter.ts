import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import type { Footer } from '@/payload-types'

export async function getFooter(locale: Locale, req?: PayloadRequest) {
  const payload = await getPayload({
    config: configPromise
  })

  try {
    const footer = await payload.findGlobal({
      slug: 'footer',
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return footer
  } catch (error) {
    payload.logger.error(
      `Error fetching footer: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return {} as Footer
  }
}
