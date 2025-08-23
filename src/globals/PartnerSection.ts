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
      localized: true,
      admin: {
        description: 'The title of the partner section.'
      }
    },
    {
      name: 'partners',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'The name of the partner organization.'
          }
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: {
            description: 'The URL of the partner organization.'
          }
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'The logo of the partner organization.'
          }
        }
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateGlobal('partner-section')]
  }
}
