import { env } from '@/env'

export const getCalendarEvents = async (
  calendarId: string,
  options: {
    maxResults: number
    timeMin: string
  }
) => {
  const searchParams = new URLSearchParams()
  searchParams.set('orderBy', 'startTime')
  searchParams.set('singleEvents', 'true')
  searchParams.set('timeMin', options.timeMin)
  searchParams.set('maxResults', String(options.maxResults))
  searchParams.set('key', env.GOOGLE_API_KEY || '')

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${searchParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        Referer: env.NEXT_PUBLIC_SERVER_URL
      },
      next: {
        revalidate: 60 * 60 // 1 hour
      }
    })
    const data = await response.json()

    return data.items as {
      id: string
      htmlLink: string
      summary: string
      description: string
      location: string
      start: {
        date: string
        dateTime: string
      }
      end: {
        date: string
        dateTime: string
      }
    }[]
  } catch (error) {
    console.error(
      `Error fetching calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return []
  }
}
