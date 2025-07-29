'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css'

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
      <style jsx global>{`
        :root {
          --guild-yellow: #fbdb1d;
          --guild-black: #201e1e;
          --guild-white: #ffffff;
          --guild-yellow-light: #fffbf0;
          --guild-gray-light: #f8f9fa;

          --calendar-primary: var(--guild-yellow);
          --calendar-secondary: var(--guild-black);
          --calendar-background: var(--guild-white);
          --calendar-border: var(--guild-black);
          --calendar-grid-line: var(--guild-black);
          --calendar-hover: var(--guild-yellow-light);
          --calendar-off-range: var(--guild-gray-light);
        }

        .rbc-calendar {
          height: 100%;
          min-height: 500px;
          flex: 1;
          background: var(--calendar-background);
          border-radius: 8px;
          font-family: inherit;
          color: var(--calendar-secondary);
        }

        .rbc-header {
          background: var(--calendar-primary);
          color: var(--calendar-secondary);
          border-bottom: 2px solid var(--calendar-border);
          padding: 12px 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rbc-header + .rbc-header {
          border-left: 1px solid var(--calendar-grid-line);
        }

        .rbc-month-view {
          border: 3px solid var(--calendar-border);
          border-radius: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--calendar-background);
        }

        .rbc-month-row {
          flex: 1;
          min-height: fit-content;
          display: flex;
          flex-direction: column;
        }

        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid var(--calendar-grid-line);
        }

        .rbc-row-content {
          position: relative;
          flex: 1;
          min-height: 120px;
        }

        .rbc-row-bg {
          display: flex;
          flex: 1;
          min-height: 120px;
        }

        .rbc-date-cell {
          padding: 8px 8px 4px 8px;
          border-right: 1px solid var(--calendar-grid-line);
          background-color: var(--calendar-primary);
          height: fit-content;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .rbc-date-cell .rbc-date-cell-content {
          flex: 1;
          min-height: 0;
        }

        .rbc-date-cell.rbc-off-range {
          color: #999;
        }

        .rbc-today {
          background: var(--calendar-primary) !important;
          color: var(--calendar-secondary) !important;
          font-weight: 700;
        }

        .rbc-event {
          background: var(--event-bg-color, var(--calendar-primary));
          color: var(--event-text-color, var(--calendar-secondary));
          border: 1px solid var(--event-text-color, var(--calendar-secondary));
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.2;
          min-height: 50px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .rbc-month-view .rbc-event {
          font-size: 14px;
          min-height: 28px;
          padding: 2px 6px;
          margin: 1px 0;
          line-height: 1.3;
        }

        .rbc-month-view .rbc-row-segment {
          padding: 0 1px 2px 1px;
        }

        .rbc-month-view .rbc-event-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rbc-toolbar {
          margin-bottom: 16px;
          padding: 16px;
          background: var(--calendar-primary);
          color: var(--calendar-secondary);
          border: 2px solid var(--calendar-border);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .rbc-btn-group {
          display: flex;
          gap: 8px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .rbc-btn-group button {
          padding: 8px 12px;
          border: 2px solid var(--calendar-border);
          background: transparent;
          color: var(--calendar-secondary);
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .rbc-btn-group button:hover {
          background: var(--calendar-secondary);
          color: var(--calendar-primary);
        }

        .rbc-btn-group button.rbc-active,
        .rbc-active {
          background: var(--calendar-secondary) !important;
          color: var(--calendar-primary) !important;
        }

        .rbc-toolbar-label {
          font-size: 20px;
          font-weight: 700;
          color: var(--calendar-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex: 1;
          text-align: center;
        }

        .rbc-agenda-view {
          border: 2px solid var(--calendar-border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--calendar-background);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .rbc-agenda-view table.rbc-agenda-table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }

        .rbc-agenda-view .rbc-agenda-table thead > tr > th {
          background: var(--calendar-primary);
          color: var(--calendar-secondary);
          border-bottom: 2px solid var(--calendar-border);
          padding: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .rbc-agenda-view .rbc-agenda-table tbody > tr > td {
          padding: 12px;
          border-bottom: 1px solid var(--calendar-grid-line);
          background: var(--calendar-background);
        }

        .rbc-agenda-view .rbc-agenda-table tbody > tr:hover > td {
          background: var(--calendar-hover);
        }

        .rbc-show-more {
          background: var(--calendar-primary) !important;
          color: var(--calendar-secondary) !important;
          border: 1px solid var(--calendar-border) !important;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rbc-show-more:hover {
          background: var(--calendar-secondary) !important;
          color: var(--calendar-primary) !important;
        }

        .rbc-time-view {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--calendar-background);
          border: 3px solid var(--calendar-border);
          border-radius: 8px;
          overflow: hidden;
        }

        .rbc-time-header {
          display: flex;
          flex: 0 0 auto;
        }

        .rbc-time-header .rbc-header {
          border-bottom: 2px solid var(--calendar-grid-line);
        }

        .rbc-time-content {
          flex: 1;
          display: flex;
          border-top: 2px solid var(--calendar-grid-line);
          overflow-y: auto;
        }

        .rbc-time-gutter {
          background: var(--calendar-background);
          border-right: 1px solid var(--calendar-grid-line);
        }

        .rbc-time-slot {
          border-top: 1px solid var(--calendar-grid-line);
          background: var(--calendar-background);
        }

        .rbc-timeslot-group {
          border-bottom: 1px solid var(--calendar-grid-line);
        }

        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid var(--calendar-grid-line);
        }

        .rbc-current-time-indicator {
          background-color: var(--calendar-primary);
          height: 2px;
          box-shadow: 0 1px 3px rgba(251, 219, 29, 0.5);
        }

        .rbc-now {
          color: var(--calendar-secondary);
          font-weight: 700;
        }

        .rbc-off-range-bg {
          background: var(--calendar-off-range);
        }

        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid var(--calendar-grid-line);
        }

        .rbc-day-bg {
          flex: 1;
        }

        @media (max-width: 768px) {
          .rbc-toolbar {
            flex-direction: column;
            gap: 12px;
          }

          .rbc-toolbar-label {
            order: -1;
            margin-bottom: 8px;
          }
        }

        @media (max-height: 700px) {
          .rbc-event {
            min-height: 35px;
            font-size: 16px;
          }

          .rbc-month-view .rbc-event {
            font-size: 12px;
            min-height: 24px;
            padding: 1px 4px;
          }

          .rbc-row-content,
          .rbc-row-bg {
            min-height: 100px;
          }
        }

        @media (max-width: 640px) {
          .rbc-month-view .rbc-event {
            font-size: 11px;
            min-height: 20px;
            padding: 1px 3px;
          }

          .rbc-row-content,
          .rbc-row-bg {
            min-height: 80px;
          }
        }
      `}</style>

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
