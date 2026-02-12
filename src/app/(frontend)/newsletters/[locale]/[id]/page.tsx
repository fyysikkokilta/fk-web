import configPromise from '@payload-config'
import { render } from '@react-email/components'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale } from 'next/root-params'
import { getPayload } from 'payload'

import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import CareerNewsEmail from '@/emails/CareerNewsEmail'
import WeeklyNewsEmail from '@/emails/WeeklyNewsEmail'
import { getNewsletter } from '@/lib/getNewsletter'
import { getNewsletterSettings } from '@/lib/getNewsletterSettings'

export default async function NewsletterPage({ params }: PageProps<'/newsletters/[locale]/[id]'>) {
  const { id } = await params
  const curLocale = await locale()

  const payload = await getPayload({
    config: configPromise
  })

  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    notFound()
  }

  const newsletter = await getNewsletter(id, curLocale)

  if (!newsletter) {
    notFound()
  }

  const { weekly, career } = await getNewsletterSettings(curLocale)

  const html =
    newsletter.type === 'weekly'
      ? await render(
          <WeeklyNewsEmail
            newsletterNumber={newsletter.newsletterNumber}
            logo={weekly.logo}
            newsletters={[{ titlePrefix: weekly.titlePrefix, newsletter, locale: curLocale }]}
            footer={weekly.footer}
            locale={curLocale}
          />
        )
      : await render(
          <CareerNewsEmail
            newsletterNumber={newsletter.newsletterNumber}
            newsletters={[{ titlePrefix: career.titlePrefix, newsletter, locale: curLocale }]}
            footer={career.footer}
            locale={curLocale}
          />
        )

  return (
    <>
      <RefreshRouteOnSave />
      {/* oxlint-disable-next-line react/iframe-missing-sandbox */}
      <iframe
        srcDoc={html}
        style={{ overflow: 'hidden', height: '100%', width: '100%' }}
        height="100%"
        width="100%"
        title="Newsletter Preview"
      />
    </>
  )
}
