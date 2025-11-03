import configPromise from '@payload-config'
import { render } from '@react-email/components'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'

import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import CareerNewsEmail from '@/emails/CareerNewsEmail'
import WeeklyNewsEmail from '@/emails/WeeklyNewsEmail'
import { getNewsletter } from '@/lib/getNewsletter'
import { getNewsletterSettings } from '@/lib/getNewsletterSettings'

export default async function NewsletterPage({ params }: PageProps<'/newsletters/[locale]/[id]'>) {
  const { locale, id } = await params
  const nextIntlLocale = locale as Locale
  setRequestLocale(nextIntlLocale)

  const payload = await getPayload({
    config: configPromise
  })

  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    notFound()
  }

  const newsletter = await getNewsletter(id, nextIntlLocale)

  if (!newsletter) {
    notFound()
  }

  const { weekly, career } = await getNewsletterSettings(nextIntlLocale)

  const html =
    newsletter.type === 'weekly'
      ? await render(
          <WeeklyNewsEmail
            newsletterNumber={newsletter.newsletterNumber}
            logo={weekly.logo}
            newsletters={[{ titlePrefix: weekly.titlePrefix, newsletter, locale: nextIntlLocale }]}
            footer={weekly.footer}
            locale={nextIntlLocale}
          />
        )
      : await render(
          <CareerNewsEmail
            newsletterNumber={newsletter.newsletterNumber}
            newsletters={[{ titlePrefix: career.titlePrefix, newsletter, locale: nextIntlLocale }]}
            footer={career.footer}
            locale={nextIntlLocale}
          />
        )

  return (
    <>
      <RefreshRouteOnSave />
      <iframe
        srcDoc={html}
        style={{ overflow: 'hidden', height: '100%', width: '100%' }}
        height="100%"
        width="100%"
        title="Newsletter Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </>
  )
}
