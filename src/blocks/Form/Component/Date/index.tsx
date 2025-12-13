import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { RequiredIndicator } from '../RequiredIndicator'
import { Width } from '../Width'

type DateField = Extract<NonNullable<Form['fields']>[number], { blockType: 'date' }>

export const Date: React.FC<DateField> = ({ name, defaultValue, label, required, width }) => {
  const t = useTranslations()

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <Field.Label className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <RequiredIndicator />}
        </Field.Label>
        <Field.Control
          type="date"
          defaultValue={defaultValue ?? ''}
          required={required ?? undefined}
          render={(props) => (
            <Input
              {...props}
              className="focus-visible:ring-fk-yellow border-fk-gray-lightest data-invalid:border-fk-red w-full rounded-lg border px-4 py-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          )}
        />
        <Field.Error className="text-fk-red mt-1 text-sm" match="valueMissing">
          {t('form.required')}
        </Field.Error>
      </Field.Root>
    </Width>
  )
}
