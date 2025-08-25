import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { env } from '@/env'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({
    config: configPromise
  })

  const pages = await payload.find({
    collection: 'pages',
    select: {
      path: true,
      updatedAt: true
    },
    where: {
      and: [
        {
          _status: {
            equals: 'published'
          }
        },
        {
          hidden: {
            equals: false
          }
        }
      ]
    },
    locale: 'all',
    limit: 10000
  })

  const landingPage = await payload.findGlobal({
    slug: 'landing-page',
    select: {
      updatedAt: true
    },
    locale: 'all'
  })

  const pageEntries = pages.docs
    .map((page) => {
      // Payload types are f*cked up :D
      const path = page.path as unknown as Record<string, string>
      return routing.locales
        .map((locale) => {
          const localizedPath = path[locale] ?? path[routing.defaultLocale]
          if (!localizedPath) {
            return null
          }

          return {
            url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${localizedPath}`,
            lastModified: page.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                routing.locales
                  .map((innerLocale) => {
                    const innerLocalizedPath = path[innerLocale] ?? path[routing.defaultLocale]

                    if (!innerLocalizedPath) {
                      return null
                    }

                    return [
                      innerLocale,
                      `${env.NEXT_PUBLIC_SERVER_URL}/${innerLocale}/${innerLocalizedPath}`
                    ]
                  })
                  .filter((item) => !!item)
              )
            }
          }
        })
        .filter((item) => !!item)
    })
    .flat()

  const landingPageEntries = routing.locales.map((locale) => ({
    url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}`,
    lastModified: landingPage.updatedAt ?? new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${env.NEXT_PUBLIC_SERVER_URL}/${locale}`])
      )
    }
  }))

  return [...pageEntries, ...landingPageEntries]
}
