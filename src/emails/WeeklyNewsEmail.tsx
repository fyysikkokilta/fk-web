import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import type { Locale } from 'next-intl'

import type { Newsletter, NewsletterSettings } from '@/payload-types'
import { getLocalizedTimeframe, groupNewsByDate, groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

import { EmailRichText } from './EmailRichText'

interface WeeklyNewsEmailProps {
  weeklyNews: Newsletter
  newsletterSettings: NewsletterSettings['weekly']
  locale: Locale
  previewText?: string
}

const WeeklyNewsEmail = ({
  weeklyNews,
  newsletterSettings,
  locale,
  previewText
}: WeeklyNewsEmailProps) => {
  const newsGroups = groupNewsByType(weeklyNews.newsItems || [])

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              white: '#ffffff',
              black: '#000000',
              gray: '#201e1e',
              yellow: '#fbdb1d',
              orange: '#ff8a04',
              blue: '#007bff',
              green: '#28a745',
              red: '#911f2f',
              purple: '#6f42c1'
            }
          }
        }
      }}
    >
      <Html lang={locale}>
        <Head>
          <title>{weeklyNews.title}</title>
          <meta name="description" content={previewText || weeklyNews.title} />
          <Font
            fontFamily="Source Sans 3"
            fallbackFontFamily={['sans-serif']}
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300..900;1,300..900&display=swap',
              format: 'woff2'
            }}
          />
          <Font
            fontFamily="lora"
            fallbackFontFamily={['Georgia']}
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
              format: 'woff2'
            }}
          />
          <style>
            {`
              a {
                text-decoration: none;
                font-family: 'Source Sans 3', sans-serif;
                color: #ff8a04 !important;
              }

              h1, h2, h3, h4, h5, h6 {
                font-family: Lora, Georgia;
              }

              p {
                font-family: 'Source Sans 3', sans-serif;
              }
            `}
          </style>
        </Head>
        <Preview>{previewText || weeklyNews.title}</Preview>
        <Body className="bg-fk-white">
          <Container className="mx-auto max-w-[600px] py-5 pb-12">
            {/* Header */}
            <Section className="w-full">
              <Row className="flex w-full items-center justify-between">
                <Column className="w-full">
                  <Heading className="m-0 text-3xl font-bold text-wrap">{weeklyNews.title}</Heading>
                </Column>
                <Column className="w-full">
                  {newsletterSettings.logo && typeof newsletterSettings.logo === 'object' && (
                    <Img
                      src={newsletterSettings.logo.url ?? ''}
                      alt={newsletterSettings.logo.alt ?? 'Weekly news header logo'}
                      width={newsletterSettings.logo.width ?? 0}
                      height={newsletterSettings.logo.height ?? 0}
                      className="h-16 w-auto object-contain"
                    />
                  )}
                </Column>
              </Row>
            </Section>

            {/* Greetings */}
            {weeklyNews.greetings && (
              <Section className="py-5">
                <Text className="text-base leading-6">
                  <EmailRichText data={weeklyNews.greetings} locale={locale} />
                </Text>
              </Section>
            )}

            <Hr />

            {/* Table of Contents */}
            <Section className="py-5">
              {Object.entries(newsGroups).map(([type, group]) => {
                const { thisWeek, followingWeeks } = groupNewsByDate(
                  group.items,
                  weeklyNews.newsletterNumber
                )
                return (
                  <div key={type}>
                    <div className="my-1 text-2xl font-bold italic">{group.type}</div>

                    {thisWeek.length > 0 && (
                      <>
                        <div className="my-1 text-xl font-medium italic">
                          {getLocalizedTimeframe('thisWeek', locale)}
                        </div>
                        <ul>
                          {thisWeek.map((item) => {
                            if (!item || typeof item !== 'object') return null

                            return (
                              <li key={item.id}>
                                <Link
                                  href={`#${slugify(item.title)}`}
                                  target="_self"
                                  className="no-underline"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    )}

                    {followingWeeks.length > 0 && (
                      <>
                        <div className="my-1 text-xl font-medium italic">
                          {getLocalizedTimeframe('followingWeeks', locale)}
                        </div>
                        <ul>
                          {followingWeeks.map((item) => {
                            if (!item || typeof item !== 'object') return null

                            return (
                              <li key={item.id}>
                                <Link
                                  href={`#${slugify(item.title)}`}
                                  target="_self"
                                  className="no-underline"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    )}
                  </div>
                )
              })}
            </Section>

            <Hr />

            {/* News Items */}
            <Section className="py-5">
              {Object.values(newsGroups)
                .flatMap((group) => group.items)
                .sort((a, b) => {
                  if (typeof a !== 'object' || typeof b !== 'object') return 0
                  return new Date(b?.date).getTime() - new Date(a?.date).getTime()
                })
                .map((newsItem) => {
                  if (!newsItem || typeof newsItem !== 'object') return null

                  return (
                    <Container key={newsItem.id} className="mb-8">
                      <Heading
                        as="h2"
                        className="my-4 text-2xl font-bold italic"
                        id={slugify(newsItem.title)}
                      >
                        {newsItem.title}
                      </Heading>
                      <Text className="text-base leading-6">
                        <EmailRichText data={newsItem.content} locale={locale} />
                      </Text>
                    </Container>
                  )
                })}
            </Section>

            <Hr />

            {/* Closing Words */}
            {weeklyNews.closingWords && (
              <Section className="flex justify-center py-5">
                <EmailRichText data={weeklyNews.closingWords} locale={locale} />
              </Section>
            )}

            <Hr />

            {/* Footer */}
            {newsletterSettings.footer && (
              <Section className="mt-8 border-t pt-8">
                <Text className="text-base leading-6">
                  <EmailRichText data={newsletterSettings.footer} locale={locale} />
                </Text>
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

export default WeeklyNewsEmail
