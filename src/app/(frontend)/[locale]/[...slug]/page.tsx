import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BoardMemberSidebar } from '@/components/BoardMemberSidebar'
import { DraftModeBanner } from '@/components/DraftModeBanner'
import { PageBanner } from '@/components/PageBanner'
import { Partners } from '@/components/Partners'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { TableOfContents } from '@/components/TableOfContents'
import { env } from '@/env'
import { getMainNavigation } from '@/lib/getMainNavigation'
import { getPage } from '@/lib/getPage'
import { getPartners } from '@/lib/getPartners'
import { isDraftMode } from '@/utils/draftMode'

// Revalidate at least once per day
export const revalidate = 86400

export const generateStaticParams = async () => {
  return Promise.resolve([])
}

export async function generateMetadata({
  params
}: PageProps<'/[locale]/[...slug]'>): Promise<Metadata> {
  const { slug, locale } = await params
  const nextIntlLocale = locale as Locale
  const page = await getPage(slug.join('/'), nextIntlLocale)
  const mainNavigation = await getMainNavigation(nextIntlLocale)
  const siteName = mainNavigation.title

  if (!page) {
    const t = await getTranslations()

    return {
      title: `${t('notFound.meta.title')} - ${siteName}`,
      description: t('notFound.meta.description'),
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          noimageindex: true
        }
      }
    }
  }

  const images =
    page?.bannerImage && typeof page?.bannerImage === 'object'
      ? {
          url: page?.bannerImage?.url || '',
          width: page?.bannerImage?.width || 100,
          height: page?.bannerImage?.height || 100,
          alt: page?.bannerImage?.alt || ''
        }
      : null

  return {
    title: page?.meta?.title || `${page?.title} - ${siteName}`,
    description: page?.meta?.description,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: page?.meta?.title || `${page?.title} - ${siteName}`,
      description: page?.meta?.description || '',
      images: images || [],
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/${slug?.join('/')}`,
      siteName: siteName,
      locale: locale,
      type: 'website'
    },
    robots: {
      index: !page?.noIndex,
      googleBot: {
        index: !page?.noIndex,
        noimageindex: !!page?.noIndex
      }
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export default async function Page({ params }: PageProps<'/[locale]/[...slug]'>) {
  const { slug, locale } = await params
  const nextIntlLocale = locale as Locale
  setRequestLocale(nextIntlLocale)

  const isDraft = await isDraftMode()
  const page = await getPage(slug?.join('/'), nextIntlLocale)
  const partners = await getPartners(nextIntlLocale)

  if (!page) {
    return <PayloadRedirects url={`/${slug?.join('/')}`} locale={nextIntlLocale} />
  }

  // If not in draft mode and page is not published, show 404
  if (!isDraft && page._status !== 'published') {
    return <PayloadRedirects url={`/${slug?.join('/')}`} locale={nextIntlLocale} />
  }

  console.info('[Next.js] Rendering page', `/${nextIntlLocale}/${slug?.join('/')}`)

  return (
    <>
      <DraftModeBanner pageId={page.id.toString()} isDraft={isDraft} hidden={page.hidden} />
      {isDraft ? <RefreshRouteOnSave /> : null}
      <PayloadRedirects url={`/${slug?.join('/')}`} disableNotFound locale={nextIntlLocale} />
      <main id="page-content" className="flex w-full flex-col">
        <PageBanner page={page} />
        <section className="mx-auto mb-12 w-full max-w-7xl flex-1 p-6">
          <div className={!page.fullWidth ? 'lg:ml-[20%]' : ''}>
            <h1 className="mb-8 font-(family-name:--font-lora) text-4xl font-bold break-words hyphens-auto italic">
              {page.title}
            </h1>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            {!page.fullWidth && (
              <TableOfContents show={page.showTableOfContents} richText={page.content} />
            )}
            <div className={!page.fullWidth ? 'lg:w-[60%]' : 'lg:w-full'}>
              <RichText data={page.content} locale={nextIntlLocale} />
            </div>
            {!page.fullWidth && <BoardMemberSidebar boardMembers={page.boardMember} />}
          </div>
        </section>
        {page.showPartners && partners && <Partners partnerData={partners} />}
      </main>
    </>
  )
}
