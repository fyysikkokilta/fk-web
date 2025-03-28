import React from 'react'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'

import type { Form } from '@/payload-types'

import { Error } from '../Error'
import { Width } from '../Width'

type SelectField = Extract<NonNullable<Form['fields']>[number], { blockType: 'select' }>

export const Select: React.FC<
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any
      }>
    >
  } & SelectField
> = ({ name, control, defaultValue, errors, label, options, required, width }) => {
  return (
    <Width width={width ?? 100}>
      <div className="mb-4">
        <label htmlFor={name} className="text-fk-gray mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-fk-red ml-1">{'*'}</span>}
        </label>
        <Controller
          control={control}
          defaultValue={defaultValue ?? ''}
          name={name}
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              classNamePrefix="rs"
              inputId={name}
              instanceId={name}
              onChange={(val) => onChange(val ? val.value : '')}
              options={options ?? []}
              value={options?.find((s) => s.value === value)}
              className={errors[name] ? 'border-fk-red' : ''}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors[name] ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: errors[name] ? '#ef4444' : '#3b82f6'
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? '#3b82f6'
                    : state.isFocused
                      ? '#e0f2fe'
                      : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                  '&:active': {
                    backgroundColor: '#3b82f6'
                  }
                })
              }}
            />
          )}
          rules={{ required: required ?? false }}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
