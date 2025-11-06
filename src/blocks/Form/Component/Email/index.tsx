import { Field } from '@base-ui-components/react/field'
import { Input } from '@base-ui-components/react/input'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { Width } from '../Width'

type EmailField = Extract<NonNullable<Form['fields']>[number], { blockType: 'email' }>

export const Email: React.FC<
  {
    errors: Record<string, string>
  } & EmailField
> = ({ name, errors, label, required, width }) => {
  const t = useTranslations()
  const hasError = !!errors[name]

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <Field.Label className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && (
            <span className="text-fk-red ml-1" aria-label={t('form.requiredField')}>
              {'*'}
            </span>
          )}
        </Field.Label>
        <Field.Control
          type="email"
          placeholder={t('form.emailPlaceholder')}
          required={required ?? false}
          pattern="^\S[^\s@]*@\S+$"
          render={(props) => (
            <Input
              {...props}
              className={`focus-visible:ring-fk-yellow w-full rounded-lg border px-4 py-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none ${
                hasError ? 'border-fk-red' : 'border-fk-gray-lightest'
              }`}
            />
          )}
        />
        {hasError && errors[name] ? (
          <div className="text-fk-red mt-1 text-sm" role="alert">
            {errors[name]}
          </div>
        ) : (
          <>
            <Field.Error className="text-fk-red mt-1 text-sm" match="patternMismatch">
              {t('form.invalidEmail')}
            </Field.Error>
            <Field.Error className="text-fk-red mt-1 text-sm" match="valueMissing">
              {t('form.required')}
            </Field.Error>
          </>
        )}
      </Field.Root>
    </Width>
  )
}
