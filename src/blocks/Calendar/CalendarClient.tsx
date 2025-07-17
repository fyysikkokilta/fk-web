'use client'

import { TZDate } from '@date-fns/tz'
import { eachDayOfInterval, endOfMonth, format, getDay, startOfDay, startOfMonth } from 'date-fns'
import { fi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { Locale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { getCalendarEvents } from '@/lib/getCalendarEvents'
import { CalendarBlock as CalendarBlockType } from '@/payload-types'

type CalendarEvent = Awaited<ReturnType<typeof getCalendarEvents>>[number] & {
  backgroundColor: string
  textColor: string
  icon: CalendarBlockType['calendars'][number]['icon'][number]
}

interface CalendarClientProps {
  events: CalendarEvent[]
  locale: Locale
}

export const CalendarClient = ({ events, locale }: CalendarClientProps) => {
  const t = useTranslations()
  const today = startOfDay(new Date())
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [eventPosition, setEventPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedEvent &&
        !(event.target as HTMLElement).closest('.event-element') &&
        !(event.target as HTMLElement).closest('.event-tooltip')
      ) {
        setSelectedEvent(null)
        setEventPosition(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [selectedEvent])

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const start = new TZDate(event.start?.dateTime || event.start?.date || '', 'Europe/Helsinki')
      const end = new TZDate(event.end?.dateTime || event.end?.date || '', 'Europe/Helsinki')
      // If end is not valid, fallback to start (single-day event)
      const eventEnd = isNaN(end.getTime()) ? start : end
      // Check if the date is between start and end (inclusive)
      return (
        format(date, 'yyyy-MM-dd') >= format(start, 'yyyy-MM-dd') &&
        format(date, 'yyyy-MM-dd') <= format(eventEnd, 'yyyy-MM-dd')
      )
    })
  }

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setCurrentDate(newDate)
  }

  const handleEventHover = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setSelectedEvent(event)
    setEventPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom
    })
  }

  const handleEventLeave = (e: React.MouseEvent) => {
    // Only hide if we're not moving to the tooltip
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget?.closest('.event-tooltip')) {
      setSelectedEvent(null)
      setEventPosition(null)
    }
  }

  const handleTooltipLeave = (e: React.MouseEvent) => {
    // Only hide if we're not moving to an event element
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget?.closest('.event-element')) {
      setSelectedEvent(null)
      setEventPosition(null)
    }
  }

  const formatDateRange = (event: CalendarEvent) => {
    const startDate = new TZDate(
      event.start?.dateTime || event.start?.date || '',
      'Europe/Helsinki'
    )
    const endDate = new TZDate(event.end?.dateTime || event.end?.date || '', 'Europe/Helsinki')

    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return `${format(startDate, 'd.M.yyyy')} ${event.start?.dateTime ? format(startDate, 'HH:mm') : ''} - ${
        event.end?.dateTime ? format(endDate, 'HH:mm') : ''
      }`
    }

    return `${format(startDate, 'd.M.yyyy')} - ${format(endDate, 'd.M.yyyy')}`
  }

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startWeekday = getDay(monthStart)
    const weekDays =
      locale === 'fi'
        ? ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
      <div className="grid grid-cols-7 gap-px rounded-xl p-2 shadow-lg">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-fk-gray-lightest rounded-lg border-2 p-2 text-center font-semibold"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: startWeekday !== 0 ? startWeekday - 1 : 6 }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          const isWeekend = [6, 0].includes(getDay(day)) // Saturday=6, Sunday=0 (date-fns getDay)

          return (
            <div
              key={day.toString()}
              className={`border-fk-gray-lightest rounded-lg border p-2 shadow-sm transition md:min-h-[120px] ${isToday ? 'bg-fk-gray-lightest' : isWeekend ? 'bg-fk-yellow-light' : 'bg-fk-white'} hover:bg-fk-yellow`}
            >
              <div className="mb-1 font-medium">{format(day, 'd')}</div>
              <div className="space-y-1">
                {/* Desktop view */}
                <div className="hidden space-y-1 md:block">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="event-element group relative cursor-pointer truncate rounded p-1 text-sm hover:opacity-90"
                      style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleEventLeave}
                    >
                      {event.start?.dateTime &&
                        format(new TZDate(event.start.dateTime, 'Europe/Helsinki'), 'HH:mm')}{' '}
                      {event.summary}
                    </div>
                  ))}
                </div>

                {/* Mobile view */}
                <div className="flex flex-wrap gap-1 md:hidden">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="event-element h-2 w-2 rounded-full"
                      style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                      onClick={(e) => handleEventHover(event, e)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => handleMonthChange(-1)}
          className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark border-fk-yellow-dark cursor-pointer rounded-full border p-2 shadow transition"
          aria-label={t('calendar.previousMonth')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-fk-black text-3xl font-extrabold tracking-tight">
          {format(currentDate, 'LLLL yyyy', { locale: fi })}
        </span>
        <button
          onClick={() => handleMonthChange(1)}
          className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark border-fk-yellow-dark cursor-pointer rounded-full border p-2 shadow transition"
          aria-label={t('calendar.nextMonth')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {renderCalendarGrid()}

      {/* Event tooltip */}
      {selectedEvent && eventPosition && (
        <div
          className="event-tooltip bg-fk-white fixed z-50 max-w-sm rounded-lg p-4 shadow-lg"
          style={{
            ...(eventPosition.x > window.innerWidth / 2
              ? { right: window.innerWidth - eventPosition.x }
              : { left: eventPosition.x }),
            top: eventPosition.y
          }}
          onMouseLeave={handleTooltipLeave}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedEvent.summary}</span>
          </div>
          <p className="mb-2 text-sm">{formatDateRange(selectedEvent)}</p>
          {selectedEvent.location && (
            <p className="text-fk-gray-lightest text-sm">{selectedEvent.location}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <a href={selectedEvent.htmlLink ?? undefined} className="text-fk-gray-light text-sm">
              {t('calendar.google')}
            </a>
            <div>
              {selectedEvent.icon && (
                <DynamicIcon name={selectedEvent.icon as IconName} size={48} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
