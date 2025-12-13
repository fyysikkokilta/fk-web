import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

import { DraftModeBanner } from '@/components/DraftModeBanner'
import { FrontPageAnnouncement } from '@/components/FrontPageAnnouncement'
import { FrontPageCalendar } from '@/components/FrontPageCalendar'
import { FrontPageCalendarFallback } from '@/components/FrontPageCalendarFallback'
import { FrontPageSlideshow } from '@/components/FrontPageSlideshow'
import { Partners } from '@/components/Partners'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { env } from '@/env'
import { getLandingPage } from '@/lib/getLandingPage'
import { getPartners } from '@/lib/getPartners'
import { isDraftMode } from '@/utils/draftMode'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const nextIntlLocale = locale as Locale
  const page = await getLandingPage(nextIntlLocale)

  const images = page?.bannerImages
    ?.map((image) => {
      if (typeof image === 'object') {
        return {
          url: image.url || '',
          width: image.width || 100,
          height: image.height || 100,
          alt: image.alt || ''
        }
      }
      return null
    })
    .filter((image) => !!image)

  return {
    title: page?.title,
    description: page?.meta?.description,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: page?.meta?.title || page?.title,
      description: page?.meta?.description || '',
      images: images || [],
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${nextIntlLocale}`,
      siteName: page?.title,
      locale: nextIntlLocale,
      type: 'website'
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export const generateStaticParams = async () => {
  return Promise.resolve([])
}

export default async function LandingPage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  const nextIntlLocale = locale as Locale
  setRequestLocale(nextIntlLocale)

  const isDraft = await isDraftMode()
  const landingPage = await getLandingPage(nextIntlLocale)
  const partners = await getPartners(nextIntlLocale)

  if (!landingPage) {
    notFound()
  }

  return (
    <>
      <DraftModeBanner isDraft={isDraft} />
      {isDraft ? <RefreshRouteOnSave /> : null}
      <main id="page-content" className="flex w-full flex-col">
        <FrontPageSlideshow page={landingPage} />
        <section className="mx-auto mb-12 w-full max-w-7xl flex-1 p-6">
          <div className="flex flex-col gap-8">
            <FrontPageAnnouncement page={landingPage} locale={nextIntlLocale} />
            <Suspense fallback={<FrontPageCalendarFallback />}>
              <FrontPageCalendar page={landingPage} />
            </Suspense>
            <h1 className="mb-8 font-(family-name:--font-lora) text-4xl font-bold wrap-break-word hyphens-auto italic">
              {landingPage.title}
            </h1>
            <RichText data={landingPage.content} locale={nextIntlLocale} />
          </div>
        </section>
        {partners && <Partners partnerData={partners} />}
      </main>
    </>
  )
}
