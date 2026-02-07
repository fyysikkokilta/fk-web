import { Field } from '@base-ui/react/field'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { RequiredIndicator } from '../RequiredIndicator'
import { Width } from '../Width'

type RadioField = Extract<NonNullable<Form['fields']>[number], { blockType: 'radio' }>

export const Radio: React.FC<RadioField> = ({
  name,
  defaultValue,
  label,
  options,
  required,
  width
}) => {
  const t = useTranslations()
  const radioOptions = options ?? []

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <Field.Label className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <RequiredIndicator />}
        </Field.Label>
        <BaseRadioGroup
          name={name}
          defaultValue={defaultValue ?? undefined}
          required={required ?? undefined}
          className="flex flex-col gap-2"
        >
          {radioOptions.map((option) => (
            <label
              key={option.value}
              className="focus-within:ring-fk-yellow border-fk-gray-lightest hover:border-fk-yellow flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-offset-0"
            >
              <BaseRadio.Root
                value={option.value}
                className="focus-visible:ring-fk-yellow data-checked:bg-fk-yellow data-checked:border-fk-yellow data-checked:text-fk-black border-fk-gray-lightest h-5 w-5 shrink-0 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
              >
                <BaseRadio.Indicator className="bg-fk-black block size-2 rounded-full opacity-0 data-checked:opacity-100" />
              </BaseRadio.Root>
              <span className="text-fk-gray text-sm">{option.label}</span>
            </label>
          ))}
        </BaseRadioGroup>
        <Field.Error className="text-fk-red mt-1 text-sm" match="valueMissing">
          {t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
