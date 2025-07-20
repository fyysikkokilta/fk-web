import { useTranslations } from 'next-intl'
import React from 'react'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import type { Form } from '@/payload-types'

import { Error } from '../Error'
import { Width } from '../Width'

type TextAreaField = Extract<NonNullable<Form['fields']>[number], { blockType: 'textarea' }>

export const Textarea: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any
      }>
    >
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any & FieldValues>
    rows?: number
  } & TextAreaField
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => {
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
        <textarea
          id={name}
          defaultValue={defaultValue ?? ''}
          rows={rows}
          className={`w-full resize-y rounded-lg border px-4 py-3 shadow-sm transition-colors ${
            hasError ? 'border-fk-red' : 'border-fk-gray-lightest'
          }`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required ?? false}
          {...register(name, { required: required ?? false })}
        />
        {required && hasError && <Error id={errorId} />}
      </div>
    </Width>
  )
}
