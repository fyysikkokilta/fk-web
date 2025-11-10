import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox'
import { Field } from '@base-ui-components/react/field'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { RequiredIndicator } from '../RequiredIndicator'
import { Width } from '../Width'

type CheckboxField = Extract<NonNullable<Form['fields']>[number], { blockType: 'checkbox' }>

export const Checkbox: React.FC<CheckboxField> = ({
  name,
  defaultValue,
  label,
  required,
  width
}) => {
  const t = useTranslations()

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <div className="flex items-center gap-2">
          <BaseCheckbox.Root
            name={name}
            defaultChecked={defaultValue ?? undefined}
            required={required ?? undefined}
            className="focus-visible:ring-fk-yellow data-checked:bg-fk-yellow data-checked:border-fk-yellow data-checked:text-fk-black data-checked:hover:bg-fk-yellow-dark data-unchecked:bg-fk-white data-unchecked:border-fk-gray-lightest data-unchecked:hover:border-fk-yellow data-unchecked:text-fk-yellow h-7 w-7 rounded-lg border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
            aria-label={`${label || 'checkbox'}`}
          >
            <BaseCheckbox.Indicator>
              <Check size={20} />
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
          <Field.Label className="text-fk-gray cursor-pointer text-sm font-medium">
            {label}
            {required && <RequiredIndicator />}
          </Field.Label>
        </div>
        <Field.Error className="text-fk-red mt-1 text-sm" match="valueMissing">
          {t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
