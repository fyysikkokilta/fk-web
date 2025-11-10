import { useTranslations } from 'next-intl'
import React from 'react'

export const RequiredIndicator: React.FC = () => {
  const t = useTranslations()

  return (
    <span className="text-fk-red ml-1" aria-label={t('form.requiredField')}>
      {'*'}
    </span>
  )
}
