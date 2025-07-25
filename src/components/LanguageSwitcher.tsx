'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('languageSwitcher')
  const pathname = usePathname()

  // Show only the alternative language
  const alternativeLocale = locale === 'fi' ? 'en' : 'fi'
  const alternativeLabel = alternativeLocale.toUpperCase()

  return (
    <Link
      href={pathname}
      locale={alternativeLocale}
      aria-label={t('switchLanguage')}
      className="text-fk-white cursor-pointer px-3 py-2 text-xl font-semibold tracking-wide uppercase"
    >
      {alternativeLabel}
    </Link>
  )
}
