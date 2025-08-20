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

  const html = await renderEmail(newsletter, weekly, career, nextIntlLocale)

  console.info(
    '[Next.js] Rendering newsletter preview page',
    `/newsletters/${nextIntlLocale}/${id}`
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
