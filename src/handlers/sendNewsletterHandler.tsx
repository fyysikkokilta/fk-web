import { render } from '@react-email/components'
import type { TaskHandler } from 'payload'

import CareerNewsEmail from '@/emails/CareerNewsEmail'
import WeeklyNewsEmail from '@/emails/WeeklyNewsEmail'
import { getNewsletter } from '@/lib/getNewsletter'
import { getNewsletterSettings } from '@/lib/getNewsletterSettings'
import { sendNewsletterToTelegram } from '@/utils/newsletters'

const sendNewsletterHandler: TaskHandler<'sendNewsletter'> = async ({ input, req }) => {
  const { newsletterId } = input

  const finnishNewsletter = await getNewsletter(String(newsletterId), 'fi')
  const englishNewsletter = await getNewsletter(String(newsletterId), 'en')

  if (!finnishNewsletter || !englishNewsletter) {
    req.payload.logger.error(`[Job] Newsletter with id ${newsletterId} not found`)
    return {
      output: {}
    }
  }

  if (finnishNewsletter.type === 'weekly') {
    const { weekly: finnishWeeklySettings } = await getNewsletterSettings('fi')
    const { weekly: englishWeeklySettings } = await getNewsletterSettings('en')

    // Send newsletter to Telegram
    await sendNewsletterToTelegram(finnishNewsletter, finnishWeeklySettings, 'fi')
    await sendNewsletterToTelegram(englishNewsletter, englishWeeklySettings, 'en')

    // Generate newsletter HTML for Finnish list members
    const combinedHtml = await render(
      <WeeklyNewsEmail
        title={`${finnishWeeklySettings.titlePrefix} ${englishWeeklySettings.titlePrefix} ${finnishNewsletter.newsletterNumber}`}
        logo={finnishWeeklySettings.logo}
        newsletters={[
          { newsletter: finnishNewsletter, locale: 'fi' },
          { newsletter: englishNewsletter, locale: 'en' }
        ]} // We send a combined newsletter in both languages currently to Finnish list members
        footer={finnishWeeklySettings.footer}
        locale="fi"
      />
    )

    // Send newsletter to Finnish list members (combined newsletter)
    await req.payload.sendEmail({
      to: finnishWeeklySettings.recipientEmail,
      subject: `${finnishWeeklySettings.titlePrefix} / ${englishWeeklySettings.titlePrefix} ${finnishNewsletter.newsletterNumber}`,
      html: combinedHtml,
      locale: 'fi',
      fallbackLocale: 'en',
      from: finnishWeeklySettings.senderEmail,
      req
    })

    // Generate newsletter HTML for English list members
    const englishHtml = await render(
      <WeeklyNewsEmail
        title={`${englishWeeklySettings.titlePrefix} ${englishNewsletter.newsletterNumber}`}
        logo={englishWeeklySettings.logo}
        newsletters={[{ newsletter: englishNewsletter, locale: 'en' }]}
        footer={englishWeeklySettings.footer}
        locale="en"
      />
    )

    // Send newsletter to English list members
    await req.payload.sendEmail({
      to: englishWeeklySettings.recipientEmail,
      subject: `${englishWeeklySettings.titlePrefix} ${englishNewsletter.newsletterNumber}`,
      html: englishHtml,
      locale: 'en',
      fallbackLocale: 'fi',
      from: englishWeeklySettings.senderEmail,
      req
    })
  } else {
    // Send career newsletter
    const { career: englishCareerSettings } = await getNewsletterSettings('en')

    // Generate career newsletter HTML
    const html = await render(
      <CareerNewsEmail
        title={`${englishCareerSettings.titlePrefix} ${englishNewsletter.newsletterNumber}`}
        newsletters={[{ newsletter: englishNewsletter, locale: 'en' }]} // We only have English career newsletters currently
        footer={englishCareerSettings.footer}
        locale="en"
      />
    )

    // Send career newsletter to English list members
    await req.payload.sendEmail({
      to: englishCareerSettings.recipientEmail,
      subject: `${englishCareerSettings.titlePrefix} ${englishNewsletter.newsletterNumber}`,
      html,
      locale: 'en',
      fallbackLocale: 'fi',
      from: englishCareerSettings.senderEmail,
      req
    })
  }

  await req.payload.update({
    collection: 'newsletters',
    id: newsletterId,
    data: {
      sent: true
    },
    req
  })

  req.payload.logger.info(`[Job] Send newsletter completed`)

  return {
    output: {}
  }
}

export default sendNewsletterHandler
