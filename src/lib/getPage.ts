import configPromise from '@payload-config'
import { Locale } from 'next-intl'
import { getPayload, PayloadRequest } from 'payload'

import { redirect } from '@/i18n/navigation'

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
    return null
  }

  const paths = pathDocs[0].path as unknown as Record<Locale, string | null>
  const wantedPath = paths[locale]

  // If the localization of the path is not the same as the requested path, redirect to the correct path
  // Do not redirect if the path is not localized
  // This seems to cause a blank page to be shown when developing, but it works fast in production
  if (wantedPath && wantedPath !== path) {
    redirect({
      href: wantedPath,
      locale
    })
  }

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        path: { equals: path },
        ...(isDraft ? {} : { hidden: { equals: false } })
      },
      depth: 5,
      draft: isDraft,
      // If the path is not localized, use the other locale
      // Native fallback locale doesn't work here
      locale: wantedPath ? locale : locale === 'fi' ? 'en' : 'fi',
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      req
    })

    return docs[0] || null
  } catch (error) {
    payload.logger.error('Error fetching page:', error)
    return null
  }
}
