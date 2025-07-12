import type { Block } from 'payload'

import { ColorField } from '@/fields/ColorField'

export const OfficialYearBlock: Block = {
  slug: 'official-year',
  interfaceName: 'OfficialYearBlock',
  fields: [
    {
      name: 'divisions',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Show officials from a specified divisions'
      },
      fields: [
        {
          name: 'division',
          type: 'relationship',
          relationTo: 'divisions',
          required: true,
          // Select appearance doesn't select the relationship field, which causes the admin not to show the name of the official roles
          // In drawer appearance, this isn't the case
          admin: {
            appearance: 'drawer',
            description: 'Select the division to show officials from'
          }
        },
        ColorField({
          name: 'backgroundColor',
          label: 'Background Color',
          admin: {
            description: 'Select the background color for the division'
          }
        }),
        ColorField({
          name: 'textColor',
          label: 'Text Color',
          admin: {
            description: 'Select the text color for the division'
          }
        })
      ]
    },
    {
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Select a default image to display there is no image for the official'
      }
    }
  ]
}
