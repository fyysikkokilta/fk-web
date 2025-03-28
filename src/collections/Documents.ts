import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'filename',
    group: 'Files',
    description: 'Upload and manage PDF files'
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  upload: {
    staticDir: 'public/documents',
    mimeTypes: ['application/pdf']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      admin: {
        description: 'Upload a thumbnail image for the document'
      }
    }
  ],
  hooks: {
    afterChange: [revalidateCollection('documents')],
    afterDelete: [revalidateDeletedCollection('documents')]
  }
}
