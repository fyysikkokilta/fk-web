import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css'

import { startOfMonth, subMonths } from 'date-fns'
import { Locale } from 'next-intl'
import { Suspense } from 'react'

import { getCalendarEvents } from '@/lib/getCalendarEvents'
import { CalendarBlock as CalendarBlockType } from '@/payload-types'

import { CalendarClient } from './CalendarClient'

interface CalendarProps {
  block: CalendarBlockType
  locale: Locale
}

export const Calendar = async ({ block, locale }: CalendarProps) => {
  const calendars = block?.calendars
  const maxResults = 500
  const timeMin = startOfMonth(subMonths(new Date(), 2)).toISOString()

  const calendarEvents = await Promise.all(
    calendars.map(async (gCal) => {
      const events = await getCalendarEvents(gCal.calendarId || '', {
        maxResults,
        timeMin
      })

      return events.map((event) => ({
        ...event,
        backgroundColor: gCal.color || '#ff8a04',
        textColor: gCal.textColor || '#ffffff',
        icon: gCal.icon?.[Math.floor(Math.random() * (gCal.icon?.length || 1))] || 'shield-question'
      }))
    })
  )

  const events = calendarEvents.flat().sort((a, b) => {
    const dateA = new Date(a.start?.dateTime || a.start?.date || '')
    const dateB = new Date(b.start?.dateTime || b.start?.date || '')
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Suspense>
      <CalendarClient events={events} locale={locale} />
    </Suspense>
  )
}
