import { Field } from '@base-ui/react/field'
import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { RequiredIndicator } from '../RequiredIndicator'
import { Width } from '../Width'

type SelectField = Extract<NonNullable<Form['fields']>[number], { blockType: 'select' }>

export const Select: React.FC<SelectField> = ({
  name,
  defaultValue,
  label,
  options,
  placeholder,
  required,
  width
}) => {
  const t = useTranslations()
  const selectOptions = options ?? []

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <Field.Label className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <RequiredIndicator />}
        </Field.Label>
        <BaseSelect.Root
          name={name}
          defaultValue={defaultValue ?? undefined}
          required={required ?? undefined}
          modal={false}
        >
          <BaseSelect.Trigger className="focus-visible:ring-fk-yellow border-fk-gray-lightest data-invalid:border-fk-red group flex w-full items-center justify-between rounded-lg border px-4 py-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none">
            <BaseSelect.Value placeholder={placeholder ?? undefined}>
              {(val) => {
                const option = selectOptions.find((opt) => opt.value === val)
                return option ? option.label : ''
              }}
            </BaseSelect.Value>
            <BaseSelect.Icon>
              <ChevronDown
                size={16}
                className="transition-transform duration-200 group-data-popup-open:rotate-180"
              />
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
          <BaseSelect.Portal>
            <BaseSelect.Positioner alignItemWithTrigger={false} className="z-50">
              <BaseSelect.Popup
                className="mt-1 max-h-60 overflow-auto rounded-lg border-0 bg-white shadow-lg"
                style={{ minWidth: 'var(--anchor-width)', width: 'var(--anchor-width)' }}
              >
                <BaseSelect.List>
                  {selectOptions.map((option) => (
                    <BaseSelect.Item
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
                      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator>
                        <Check size={16} />
                      </BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
        <Field.Error className="text-fk-red mt-1 text-sm" match="valueMissing">
          {t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
