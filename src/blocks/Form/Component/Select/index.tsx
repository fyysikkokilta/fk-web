import { Field } from '@base-ui-components/react/field'
import { Select } from '@base-ui-components/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import type { Form } from '@/payload-types'

import { Width } from '../Width'

type SelectField = Extract<NonNullable<Form['fields']>[number], { blockType: 'select' }>

export const SelectComponent: React.FC<
  {
    errors: Record<string, string>
  } & SelectField
> = ({ name, defaultValue, errors, label, options, required, width }) => {
  const t = useTranslations()
  const hasError = !!errors[name]
  const selectOptions = options ?? []
  const [value, setValue] = useState<string | null>(defaultValue ?? null)

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
        <Select.Root
          name={name}
          value={value}
          onValueChange={setValue}
          required={required ?? false}
          modal={false}
        >
          <Select.Trigger
            className={`focus-visible:ring-fk-yellow group flex w-full items-center justify-between rounded-lg border px-4 py-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none ${
              hasError ? 'border-fk-red' : 'border-fk-gray-lightest'
            }`}
          >
            <Select.Value>
              {(val) => {
                const option = selectOptions.find((opt) => opt.value === val)
                return option ? option.label : ''
              }}
            </Select.Value>
            <Select.Icon>
              <ChevronDown
                size={16}
                className="transition-transform duration-200 group-data-popup-open:rotate-180"
              />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner alignItemWithTrigger={false} className="z-50">
              <Select.Popup
                className="mt-1 max-h-60 overflow-auto rounded-lg border-0 bg-white shadow-lg"
                style={{ minWidth: 'var(--anchor-width)', width: 'var(--anchor-width)' }}
              >
                <Select.List>
                  {selectOptions.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className={(state) =>
                        `flex cursor-pointer items-center justify-between px-4 py-2 transition-colors ${
                          state.selected
                            ? 'bg-fk-yellow text-fk-black'
                            : state.highlighted
                              ? 'bg-fk-gray-lightest text-fk-gray'
                              : 'text-fk-gray'
                        }`
                      }
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Field.Error className="text-fk-red mt-1 text-sm" match={hasError}>
          {errors[name] || t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
