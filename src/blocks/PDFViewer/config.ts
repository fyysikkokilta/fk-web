import type { Block } from 'payload'

export const PDFViewerBlock: Block = {
  slug: 'pdf-viewer',
  interfaceName: 'PDFViewerBlock',
  fields: [
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
      admin: {
        description: 'Select a document to display'
      }
    }
  ]
}
