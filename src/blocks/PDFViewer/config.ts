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
          label: 'Internal Documents',
          value: 'internal'
        },
        {
          label: 'External Documents',
          value: 'external'
        }
      ],
      admin: {
        description: 'Choose whether to use internal or external documents'
      }
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
      hasMany: true,
      admin: {
        description:
          'Select one or more documents. If multiple documents are selected, a dropdown will be displayed to select the document to be displayed.',
        condition: (_data, siblingData) => siblingData.type === 'internal'
      }
    },
    {
      name: 'externalDocuments',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Direct URL to PDF file. Make sure the url can be previewed in the viewer'
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title for the PDF document to be displayed'
          }
        }
      ],
      admin: {
        description:
          'Add one or more external documents. If multiple documents are selected, a dropdown will be displayed to select the document to be displayed.',
        condition: (_data, siblingData) => siblingData.type === 'external'
      }
    }
  ]
}
