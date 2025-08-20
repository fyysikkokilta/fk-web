import '../globals.css'

import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'

import { lora, sourceSans3 } from '@/app/fonts'
import { Footer } from '@/components/Footer'
import { MainNavigation } from '@/components/Navigation'
import { SkipLink } from '@/components/SkipLink'
import { routing } from '@/i18n/routing'
import { getFooter } from '@/lib/getFooter'
import { getMainNavigation } from '@/lib/getMainNavigation'

export const generateStaticParams = async () => {
  return Promise.resolve([])
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
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
      className={`${sourceSans3.variable} ${sourceSans3.className} ${lora.variable} selection:bg-fk-yellow selection:text-fk-black scrollbar scrollbar-thumb-fk-yellow scrollbar-track-fk-black scroll-pt-16 scroll-smooth`}
    >
      <body className="flex min-h-dvh flex-1 flex-shrink-0 flex-col items-center overflow-x-clip">
        <NextIntlClientProvider>
          <NextTopLoader color="#fbdb1d" showSpinner={false} showForHashAnchor={false} />
          <SkipLink />
          <MainNavigation navigation={navigation} />
          {children}
          <Footer footer={footer} locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
