import { notFound } from 'next/navigation'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

import { lora, sourceSans3 } from '@/app/fonts'
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
    <html
      lang={locale}
      className={`${sourceSans3.variable} ${sourceSans3.className} ${lora.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
