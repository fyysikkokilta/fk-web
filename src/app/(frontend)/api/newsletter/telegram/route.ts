import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Locale } from 'next-intl'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'
import { getCurrentNewsletterNumber } from '@/utils/getNewsletterNumber'
import { formatWeeklyNewsForTelegram } from '@/utils/newsletters'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise
    })

    // Get the locale from query parameters, default to 'fi'
    const searchParams = request.nextUrl.searchParams
    const locale = (searchParams.get('locale') || 'fi') as Locale

    if (!routing.locales.includes(locale as Locale)) {
      return NextResponse.json({ message: 'Invalid locale' }, { status: 400 })
    }

    // Find the latest weekly newsletter
    const { docs: newsletters } = await payload.find({
      collection: 'newsletters',
      where: {
        and: [
          {
            newsletterNumber: {
              equals: getCurrentNewsletterNumber()
            }
          },
          {
            _status: {
              equals: 'published'
            }
          }
        ]
      },
      sort: '-createdAt',
      limit: 1,
      depth: 4,
      locale
    })

    if (newsletters.length === 0) {
      return NextResponse.json({ message: 'No weekly newsletters found' }, { status: 404 })
    }

    const latestNewsletter = newsletters[0]

    // Get newsletter settings to access the weekly page
    const newsletterSettings = await payload.findGlobal({
      slug: 'newsletter-settings',
      locale
    })

    if (!newsletterSettings?.weekly?.weeklyPage) {
      return NextResponse.json({ message: 'Newsletter settings not found' }, { status: 404 })
    }

    const weeklyPage = newsletterSettings.weekly.weeklyPage
    if (typeof weeklyPage === 'number') {
      return NextResponse.json({ message: 'Weekly page not properly configured' }, { status: 404 })
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/${weeklyPage.path}`

    // Format the newsletter for Telegram
    const telegramMessage = formatWeeklyNewsForTelegram(
      latestNewsletter.newsItems,
      latestNewsletter.newsletterNumber,
      latestNewsletter.title,
      locale,
      baseUrl
    )

    return NextResponse.json({
      message: telegramMessage,
      newsletter: {
        id: latestNewsletter.id,
        title: latestNewsletter.title,
        newsletterNumber: latestNewsletter.newsletterNumber,
        type: latestNewsletter.type,
        date: latestNewsletter.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching newsletter telegram message:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
