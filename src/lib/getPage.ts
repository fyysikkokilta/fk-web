import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import { isDraftMode } from '../utils/draftMode'

export async function getPage(path: string, locale: Locale, req?: PayloadRequest) {
  const payload = await getPayload({
    config: configPromise
  })

  const isDraft = await isDraftMode()

  const { docs: pathDocs } = await payload.find({
    collection: 'pages',
    select: {
      path: true
    },
    where: {
      path: { equals: path },
      ...(isDraft ? {} : { hidden: { equals: false } })
    },
    draft: isDraft,
    locale: 'all',
    req
  })

  if (pathDocs.length === 0) {
    return { page: null, canonicalPath: null }
  }

  const paths = pathDocs[0].path as unknown as Record<string, string | null>
  const canonicalPath = paths[locale] ?? null
  const isPageAvailableForLocale = !!paths[locale]
  const pathToUse = isPageAvailableForLocale ? paths[locale] : paths[locale === 'fi' ? 'en' : 'fi']

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        path: { equals: pathToUse },
        ...(isDraft ? {} : { hidden: { equals: false } })
      },
      depth: 5,
      draft: isDraft,
      locale: isPageAvailableForLocale ? locale : locale === 'fi' ? 'en' : 'fi',
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return { page: docs[0] || null, canonicalPath }
  } catch (error) {
    payload.logger.error(
      `Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return { page: null, canonicalPath: null }
  }
}
