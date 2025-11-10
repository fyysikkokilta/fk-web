import { Field } from '@base-ui-components/react/field'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { Form } from '@/payload-types'

import { RequiredIndicator } from '../RequiredIndicator'
import { Width } from '../Width'

type TextAreaField = Extract<NonNullable<Form['fields']>[number], { blockType: 'textarea' }>

export const Textarea: React.FC<
  {
    rows?: number
  } & TextAreaField
> = ({ name, defaultValue, label, required, rows = 3, width }) => {
  const t = useTranslations()

  return (
    <Width width={width ?? 100}>
      <Field.Root name={name} className="mb-4">
        <Field.Label className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <RequiredIndicator />}
        </Field.Label>
        <Field.Control
          defaultValue={defaultValue ?? ''}
          required={required ?? undefined}
          render={(props) => (
            <textarea
              {...props}
              rows={rows}
              className="focus-visible:ring-fk-yellow border-fk-gray-lightest data-invalid:border-fk-red w-full resize-y rounded-lg border px-4 py-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
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
