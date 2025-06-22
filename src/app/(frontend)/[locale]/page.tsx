import { notFound } from 'next/navigation'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { DraftModeBanner } from '@/components/DraftModeBanner'
import { FrontPageAnnouncement } from '@/components/FrontPageAnnouncement'
import { FrontPageCalendar } from '@/components/FrontPageCalendar'
import { FrontPageSlideshow } from '@/components/FrontPageSlideshow'
import { Partners } from '@/components/Partners'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { env } from '@/env'
import { getLandingPage } from '@/lib/getLandingPage'
import { getPartners } from '@/lib/getPartners'
import { isDraftMode } from '@/utils/draftMode'

interface LandingPageProps {
  params: Promise<{
    locale: Locale
  }>
}

// Revalidate at least once per hour
export const revalidate = 3600

export async function generateMetadata({ params }: LandingPageProps) {
  const { locale } = await params
  const page = await getLandingPage(locale)

  const images = page?.bannerImages
    ?.map((image) => {
      if (typeof image === 'object') {
        return {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt
        }
      }
      return null
    })
    .filter(Boolean)

  const siteName = locale === 'fi' ? env.SITE_NAME : env.SITE_NAME_EN
  return {
    title: page?.meta?.title || siteName,
    description: page?.meta?.description,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: page?.meta?.title,
      description: page?.meta?.description,
      images: images,
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}`,
      siteName: siteName,
      locale: locale,
      type: 'website'
    },
    robots: {
      index: true,
      follow: true,
      nocache: false
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export const generateStaticParams = async () => {
  return Promise.resolve([])
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const isDraft = await isDraftMode()
  const landingPage = await getLandingPage(locale)
  const partners = await getPartners(locale)

  if (!landingPage) {
    notFound()
  }

  const startingIndex = Math.floor(Math.random() * (landingPage.bannerImages?.length || 1))

  console.info('[Next.js] Rendering landing page', `/${locale}`)

  return (
    <>
      <DraftModeBanner isDraft={isDraft} />
      <RefreshRouteOnSave />
      <FrontPageSlideshow page={landingPage} startingIndex={startingIndex} />
      <div id="page-content-root" className="mx-auto mb-12 w-full max-w-7xl flex-1 p-6">
        <div id="page-content" className="flex flex-col gap-8">
          <FrontPageAnnouncement page={landingPage} locale={locale} />
          <FrontPageCalendar page={landingPage} />
          <RichText data={landingPage.content} locale={locale} />
        </div>
      </div>
      {partners && <Partners partnerData={partners} />}
    </>
  )
}
