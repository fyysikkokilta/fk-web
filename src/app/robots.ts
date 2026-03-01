import type { MetadataRoute } from 'next'

import { env } from '@/env'
import { routing } from '@/i18n/routing'

export default function robots(): MetadataRoute.Robots {
  const serverURL = env.NEXT_PUBLIC_SERVER_URL

  const allowedPaths = routing.locales.map((locale) => `/${locale}`)

  return {
    rules: {
      userAgent: '*',
      disallow: ['/*'],
      allow: ['/$', ...allowedPaths, '/sitemap.xml']
    },
    sitemap: `${serverURL}/sitemap.xml`
  }
}
