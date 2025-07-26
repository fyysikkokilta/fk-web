import type { Block } from 'payload'

export const PDFViewerBlock: Block = {
  slug: 'pdf-viewer',
  interfaceName: 'PDFViewerBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'internal',
      options: [
        {
          label: 'Internal Document',
          value: 'internal'
        },
        {
          label: 'External URL',
          value: 'external'
        }
      ],
      admin: {
        description: 'Choose whether to use an internal document or external URL'
      }
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
      admin: {
        description: 'Select a document to display (required when type is internal)',
        condition: (_data, siblingData) => siblingData.type === 'internal'
      }
    },
    {
      name: 'directUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Direct URL to PDF file (required when type is external)',
        condition: (_data, siblingData) => siblingData.type === 'external'
      }
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for the PDF viewer (optional, will use document title if available)',
        condition: (_data, siblingData) => siblingData.type === 'external'
      }
    }
  ]
}
