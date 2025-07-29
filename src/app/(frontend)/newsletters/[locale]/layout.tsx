import { notFound } from 'next/navigation'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

import { routing } from '@/i18n/routing'

export default async function NewslettersLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  console.info('[Next.js] Rendering layout', `/newsletters/${locale}`)

  return (
    <html lang={locale}>
      <body style={{ height: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
