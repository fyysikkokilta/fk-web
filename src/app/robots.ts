import type { MetadataRoute } from 'next'

import { env } from '@/env'

export default function robots(): MetadataRoute.Robots {
  const serverURL = env.NEXT_PUBLIC_SERVER_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/fi/fuksit-', '/en/fuksis-', '/fi/toimihenkilot', '/en/officials']
    },
    sitemap: `${serverURL}/sitemap.xml`
  }
}
