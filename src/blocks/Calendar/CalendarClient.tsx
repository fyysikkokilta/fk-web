'use client'

import { TZDate } from '@date-fns/tz'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { enUS, fi } from 'date-fns/locale'
import { Locale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer, Event, EventProps, View, Views } from 'react-big-calendar'

import { Link } from '@/i18n/navigation'
import type { getCalendarEvents } from '@/lib/getCalendarEvents'

type CalendarEvent = Awaited<ReturnType<typeof getCalendarEvents>>[number] & {
  backgroundColor: string
  textColor: string
}

interface BigCalendarEvent extends Event {
  id: string
  resource: CalendarEvent
}

interface CalendarClientProps {
  events: CalendarEvent[]
  locale: Locale
}

const locales = {
  fi: fi,
  en: undefined
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

function EventElement(props: EventProps<BigCalendarEvent>) {
  const event = props.event.resource
  return (
    <Link
      className="flex h-full flex-col"
      style={{
        backgroundColor: event.backgroundColor,
        color: event.textColor
      }}
      href={event.htmlLink}
    >
      <div className="leading-tight font-semibold">{props.title}</div>
      {event.location && <div className="text-sm leading-tight opacity-90">{event.location}</div>}
    </Link>
  )
}

function MonthViewEventElement(props: EventProps<BigCalendarEvent>) {
  const event = props.event.resource
  return (
    <Link
      className="flex h-full flex-col"
      style={{
        backgroundColor: event.backgroundColor,
        color: event.textColor
      }}
      href={props.event.resource.htmlLink}
    >
      {props.title}
    </Link>
  )
}

export const CalendarClient = ({ events, locale }: CalendarClientProps) => {
  const t = useTranslations()
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())

  const calendarEvents: BigCalendarEvent[] = useMemo(() => {
    return events.map((event) => {
      const start = new TZDate(event.start?.dateTime || event.start?.date || '', 'Europe/Helsinki')
      const end = new TZDate(event.end?.dateTime || event.end?.date || '', 'Europe/Helsinki')
      const isAllDay = !event.start?.dateTime

      let eventEnd = isNaN(end.getTime()) ? start : end

      // For all-day events, Google Calendar API returns exclusive end date (day after event ends)
      // We need to subtract one day to get the actual end date for react-big-calendar
      if (isAllDay && !isNaN(end.getTime())) {
        eventEnd = new TZDate(end.getTime() - 24 * 60 * 60 * 1000, 'Europe/Helsinki')
      }

      return {
        id: event.id,
        title: event.summary || '',
        start: start,
        end: eventEnd,
        allDay: isAllDay,
        resource: event
      }
    })
  }, [events])

  const messages = useMemo(
    () => ({
      date: t('calendar.date'),
      time: t('calendar.time'),
      event: t('calendar.event'),
      allDay: t('calendar.allDay'),
      week: t('calendar.week'),
      work_week: t('calendar.workWeek'),
      day: t('calendar.day'),
      month: t('calendar.month'),
      previous: t('calendar.previous'),
      next: t('calendar.next'),
      yesterday: t('calendar.yesterday'),
      tomorrow: t('calendar.tomorrow'),
      today: t('calendar.today'),
      agenda: t('calendar.agenda'),
      noEventsInRange: t('calendar.noEventsInRange'),
      showMore: (total: number) => `+${total} ${t('calendar.more')}`
    }),
    [t]
  )

  return (
    <div className="not-prose flex h-full min-h-[600px] w-full flex-col">
      <Calendar
        className="flex-1"
        view={view}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        onView={setView}
        date={date}
        onNavigate={setDate}
        culture={locale}
        popup
        showMultiDayTimes
        messages={messages}
        eventPropGetter={(event) => ({
          style: {
            '--event-bg-color': event.resource.backgroundColor,
            '--event-text-color': event.resource.textColor,
            backgroundColor: event.resource.backgroundColor,
            color: event.resource.textColor,
            borderColor: event.resource.textColor
          }
        })}
        formats={{
          weekdayFormat: (date: Date) =>
            format(date, 'cccccc', { locale: locale === 'fi' ? fi : enUS }),
          monthHeaderFormat: (date: Date) =>
            format(date, 'LLLL yyyy', { locale: locale === 'fi' ? fi : enUS }),
          dayHeaderFormat: (date: Date) =>
            format(date, 'cccc d.M.', { locale: locale === 'fi' ? fi : enUS }),
          dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${format(start, 'd.M.', { locale: locale === 'fi' ? fi : enUS })} - ${format(end, 'd.M.yyyy', { locale: locale === 'fi' ? fi : enUS })}`
        }}
        components={{
          day: {
            event: EventElement
          },
          week: {
            event: EventElement
          },
          month: {
            event: MonthViewEventElement
          }
        }}
      />
    </div>
  )
}
