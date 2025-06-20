import { compress } from 'compress-pdf'
import { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'
import { revalidateCollection } from '@/hooks/revalidateCollection'
import { revalidateDeletedCollection } from '@/hooks/revalidateDeletedCollection'

export const Documents: CollectionConfig = {
  slug: 'documents',
  folders: true,
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
    beforeOperation: [
      async ({ req, operation }) => {
        if (['create', 'update'].includes(operation) && req.file) {
          const compressedBuffer = await compress(req.file.data)
          req.file.data = compressedBuffer
          req.file.size = compressedBuffer.length
        }
      }
    ],
    afterChange: [revalidateCollection('documents')],
    afterDelete: [revalidateDeletedCollection('documents')]
  }
}
