import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import type { Locale } from 'next-intl'

import type { Newsletter, NewsletterSettings } from '@/payload-types'
import { groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

import { EmailRichText } from './EmailRichText'

interface CareerNewsEmailProps {
  careerNews: Newsletter
  newsletterSettings: NewsletterSettings['career']
  locale: Locale
  previewText?: string
}

const CareerNewsEmail = ({
  careerNews,
  newsletterSettings,
  locale,
  previewText
}: CareerNewsEmailProps) => {
  const newsGroups = groupNewsByType(careerNews.newsItems || [])

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
            },
            fontFamily: {
              'source-sans': ['Source Sans 3', 'sans-serif'],
              lora: ['Lora', 'serif']
            }
          }
        }
      }}
    >
      <Html lang={locale}>
        <Head>
          <title>{careerNews.title}</title>
          <meta name="description" content={previewText || careerNews.title} />
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
            fallbackFontFamily={['serif']}
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
              format: 'woff2'
            }}
          />
        </Head>
        <Preview>{previewText || careerNews.title}</Preview>
        <Body className="bg-fk-white">
          <Container className="mx-auto max-w-[600px] py-5 pb-12">
            {/* Header */}
            <Section className="w-full">
              <Heading className="font-lora m-0 text-3xl font-bold text-wrap">
                {careerNews.title}
              </Heading>
            </Section>

            {/* Greetings */}
            {careerNews.greetings && (
              <Section className="py-5">
                <Text className="font-source-sans text-base leading-6">
                  <EmailRichText data={careerNews.greetings} locale={locale} />
                </Text>
              </Section>
            )}

            {/* Table of Contents */}
            <Section className="py-5">
              {Object.entries(newsGroups).map(([type, group]) => (
                <div key={type}>
                  <Heading as="h2" className="font-lora my-1 text-2xl font-bold italic">
                    {group.type}
                  </Heading>

                  <ul>
                    {group.items.map((item) => {
                      if (!item || typeof item !== 'object') return null

                      return (
                        <li key={item.id}>
                          <Link
                            href={`#${slugify(item.title)}`}
                            target="_self"
                            className="font-source-sans text-orange no-underline"
                          >
                            {item.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </Section>

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
                        className="font-lora my-4 text-2xl font-bold italic"
                        id={slugify(newsItem.title)}
                      >
                        {newsItem.title}
                      </Heading>
                      <Text className="font-source-sans text-base leading-6">
                        <EmailRichText data={newsItem.content} locale={locale} />
                      </Text>
                    </Container>
                  )
                })}
            </Section>

            {/* Closing Words */}
            {careerNews.closingWords && (
              <Section className="flex justify-center py-5">
                <EmailRichText data={careerNews.closingWords} locale={locale} />
              </Section>
            )}

            {/* Footer */}
            {newsletterSettings.footer && (
              <Section className="mt-8 border-t pt-8">
                <Text className="font-source-sans text-base leading-6">
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

export default CareerNewsEmail
