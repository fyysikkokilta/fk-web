import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getRedirects() {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth: 4,
    limit: 0,
    pagination: false
  })

  return redirects
}
