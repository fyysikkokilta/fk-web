import type { CollectionConfig } from 'payload'

// TODO: Add user type field?
// Board should see everything
// Other should only see own forms and submissions and pages + media
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
