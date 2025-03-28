import type { Locale } from 'next-intl'

import { RichText } from '@/components/RichText/BlockRichText'
import type { NewsletterBlock } from '@/payload-types'
import { getLocalizedTimeframe, groupNewsByDate, groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

interface NewsletterBlockProps {
  block: NewsletterBlock
  locale: Locale
}

export const Newsletter = ({ block, locale }: NewsletterBlockProps) => {
  if (typeof block.newsletter !== 'object') {
    return null
  }

  const newsGroups = groupNewsByType(block.newsletter.newsItems || [])

  return (
    <div className="weekly-news-block mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{block.newsletter.title}</h1>
      </div>

      <div className="space-y-8">
        {block.newsletter.greetings && (
          <div className="max-w-none">
            <RichText data={block.newsletter.greetings} locale={locale} />
          </div>
        )}

        {Object.entries(newsGroups).map(([type, group]) => {
          const { thisWeek, followingWeeks } = groupNewsByDate(group.items)
          return (
            <div key={type} className="space-y-6">
              {thisWeek.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-medium">
                    {group.type}
                    {': '}
                    {getLocalizedTimeframe('thisWeek', locale)}
                  </h2>
                  {thisWeek.map((newsItem) => {
                    if (!newsItem || typeof newsItem !== 'object') return null
                    return (
                      <div key={newsItem.id} className="space-y-4">
                        <h3 id={slugify(newsItem.title)} className="text-xl font-semibold">
                          {newsItem.title}
                        </h3>
                        <div className="max-w-none">
                          <RichText data={newsItem.content} locale={locale} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {followingWeeks.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-medium">
                    {group.type}
                    {': '}
                    {getLocalizedTimeframe('followingWeeks', locale)}
                  </h2>
                  {followingWeeks.map((newsItem) => {
                    if (!newsItem || typeof newsItem !== 'object') return null
                    return (
                      <div key={newsItem.id} className="space-y-4">
                        <h3 id={slugify(newsItem.title)} className="text-xl font-semibold">
                          {newsItem.title}
                        </h3>
                        <div className="max-w-none">
                          <RichText data={newsItem.content} locale={locale} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {block.newsletter.closingWords && (
          <div className="max-w-none">
            <RichText data={block.newsletter.closingWords} locale={locale} />
          </div>
        )}
      </div>
    </div>
  )
}
