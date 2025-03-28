import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'

import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { renderEmail } from '@/emails/renderEmail'
import { getNewsletter } from '@/lib/getNewsletter'
import { getNewsletterSettings } from '@/lib/getNewsletterSettings'

export default async function NewsletterPage({
  params
}: {
  params: Promise<{ locale: Locale; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const payload = await getPayload({
    config: configPromise
  })

  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    notFound()
  }

  const newsletter = await getNewsletter(id, locale)

  if (!newsletter) {
    notFound()
  }

  const { weekly, career } = await getNewsletterSettings(locale)

  const html = await renderEmail(newsletter, weekly, career, locale)

  console.info('[Next.js] Rendering newsletter preview page', `/newsletters/${locale}/${id}`)

  return (
    <>
      <RefreshRouteOnSave />
      <div
        className="flex w-full flex-col items-center justify-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
