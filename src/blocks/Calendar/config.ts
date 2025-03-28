import type { Block } from 'payload'

import { ColorField } from '@/fields/ColorField'
import { IconField } from '@/fields/IconField'

export const CalendarBlock: Block = {
  slug: 'calendar',
  interfaceName: 'CalendarBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'calendars',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'calendarId',
          type: 'text',
          required: true,
          admin: {
            description: 'Google Calendar ID (found in calendar settings)'
          }
        },
        ColorField({
          name: 'color',
          label: 'Background Color',
          required: true,
          defaultValue: '#ff8a04'
        }),
        ColorField({
          name: 'textColor',
          label: 'Text Color',
          required: true,
          defaultValue: '#ffffff'
        }),
        IconField({
          name: 'icon',
          label: 'Icons',
          admin: {
            description: 'Select icons for the calendar'
          },
          hasMany: true
        })
      ]
    }
  ]
}
