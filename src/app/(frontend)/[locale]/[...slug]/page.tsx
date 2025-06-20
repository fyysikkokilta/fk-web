import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { BoardMemberSideBar } from '@/components/BoardMemberSideBar'
import { DraftModeBanner } from '@/components/DraftModeBanner'
import { PageBanner } from '@/components/PageBanner'
import { Partners } from '@/components/Partners'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { TableOfContents } from '@/components/TableOfContents'
import { env } from '@/env'
import { getPage } from '@/lib/getPage'
import { getPartners } from '@/lib/getPartners'
import { isDraftMode } from '@/utils/draftMode'

interface PageProps {
  params: Promise<{
    slug: string[]
    locale: Locale
  }>
}

// Revalidate at least once per hour
export const revalidate = 3600

export const dynamic = 'force-static'

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params
  const page = await getPage(slug.join('/'), locale)

  const images =
    page?.bannerImage && typeof page?.bannerImage === 'object'
      ? {
          url: page?.bannerImage?.url,
          width: page?.bannerImage?.width,
          height: page?.bannerImage?.height,
          alt: page?.bannerImage?.alt
        }
      : null

  const siteName = locale === 'fi' ? env.SITE_NAME : env.SITE_NAME_EN
  return {
    title: page?.meta?.title || `${page?.title} - ${siteName}`,
    description: page?.meta?.description,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: page?.meta?.title,
      description: page?.meta?.description,
      images: images,
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${slug?.join('/')}`,
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

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const isDraft = await isDraftMode()
  const page = await getPage(slug?.join('/'), locale)
  const partners = await getPartners(locale)

  if (!page) {
    return <PayloadRedirects url={`/${slug?.join('/')}`} locale={locale} />
  }

  // If not in draft mode and page is not published, show 404
  if (!isDraft && page._status !== 'published') {
    return <PayloadRedirects url={`/${slug?.join('/')}`} locale={locale} />
  }

  console.info('[Next.js] Rendering page', `/${locale}/${slug?.join('/')}`)

  return (
    <>
      <DraftModeBanner pageId={page.id.toString()} isDraft={isDraft} hidden={page.hidden} />
      <RefreshRouteOnSave />
      <PayloadRedirects url={`/${slug?.join('/')}`} disableNotFound locale={locale} />
      <PageBanner page={page} />
      <div id="page-content-root" className="mx-auto mb-12 w-full max-w-7xl p-6">
        <div className={`${page.showTableOfContents ? 'lg:ml-[20%]' : ''}`}>
          {page.showTitle && (
            <h1 className="mb-8 font-(family-name:--font-lora) text-4xl font-bold italic">
              {page.title}
            </h1>
          )}
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          {page.showTableOfContents && <TableOfContents />}
          <div
            id="page-content"
            className={`${page.showTableOfContents && page.boardMember?.length ? 'lg:w-[60%]' : page.showTableOfContents || page.boardMember?.length ? 'lg:w-[80%]' : 'lg:w-[100%]'}`}
          >
            <RichText data={page.content} locale={locale} />
          </div>
          {page.boardMember && <BoardMemberSideBar boardMembers={page.boardMember} />}
        </div>
      </div>
      {page.showPartners && partners && <Partners partnerData={partners} />}
    </>
  )
}
