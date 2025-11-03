import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export default async function NewslettersLayout({
  children,
  params
}: LayoutProps<'/newsletters/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body style={{ height: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
