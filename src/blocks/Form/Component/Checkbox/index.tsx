import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import type { Form } from '@/payload-types'

import { Error } from '../Error'
import { Width } from '../Width'

type CheckboxField = Extract<NonNullable<Form['fields']>[number], { blockType: 'checkbox' }>

export const Checkbox: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any
      }>
    >
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any & FieldValues>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: any
  } & CheckboxField
> = ({ name, defaultValue, errors, label, register, required, setValue, width }) => {
  const t = useTranslations()
  const [checked, setChecked] = useState(defaultValue ?? false)
  const hasError = errors[name]
  const errorId = `${name}-error`

  return (
    <Width width={width ?? 100}>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="checkbox"
              id={name}
              className="sr-only"
              {...register(name, { required: required ?? false })}
              checked={checked}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? errorId : undefined}
              aria-required={required ?? false}
            />
            <button
              onClick={() => {
                setValue(name, !checked)
                setChecked(!checked)
              }}
              type="button"
              className={`h-7 w-7 cursor-pointer rounded-lg border-2 transition-colors ${
                checked
                  ? 'bg-fk-yellow border-fk-yellow text-fk-black hover:bg-fk-yellow-dark'
                  : 'bg-fk-white border-fk-gray-lightest hover:border-fk-yellow text-fk-yellow'
              }`}
              aria-label={`${label || 'checkbox'} - ${checked ? t('form.checked') : t('form.unchecked')}`}
              aria-pressed={checked}
            >
              {checked && <Check size={20} />}
            </button>
          </div>
          <label htmlFor={name} className="text-fk-gray cursor-pointer text-sm font-medium">
            {label}
            {required && (
              <span className="text-fk-red ml-1" aria-label={t('form.requiredField')}>
                {'*'}
              </span>
            )}
          </label>
        </div>
        {required && hasError && checked === false && <Error id={errorId} />}
      </div>
    </Width>
  )
}
