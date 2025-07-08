import { Locale } from 'next-intl'

import { LandingPage } from '@/payload-types'

import { RichText } from './RichText/BlockRichText'

interface FrontPageAnnouncementProps {
  page: LandingPage
  locale: Locale
}

export const FrontPageAnnouncement = async ({ page, locale }: FrontPageAnnouncementProps) => {
  if (!page.announcement?.enabled || !page.announcement?.content) {
    return null
  }

  return (
    <div
      className="mx-auto my-8 rounded-lg px-4 py-6 shadow-lg transition-all duration-300 hover:shadow-2xl sm:px-6 lg:px-8"
      style={{
        backgroundColor: page.announcement?.color,
        color: page.announcement?.textColor
      }}
    >
      <div className="max-w-none">
        <RichText data={page.announcement?.content} locale={locale} />
      </div>
    </div>
  )
}
