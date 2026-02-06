import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Locale } from 'next-intl'
import { getPayload } from 'payload'

import { env } from '@/env'
import { routing } from '@/i18n/routing'
import { getCurrentNewsletterNumber } from '@/utils/getNewsletterNumber'
import { formatCareerNewsForTelegram, formatWeeklyNewsForTelegram } from '@/utils/newsletters'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise
    })

    const searchParams = request.nextUrl.searchParams
    const locale = (searchParams.get('locale') || 'fi') as Locale
    const type = searchParams.get('type') || 'weekly'

    if (!routing.locales.includes(locale as Locale)) {
      return NextResponse.json({ message: 'Invalid locale' }, { status: 400 })
    }

    if (!['weekly', 'career'].includes(type)) {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
    }

    const { docs: newsletters } = await payload.find({
      collection: 'newsletters',
      where: {
        and: [
          {
            type: {
              equals: type
            }
          },
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
      return NextResponse.json({ message: `No ${type} newsletters found` }, { status: 404 })
    }

    const latestNewsletter = newsletters[0]

    const newsletterSettings = await payload.findGlobal({
      slug: 'newsletter-settings',
      locale
    })

    if (type === 'weekly') {
      if (!newsletterSettings?.weekly?.weeklyPage) {
        return NextResponse.json({ message: 'Newsletter settings not found' }, { status: 404 })
      }

      const weeklyPage = newsletterSettings.weekly.weeklyPage
      if (typeof weeklyPage === 'number') {
        return NextResponse.json(
          { message: 'Weekly page not properly configured' },
          { status: 404 }
        )
      }

      const baseUrl = `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${weeklyPage.path}`

      const telegramMessage = formatWeeklyNewsForTelegram(
        latestNewsletter.newsItems,
        latestNewsletter.newsletterNumber,
        `${newsletterSettings.weekly.titlePrefix} ${latestNewsletter.newsletterNumber}`,
        locale,
        baseUrl
      )

      return NextResponse.json({
        message: telegramMessage,
        newsletter: {
          id: latestNewsletter.id,
          title: `${newsletterSettings.weekly.titlePrefix} ${latestNewsletter.newsletterNumber}`,
          newsletterNumber: latestNewsletter.newsletterNumber,
          type: latestNewsletter.type,
          date: latestNewsletter.createdAt
        }
      })
    }

    // Career type
    if (!newsletterSettings?.career?.careerPage) {
      return NextResponse.json({ message: 'Career newsletter settings not found' }, { status: 404 })
    }

    const careerPage = newsletterSettings.career.careerPage
    if (typeof careerPage === 'number') {
      return NextResponse.json({ message: 'Career page not properly configured' }, { status: 404 })
    }

    const baseUrl = `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${careerPage.path}`

    const telegramMessage = formatCareerNewsForTelegram(
      latestNewsletter.newsItems,
      `${newsletterSettings.career.titlePrefix} ${latestNewsletter.newsletterNumber}`,
      locale,
      baseUrl
    )

    return NextResponse.json({
      message: telegramMessage,
      newsletter: {
        id: latestNewsletter.id,
        title: `${newsletterSettings.career.titlePrefix} ${latestNewsletter.newsletterNumber}`,
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
