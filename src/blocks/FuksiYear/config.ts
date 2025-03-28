import type { Block } from 'payload'

export const FuksiYearBlock: Block = {
  slug: 'fuksi-year',
  interfaceName: 'FuksiYearBlock',
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'The fuksi year to display. Purely to filter divisions from correct year.'
      }
    },
    {
      name: 'fuksiGroups',
      type: 'relationship',
      relationTo: 'fuksi-groups',
      hasMany: true,
      filterOptions: ({ blockData }) => ({
        year: {
          equals: blockData?.year
        }
      }),
      admin: {
        description: 'Select the fuksi groups to display'
      }
    },
    {
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Select a default image to display there is no image for the fuksi'
      }
    }
  ]
}
