'use cache'

import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  cacheTag('sitemap')
  const payload = await getPayload({
    config: configPromise
  })

  const pages = await payload.find({
    collection: 'pages',
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
    locale: 'all'
  })

  const landingPage = await payload.findGlobal({
    slug: 'landing-page',
    locale: 'all'
  })

  const pageEntries = pages.docs
    .map((page) => {
      // Payload types are f*cked up :D
      const path = page.path as unknown as Record<string, string>
      return routing.locales
        .map((locale) => {
          const localizedPath = path[locale]
          if (!localizedPath) {
            return null
          }

          return {
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/${localizedPath}`,
            lastModified: page.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                routing.locales.map((innerLocale) => [
                  innerLocale,
                  `${process.env.NEXT_PUBLIC_SERVER_URL}/${innerLocale}/${localizedPath}`
                ])
              )
            }
          }
        })
        .filter((item) => item !== null)
    })
    .flat()

  const landingPageEntry = {
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    lastModified: landingPage.updatedAt ?? new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}`])
      )
    }
  }

  return [...pageEntries, landingPageEntry]
}
