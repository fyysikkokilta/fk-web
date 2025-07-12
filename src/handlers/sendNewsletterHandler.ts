import type { TaskHandler } from 'payload'

import { renderEmail } from '@/emails/renderEmail'
import { routing } from '@/i18n/routing'
import { getNewsletter } from '@/lib/getNewsletter'
import { getNewsletterSettings } from '@/lib/getNewsletterSettings'
import { sendNewsletterToTelegram } from '@/utils/newsletters'

const sendNewsletterHandler: TaskHandler<'sendNewsletter'> = async ({ input, req }) => {
  const { newsletterId } = input

  const promises = routing.locales.map(async (locale) => {
    // Not passing req here since it breaks the localization
    const newsletter = await getNewsletter(String(newsletterId), locale)

    if (!newsletter) {
      req.payload.logger.error(`[Job] Newsletter with id ${newsletterId} not found`)
      return
    }

    // Career newsletter is only sent in English
    if (newsletter.type === 'career' && locale === 'fi') {
      return
    }

    // Not passing req here since it breaks the localization
    const { weekly, career } = await getNewsletterSettings(locale)

    // Render newsletter
    const html = await renderEmail(newsletter, weekly, career, locale)

    if (newsletter.type === 'weekly') {
      // Send newsletter to Telegram
      await sendNewsletterToTelegram(newsletter, weekly, locale)
    }

    // Send newsletter
    return req.payload.sendEmail({
      to: newsletter.type === 'weekly' ? weekly.recipientEmail : career.recipientEmail,
      subject: newsletter.title,
      html,
      locale,
      fallbackLocale: locale === 'fi' ? 'en' : 'fi',
      from: newsletter.type === 'weekly' ? weekly.senderEmail : career.senderEmail,
      req
    })
  })

  await Promise.all(promises)

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
