import { useTranslations } from 'next-intl'
import * as React from 'react'

export const Error: React.FC = () => {
  const t = useTranslations()
  return <div className="text-fk-red mt-1 text-sm">{t('form.required')}</div>
}
