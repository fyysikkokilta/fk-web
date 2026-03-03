import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from 'next-intl'

export const getRedirect = cache(async (url: string, locale: Locale) => {
  const payload = await getPayload({ config: configPromise })

  const urlWithLocale = `/${locale}${url}`

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      or: [{ from: { equals: url } }, { from: { equals: urlWithLocale } }]
    }
  })

  return redirects[0]
})
