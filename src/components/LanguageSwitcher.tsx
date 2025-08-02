'use client'

import { useLocale, useTranslations } from 'next-intl'

import { usePathname } from '@/i18n/navigation'

type LanguageSwitcherProps = {
  LinkElement: React.ElementType
  onClick?: () => void
}

export function LanguageSwitcher({ LinkElement, onClick }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations('languageSwitcher')
  const pathname = usePathname()

  // Show only the alternative language
  const alternativeLocale = locale === 'fi' ? 'en' : 'fi'
  const alternativeLabel = alternativeLocale.toUpperCase()

  return (
    <LinkElement
      href={pathname}
      locale={alternativeLocale}
      aria-label={t('switchLanguage')}
      className="text-fk-white mx-4 box-border flex items-center justify-center px-2 text-xl leading-6 font-bold tracking-wide uppercase no-underline focus-visible:relative"
      onClick={onClick}
    >
      {alternativeLabel}
    </LinkElement>
  )
}
