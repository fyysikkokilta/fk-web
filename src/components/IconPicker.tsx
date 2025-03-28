'use client'

import { SelectInput, useField } from '@payloadcms/ui'
import { IconName } from 'lucide-react/dynamic'
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'
import * as React from 'react'

const icons = Object.keys(dynamicIconImports).map((icon) => ({
  label: icon,
  value: icon
}))

const IconPicker = ({
  field: { label, required, hasMany },
  path
}: {
  field: { label: string; required?: boolean; hasMany?: boolean }
  path: string
}) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <SelectInput
      path={path}
      name={path}
      value={value}
      required={required}
      label={label}
      Description={
        <div>
          <span className="field-description">
            {'You can find all icons available'}&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://lucide.dev/icons/">
              {'here'}
            </a>
            {'.'}
          </span>
          <div>
            {'Icon preview: '}
            {value && Array.isArray(value) ? (
              value.map((v) => <DynamicIcon key={v} name={v as IconName} size={24} />)
            ) : (
              <DynamicIcon name={value as IconName} size={24} />
            )}
          </div>
        </div>
      }
      options={icons}
      hasMany={hasMany}
      onChange={(option) => {
        if (Array.isArray(option)) {
          setValue(option.map((o) => o.value))
        } else {
          setValue(option.value)
        }
      }}
    />
  )
}

export default IconPicker
