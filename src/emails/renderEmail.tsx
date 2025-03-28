import { render } from '@react-email/components'
import { Locale } from 'next-intl'

import { Newsletter, NewsletterSettings } from '@/payload-types'

import CareerNewsEmail from './CareerNewsEmail'
import WeeklyNewsEmail from './WeeklyNewsEmail'

export const renderEmail = async (
  newsletter: Newsletter,
  weeklySettings: NewsletterSettings['weekly'],
  careerSettings: NewsletterSettings['career'],
  locale: Locale,
  previewText?: string
) => {
  if (newsletter.type === 'career') {
    return render(
      <CareerNewsEmail
        careerNews={newsletter}
        newsletterSettings={careerSettings}
        locale="en" // We only have English career newsletters currently
        previewText={previewText}
      />
    )
  }

  return render(
    <WeeklyNewsEmail
      weeklyNews={newsletter}
      newsletterSettings={weeklySettings}
      locale={locale}
      previewText={previewText}
    />
  )
}
