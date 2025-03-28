import { Check } from 'lucide-react'
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
  const [checked, setChecked] = useState(defaultValue ?? false)

  return (
    <Width width={width ?? 100}>
      <label htmlFor={name} className="text-fk-gray text-sm font-medium">
        {label}
        {required && <span className="text-fk-red ml-1">{'*'}</span>}
      </label>
      <div className="mt-2 mb-4 flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            {...register(name, { required: required ?? false })}
            checked={checked}
          />
          <button
            onClick={() => {
              setValue(name, !checked)
              setChecked(!checked)
            }}
            type="button"
            className={`bg-fk-blue text-fk-white hover:bg-fk-blue-dark focus:ring-fk-black h-7 w-7 rounded border focus:ring-2 focus:outline-none`}
            aria-label={label || 'checkbox'}
          >
            {checked && <Check size={24} />}
          </button>
        </div>
        {required && errors[name] && checked === false && <Error />}
      </div>
    </Width>
  )
}
