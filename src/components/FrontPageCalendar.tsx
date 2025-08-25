import { TZDate } from '@date-fns/tz'
import { addHours, format, isAfter, startOfDay } from 'date-fns'
import { fi } from 'date-fns/locale'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'

import { getCalendarEvents } from '@/lib/getCalendarEvents'
import { LandingPage } from '@/payload-types'

interface FrontPageCalendarProps {
  page: LandingPage
}

export const FrontPageCalendar = async ({ page }: FrontPageCalendarProps) => {
  const calendars = page.calendar?.calendars || []
  const maxResults = page.calendar?.maxEvents || 8
  const timeMin = startOfDay(new Date()).toISOString()

  if (calendars.length === 0) return null

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

  const events = calendarEvents
    .flat()
    .sort((a, b) => {
      const dateA = new Date(a.start?.dateTime || a.start?.date || '')
      const dateB = new Date(b.start?.dateTime || b.start?.date || '')
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, maxResults)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {events.map((event) => {
        const startDateString = event.start?.dateTime || event.start?.date
        const endDateString = event.end?.dateTime || event.end?.date
        const startDate = new TZDate(startDateString, 'Europe/Helsinki')
        const endDate = endDateString ? new TZDate(endDateString, 'Europe/Helsinki') : null

        // Check if event continues past 6 AM the next day
        const shouldShowEndDate = endDate && isAfter(endDate, addHours(startOfDay(startDate), 30))

        return (
          <div
            key={event.id}
            className="flex flex-col rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-2xl"
            style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg font-bold">{event.summary}</span>
            </div>
            <div
              // Same height as the icons
              className="mt-auto flex min-h-18 items-center justify-between"
            >
              <div>
                <div className="text-lg">
                  {format(startDate, 'd.M.')}
                  {/* If the event ends after 6 AM the next day, show the end date */}
                  {shouldShowEndDate && endDate && (
                    <span>
                      {' - '}
                      {format(endDate, 'd.M.')}
                    </span>
                  )}
                </div>
                {event.start?.dateTime && (
                  <div>
                    {format(startDate, 'HH:mm', { locale: fi })}
                    {/* If the event ends before 6 AM the next day, show the end time */}
                    {!shouldShowEndDate && endDate && (
                      <span>
                        {' - '}
                        {format(endDate, 'HH:mm', { locale: fi })}
                      </span>
                    )}
                  </div>
                )}
                {event.location && <div className="text-lg">{event.location.split(',')[0]}</div>}
              </div>
              <div>{event.icon && <DynamicIcon name={event.icon as IconName} size={72} />}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
