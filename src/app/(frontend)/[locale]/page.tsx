import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale } from 'next/root-params'
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

export async function generateMetadata(): Promise<Metadata> {
  const curLocale = await locale()
  const page = await getLandingPage(curLocale)

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
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${curLocale}`,
      siteName: page?.title,
      locale: curLocale,
      type: 'website'
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export default async function LandingPage() {
  const curLocale = await locale()

  const isDraft = await isDraftMode()
  const landingPage = await getLandingPage(curLocale)
  const partners = await getPartners(curLocale)

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
            <FrontPageAnnouncement page={landingPage} locale={curLocale} />
            <Suspense fallback={<FrontPageCalendarFallback />}>
              <FrontPageCalendar page={landingPage} />
            </Suspense>
            <h1 className="mb-8 font-(family-name:--font-lora) text-4xl font-bold wrap-break-word hyphens-auto italic">
              {landingPage.title}
            </h1>
            <RichText data={landingPage.content} locale={curLocale} />
          </div>
        </section>
        {partners && <Partners partnerData={partners} />}
      </main>
    </>
  )
}
