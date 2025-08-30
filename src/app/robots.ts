import type { MetadataRoute } from 'next'

import { env } from '@/env'

export default function robots(): MetadataRoute.Robots {
  const serverURL = env.NEXT_PUBLIC_SERVER_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin'
    },
    sitemap: `${serverURL}/sitemap.xml`
  }
}
