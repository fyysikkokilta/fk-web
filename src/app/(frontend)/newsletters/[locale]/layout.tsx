import { locale } from 'next/root-params'
import { NextIntlClientProvider } from 'next-intl'

import { routing } from '@/i18n/routing'

export const generateStaticParams = () => {
  return routing.locales.map((localeParam) => ({ locale: localeParam }))
}

export default async function NewslettersLayout({
  children
}: LayoutProps<'/newsletters/[locale]'>) {
  const curLocale = await locale()

  return (
    <html lang={curLocale}>
      <body style={{ height: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
