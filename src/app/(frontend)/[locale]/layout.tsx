import '../globals.css'

import { locale } from 'next/root-params'
import { NextIntlClientProvider } from 'next-intl'
import NextTopLoader from 'nextjs-toploader'

import { lora, sourceSans3 } from '@/app/fonts'
import { Footer } from '@/components/Footer'
import { MainNavigation } from '@/components/Navigation'
import { SkipLink } from '@/components/SkipLink'
import { routing } from '@/i18n/routing'
import { getFooter } from '@/lib/getFooter'
import { getMainNavigation } from '@/lib/getMainNavigation'

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const curLocale = await locale()

  const navigation = await getMainNavigation(curLocale)
  const footer = await getFooter(curLocale)

  return (
    <html
      lang={curLocale}
      className={`${sourceSans3.variable} ${sourceSans3.className} ${lora.variable} selection:bg-fk-yellow selection:text-fk-black scrollbar scrollbar-thumb-fk-yellow scrollbar-track-fk-black scroll-pt-16`}
    >
      <body className="flex min-h-dvh flex-1 shrink-0 flex-col items-center overflow-x-clip">
        <NextIntlClientProvider>
          <NextTopLoader color="#fbdb1d" showSpinner={false} showForHashAnchor={false} />
          <SkipLink />
          <MainNavigation navigation={navigation} />
          {children}
          <Footer footer={footer} locale={curLocale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
