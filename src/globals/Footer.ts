import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: signedIn
  },
  admin: {
    group: 'Globals',
    description: 'Footer content. This is the content that is shown in the footer of the website.'
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: [] }),
            BlocksFeature({
              blocks: [],
              inlineBlocks: ['icon']
            })
          ]
        }
      }),
      localized: true,
      required: true,
      admin: {
        description:
          'The main content of the footer (address, contact info, etc.). Remember to provide all locales.'
      }
    },
    {
      name: 'socials',
      type: 'text',
      hasMany: true,
      localized: true,
      admin: {
        description:
          'Social media links. Add the link to the social media profile/page and the correct icon will be automatically added. Remember to provide all locales.'
      }
    }
  ],
  hooks: {
    afterChange: [revalidateGlobal('footer')]
  }
}
