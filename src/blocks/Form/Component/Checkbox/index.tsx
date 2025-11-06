import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox'
import { Field } from '@base-ui-components/react/field'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import type { Form } from '@/payload-types'

import { Width } from '../Width'

type CheckboxField = Extract<NonNullable<Form['fields']>[number], { blockType: 'checkbox' }>

export const Checkbox: React.FC<
  {
    errors: Record<string, string>
  } & CheckboxField
> = ({ name, defaultValue, errors, label, required, width }) => {
  const t = useTranslations()
  const hasError = !!errors[name]
  const [checked, setChecked] = useState<boolean>(defaultValue ?? false)

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <div className="flex items-center gap-2">
          <BaseCheckbox.Root
            name={name}
            checked={checked}
            onCheckedChange={setChecked}
            required={required ?? false}
            className={`focus-visible:ring-fk-yellow h-7 w-7 rounded-lg border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none ${
              checked
                ? 'bg-fk-yellow border-fk-yellow text-fk-black hover:bg-fk-yellow-dark'
                : 'bg-fk-white border-fk-gray-lightest hover:border-fk-yellow text-fk-yellow'
            }`}
            aria-label={`${label || 'checkbox'} - ${checked ? t('form.checked') : t('form.unchecked')}`}
          >
            <BaseCheckbox.Indicator>{checked && <Check size={20} />}</BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
          <Field.Label className="text-fk-gray cursor-pointer text-sm font-medium">
            {label}
            {required && (
              <span className="text-fk-red ml-1" aria-label={t('form.requiredField')}>
                {'*'}
              </span>
            )}
          </Field.Label>
        </div>
        <Field.Error className="text-fk-red mt-1 text-sm" match={hasError}>
          {errors[name] || t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
