import { useTranslations } from 'next-intl'
import * as React from 'react'

interface ErrorProps {
  id?: string
}

export const Error: React.FC<ErrorProps> = ({ id }) => {
  const t = useTranslations()
  return (
    <div id={id} className="text-fk-red mt-1 text-sm" role="alert">
      {t('form.required')}
    </div>
  )
}
