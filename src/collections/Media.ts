import type { CollectionConfig } from 'payload'
import { getPlaiceholder } from 'plaiceholder'

import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

import { signedIn } from '../access/signed-in'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Files',
    description: 'Upload and manage media files',
    defaultColumns: ['filename', 'alt']
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      localized: true,
      type: 'text',
      minLength: 5,
      admin: {
        description:
          'Alternative text for the image for accessibility. Should be provided in most cases. A good alt text is short, describes the image, and is not redundant.'
      }
    },
    {
      name: 'blurDataUrl',
      label: 'Blur Data URL',
      type: 'text',
      required: true,
      admin: {
        hidden: true
      }
    }
  ],
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp'
    },
    resizeOptions: {
      withoutEnlargement: true, // Don't enlarge images if they're smaller than the specified width
      fit: 'inside', // Keep the aspect ratio and don't crop the image. In other words, the image will be scaled so that it fits within the specified width and height.
      width: 2560, // Max width for images
      height: 1440 // Max height for images
    }
  },
  hooks: {
    beforeValidate: [
      async ({ req, operation, data }) => {
        if ((operation === 'create' || operation === 'update') && data && req.file) {
          const { base64 } = await getPlaiceholder(req.file.data)
          data.blurDataUrl = base64
        }
        return data
      }
    ],
    afterChange: [revalidateCollection('media')],
    afterDelete: [revalidateDeletedCollection('media')]
  }
}
