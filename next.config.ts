import { withPayload } from '@payloadcms/next/withPayload'
import withPlaiceholder from '@plaiceholder/next'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  experimental: {
    rootParams: true
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
  headers() {
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

export default withPayload(withNextIntl(withPlaiceholder(nextConfig)), {
  devBundleServerPackages: false
})
