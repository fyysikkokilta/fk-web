import { getTranslations } from 'next-intl/server'

export const SkipLink = async () => {
  const t = await getTranslations()

  return (
    <a
      href="#page-content"
      className="bg-fk-yellow text-fk-black sr-only z-50 rounded p-2 focus:not-sr-only focus:absolute focus:top-0 focus:left-0"
    >
      {t('skipLink')}
    </a>
  )
}
