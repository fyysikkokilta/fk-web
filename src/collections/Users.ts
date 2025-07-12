import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Users'
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true
  },
  fields: []
}
