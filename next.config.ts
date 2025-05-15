import bundleAnalyzer from '@next/bundle-analyzer'
import { withPayload } from '@payloadcms/next/withPayload'
import withPlaiceholder from '@plaiceholder/next'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import { env } from '@/env'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: env.ANALYZE
})

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    reactCompiler: true,
    useCache: true
  },
  images: {
    remotePatterns: [
      new URL(`${env.NEXT_PUBLIC_SERVER_URL}/**`),
      ...(env.NEXT_PUBLIC_S3_PUBLIC_URL ? [new URL(`${env.NEXT_PUBLIC_S3_PUBLIC_URL}/**`)] : [])
    ]
  },
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no'
          }
        ]
      }
    ]
  }
}

export default withPayload(withBundleAnalyzer(withNextIntl(withPlaiceholder(nextConfig))), {
  devBundleServerPackages: false
})
