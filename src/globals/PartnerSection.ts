import type { GlobalConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const PartnerSection: GlobalConfig = {
  slug: 'partner-section',
  access: {
    read: () => true,
    update: signedIn
  },
  admin: {
    group: 'Globals',
    description: 'Partner organizations and their logos'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'partners',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'link',
          type: 'text',
          required: true
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true
        }
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateGlobal('partner-section')]
  }
}
