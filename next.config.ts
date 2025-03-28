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
    reactCompiler: true,
    useCache: true,
    serverActions: {
      allowedOrigins: [
        'localhost:8010',
        'localhost:3000',
        (process.env.NEXT_PUBLIC_SERVER_URL || 'fyysikkokilta.fi').replace(/^https?:\/\//, '')
      ]
    }
  },
  images: {
    formats: ['image/avif'],
    remotePatterns: [
      {
        hostname: '**'
      }
    ]
  },
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
