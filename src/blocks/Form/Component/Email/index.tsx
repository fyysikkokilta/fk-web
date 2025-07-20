import { useTranslations } from 'next-intl'
import React from 'react'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import type { Form } from '@/payload-types'

import { Width } from '../Width'

type EmailField = Extract<NonNullable<Form['fields']>[number], { blockType: 'email' }>

export const Email: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any
      }>
    >
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any & FieldValues>
  } & EmailField
> = ({ name, errors, label, register, required, width }) => {
  const t = useTranslations()
  const hasError = errors[name]
  const errorId = `${name}-error`

  return (
    <Width width={width ?? 100}>
      <div className="mb-4">
        <label htmlFor={name} className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && (
            <span className="text-fk-red ml-1" aria-label={t('form.requiredField')}>
              {'*'}
            </span>
          )}
        </label>
        <input
          id={name}
          placeholder={t('form.emailPlaceholder')}
          type="email"
          className={`w-full rounded-lg border px-4 py-3 shadow-sm transition-colors ${
            hasError ? 'border-fk-red' : 'border-fk-gray-lightest'
          }`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required ?? false}
          {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: required ?? false })}
        />
        {((required && hasError) || (hasError && errors[name]?.type === 'pattern')) && (
          <div id={errorId} className="text-fk-red mt-1 text-sm" role="alert">
            {errors[name]?.type === 'pattern' ? t('form.invalidEmail') : t('form.required')}
          </div>
        )}
      </div>
    </Width>
  )
}
