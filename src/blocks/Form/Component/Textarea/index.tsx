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
  return (
    <Width width={width ?? 100}>
      <div className="mb-4">
        <label htmlFor={name} className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-fk-red ml-1">{'*'}</span>}
        </label>
        <textarea
          id={name}
          defaultValue={defaultValue ?? ''}
          rows={rows}
          className={`focus:ring-fk-yellow focus:border-fk-yellow w-full resize-y rounded-lg border px-4 py-3 shadow-sm transition-colors focus:ring-2 focus:outline-none ${
            errors[name] ? 'border-fk-red' : 'border-fk-gray-lightest'
          }`}
          {...register(name, { required: required ?? false })}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
