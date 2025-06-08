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
                  borderRadius: '0.5rem',
                  borderWidth: '1px',
                  padding: '0.25rem 0.5rem',
                  borderColor: errors[name] ? '#911f2f' : state.isFocused ? '#fbdb1d' : '#bfbaba',
                  boxShadow: state.isFocused
                    ? '0 0 0 2px #fbdb1d'
                    : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    borderColor: errors[name] ? '#911f2f' : '#fbdb1d'
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? '#fbdb1d'
                    : state.isFocused
                      ? '#fefcc3'
                      : 'white',
                  color: state.isSelected ? '#201e1e' : '#201e1e',
                  '&:active': {
                    backgroundColor: '#fbdb1d'
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
