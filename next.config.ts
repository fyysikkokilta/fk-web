import bundleAnalyzer from '@next/bundle-analyzer'
import { withPayload } from '@payloadcms/next/withPayload'
import withPlaiceholder from '@plaiceholder/next'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    clientSegmentCache: true,
    reactCompiler: true,
    turbopackPersistentCaching: true,
    useCache: true
  },
  images: {
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_SERVER_URL
        ? [new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/**`)]
        : []),
      ...(process.env.NEXT_PUBLIC_S3_PUBLIC_URL
        ? [new URL(`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/**`)]
        : [])
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
