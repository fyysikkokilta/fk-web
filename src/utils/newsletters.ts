import { isSameWeek, parse, parseISO } from 'date-fns'
import { Locale } from 'next-intl'

import { env } from '@/env'
import type { NewsItemType, Newsletter, NewsletterSettings, Page } from '@/payload-types'

export type NewsTypeGroup = {
  type: NewsItemType['label']
  items: Newsletter['newsItems']
}

export type NewsGroup = {
  type: NewsItemType['label']
  thisWeek: Newsletter['newsItems']
  followingWeeks: Newsletter['newsItems']
}

export const groupNewsByType = (newsItems: Newsletter['newsItems']) => {
  const groups = {} as Record<NewsItemType['value'], NewsTypeGroup>

  newsItems.forEach((item) => {
    if (!item || typeof item !== 'object' || !item.type || typeof item.type !== 'object') return

    if (!groups[item.type.value]) {
      groups[item.type.value] = {
        type: item.type.label,
        items: []
      }
    }
    groups[item.type.value].items.push(item)
  })

  return groups
}

export const groupNewsByDate = (
  newsItems: Newsletter['newsItems'],
  weeklyNumber: Newsletter['newsletterNumber']
) => {
  const weeklyDate = parse(weeklyNumber, 'I/R', new Date())
  const thisWeek: typeof newsItems = []
  const followingWeeks: typeof newsItems = []

  newsItems.forEach((item) => {
    if (!item || typeof item !== 'object' || !item.date) return
    const date = parseISO(item.date)
    if (isSameWeek(date, weeklyDate, { weekStartsOn: 1 })) {
      thisWeek.push(item)
    } else {
      followingWeeks.push(item)
    }
  })

  return { thisWeek, followingWeeks }
}

export const getLocalizedTimeframe = (timeframe: 'thisWeek' | 'followingWeeks', locale: string) => {
  if (timeframe === 'thisWeek') {
    return locale === 'fi' ? 'Tällä viikolla' : 'This week'
  }
  return locale === 'fi' ? 'Tulevilla viikoilla' : 'Following weeks'
}

export const getSectionHeading = (
  groupType: string,
  timeframe: 'thisWeek' | 'followingWeeks',
  locale: string
) => {
  const localizedTimeframe = getLocalizedTimeframe(timeframe, locale)
  return `${groupType}: ${localizedTimeframe}`
}

export function formatWeeklyNewsForTelegram(
  newsItems: Newsletter['newsItems'],
  weeklyNumber: Newsletter['newsletterNumber'],
  title: string,
  locale: Locale,
  baseUrl: string
): string {
  const groupedByType = groupNewsByType(newsItems)

  // Build the formatted string
  let formatted = `<b><u>${title}</u></b>\n\n`

  for (const category of Object.values(groupedByType)) {
    const { type, items } = category
    const { thisWeek, followingWeeks } = groupNewsByDate(items, weeklyNumber)

    formatted += `<b>${type}</b>\n`

    if (thisWeek.length > 0) {
      formatted +=
        thisWeek
          .map((item) => {
            if (typeof item === 'object') {
              return `  • ${item.title}`
            }
            return ''
          })
          .join('\n') + '\n'
    }

    if (followingWeeks.length > 0) {
      formatted +=
        followingWeeks
          .map((item) => {
            if (typeof item === 'object') {
              return `  • ${item.title}`
            }
            return ''
          })
          .join('\n') + '\n'
    }
    formatted += '\n'
  }

  // NOTE: This gets sanitized by Telegram when developing locally since baseUrl is localhost
  if (locale === 'fi') {
    formatted += `<a href="${baseUrl}">Lue viikkotiedote</a>`
  } else {
    formatted += `<a href="${baseUrl}">Read weekly news</a>`
  }

  return formatted
}

export async function sendNewsletterToTelegram(
  newsletter: Newsletter,
  newsletterSettings: NewsletterSettings['weekly'],
  locale: Locale
) {
  const { title, newsItems } = newsletter
  const { telegramChannelId, telegramBotToken, weeklyPage } = newsletterSettings

  const baseUrl = `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${(weeklyPage as Page).path}`

  const sanitizedChannelId = `@${telegramChannelId.replace('@', '')}`

  const formattedNewsletter = formatWeeklyNewsForTelegram(
    newsItems,
    newsletter.newsletterNumber,
    title,
    locale,
    baseUrl
  )

  try {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: sanitizedChannelId,
        text: formattedNewsletter,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error(error)
  }
}
