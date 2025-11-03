import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import type { Locale } from 'next-intl'
import { Fragment } from 'react'

import type { Newsletter, NewsletterSettings } from '@/payload-types'
import { groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

import { EmailRichText } from './EmailRichText'

interface CareerNewsEmailProps {
  newsletterNumber: string
  newsletters: { titlePrefix: string; newsletter: Newsletter; locale: Locale }[]
  footer: NewsletterSettings['career']['footer']
  locale: Locale
}

const CareerNewsEmail = ({
  newsletterNumber,
  newsletters,
  footer,
  locale
}: CareerNewsEmailProps) => (
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
        <title>{`${newsletters.map(({ titlePrefix }) => titlePrefix).join(' / ')} ${newsletterNumber}`}</title>
        <meta
          name="description"
          content={`${newsletters.map(({ titlePrefix }) => titlePrefix).join(' / ')} ${newsletterNumber}`}
        />
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
      <Preview>{`${newsletters.map(({ titlePrefix }) => titlePrefix).join(' / ')} ${newsletterNumber}`}</Preview>
      <Body className="bg-fk-white">
        <Container className="mx-auto max-w-[600px] py-5 pb-12">
          {/* Header */}
          <Section className="w-full">
            <Heading className="font-lora m-0 text-3xl font-bold text-wrap">
              {newsletters.map(({ titlePrefix }, index) => {
                return (
                  <Fragment key={`${titlePrefix}-${index}`}>
                    {titlePrefix}
                    <br />
                  </Fragment>
                )
              })}{' '}
              {newsletterNumber}
            </Heading>
          </Section>

          {/* Newsletters */}
          {newsletters.map(({ newsletter, locale }) => {
            const newsGroups = groupNewsByType(newsletter.newsItems || [])

            return (
              <Fragment key={`${newsletter.id}-${locale}`}>
                {/* Greetings */}
                {newsletter.greetings && (
                  <Section className="py-5">
                    <Text className="font-source-sans text-base leading-6">
                      <EmailRichText data={newsletter.greetings} locale={locale} />
                    </Text>
                  </Section>
                )}

                {/* Table of Contents */}
                <Section className="py-5">
                  {Object.entries(newsGroups).map(([type, group]) => (
                    <div key={`${type}-${locale}`}>
                      <Heading as="h2" className="font-lora my-1 text-2xl font-bold italic">
                        {group.type}
                      </Heading>

                      <ul>
                        {group.items.map((item) => {
                          if (!item || typeof item !== 'object') return null

                          return (
                            <li key={`${item.id}-${locale}`}>
                              <Link
                                href={`#${slugify(item.title)}-${locale}`}
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
                        <Container key={`${newsItem.id}-${locale}`} className="mb-8">
                          <Heading
                            as="h2"
                            className="font-lora my-4 text-2xl font-bold italic"
                            id={`${slugify(newsItem.title)}-${locale}`}
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
                {newsletter.closingWords && (
                  <Section className="flex justify-center py-5">
                    <EmailRichText data={newsletter.closingWords} locale={locale} />
                  </Section>
                )}
                <Hr />
              </Fragment>
            )
          })}

          {/* Footer */}
          {footer && (
            <Section className="mt-8 border-t pt-8">
              <Text className="font-source-sans text-base leading-6">
                <EmailRichText data={footer} locale={locale} />
              </Text>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default CareerNewsEmail
