import '../globals.css'

import { notFound } from 'next/navigation'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'

import { lora, sourceSans3 } from '@/app/fonts'
import { Footer } from '@/components/Footer'
import { MainNavigation } from '@/components/MainNavigation'
import { SkipLink } from '@/components/SkipLink'
import { routing } from '@/i18n/routing'
import { getFooter } from '@/lib/getFooter'
import { getMainNavigation } from '@/lib/getMainNavigation'

export default async function RootLayout({
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

  const navigation = await getMainNavigation(locale)
  const footer = await getFooter(locale)

  console.info('[Next.js] Rendering layout', `/${locale}`)

  return (
    <html
      lang={locale}
      className={`${sourceSans3.variable} ${sourceSans3.className} ${lora.variable} scroll-pt-4 scroll-smooth`}
    >
      <body>
        <main className="flex flex-1 flex-shrink-0 flex-col items-center overflow-x-hidden">
          <NextIntlClientProvider>
            <NextTopLoader color="#fbdb1d" showSpinner={false} showForHashAnchor={false} />
            <SkipLink />
            <MainNavigation navigation={navigation} />
            {children}
            <Footer footer={footer} locale={locale} />
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  )
}
