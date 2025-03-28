import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { getPayload } from 'payload'

export async function getCachedRedirects() {
  'use cache'
  cacheTag('redirects')
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth: 4,
    limit: 0,
    pagination: false
  })

  return redirects
}
