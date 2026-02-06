import type { Locale } from 'next-intl'

import { RichText } from '@/components/RichText/BlockRichText'
import type { NewsletterBlock } from '@/payload-types'
import { getSectionHeading, groupNewsByDate, groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

interface NewsletterBlockProps {
  block: NewsletterBlock
  locale: Locale
}

export const Newsletter = ({ block, locale }: NewsletterBlockProps) => {
  if (typeof block.newsletter !== 'object') {
    return null
  }

  const newsletter = block.newsletter
  const newsGroups = groupNewsByType(newsletter.newsItems || [])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 id={slugify(newsletter.newsletterNumber)} className="text-4xl font-bold">
          {newsletter.newsletterNumber}
        </h2>
      </div>

      <div className="space-y-8">
        {newsletter.greetings && (
          <div className="max-w-none">
            <RichText data={newsletter.greetings} locale={locale} />
          </div>
        )}

        {Object.entries(newsGroups).map(([type, group]) => {
          if (newsletter.type === 'career') {
            return (
              <div key={type} className="space-y-4">
                <h3 id={slugify(group.type)} className="text-2xl font-medium">
                  {group.type}
                </h3>
                {group.items.map((newsItem) => {
                  if (!newsItem || typeof newsItem !== 'object') return null
                  return (
                    <div key={newsItem.id} className="space-y-4">
                      <h4 id={slugify(newsItem.title)} className="text-xl font-semibold">
                        {newsItem.title}
                      </h4>
                      <div className="max-w-none">
                        <RichText data={newsItem.content} locale={locale} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          const { thisWeek, followingWeeks } = groupNewsByDate(
            group.items,
            newsletter.newsletterNumber
          )
          return (
            <div key={type} className="space-y-6">
              {thisWeek.length > 0 && (
                <div className="space-y-4">
                  <h3
                    id={slugify(getSectionHeading(group.type, 'thisWeek', locale))}
                    className="text-2xl font-medium"
                  >
                    {getSectionHeading(group.type, 'thisWeek', locale)}
                  </h3>
                  {thisWeek.map((newsItem) => {
                    if (!newsItem || typeof newsItem !== 'object') return null
                    return (
                      <div key={newsItem.id} className="space-y-4">
                        <h4 id={slugify(newsItem.title)} className="text-xl font-semibold">
                          {newsItem.title}
                        </h4>
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
                  <h3
                    id={slugify(getSectionHeading(group.type, 'followingWeeks', locale))}
                    className="text-2xl font-medium"
                  >
                    {getSectionHeading(group.type, 'followingWeeks', locale)}
                  </h3>
                  {followingWeeks.map((newsItem) => {
                    if (!newsItem || typeof newsItem !== 'object') return null
                    return (
                      <div key={newsItem.id} className="space-y-4">
                        <h4 id={slugify(newsItem.title)} className="text-xl font-semibold">
                          {newsItem.title}
                        </h4>
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

        {newsletter.closingWords && (
          <div className="max-w-none">
            <RichText data={newsletter.closingWords} locale={locale} />
          </div>
        )}
      </div>
    </div>
  )
}
