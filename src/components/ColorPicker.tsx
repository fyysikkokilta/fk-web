'use client'

import { SelectInput, useField } from '@payloadcms/ui'

const colors = [
  { value: '#ffffff', label: 'White' }, // FK white
  { value: '#000000', label: 'Black' }, // FK black
  { value: '#201e1e', label: 'Gray' }, // FK gray
  { value: '#fbdb1d', label: 'Yellow' }, // FK yellow
  { value: '#ff8a04', label: 'Orange' }, // Website orange
  { value: '#007bff', label: 'Blue' }, // Website blue
  { value: '#28a745', label: 'Green' }, // Website green
  { value: '#911f2f', label: 'Red' }, // Website red
  { value: '#6f42c1', label: 'Purple' } // Website purple
]

const ColorPicker = ({
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
            {"You can find the Guild's brand guide"}&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://drive.google.com/file/d/1da1PtMwj560AMniAhUz35KpcIleTHrV0/view"
            >
              {'here'}
            </a>
            {'.'}
          </span>
          <div>
            {'Color preview: '}
            <input
              type="color"
              style={{
                WebkitAppearance: 'none',
                border: 'none',
                outline: 'none',
                padding: 0,
                backgroundColor: '#141414'
              }}
              disabled={true}
              value={value}
            />
          </div>
        </div>
      }
      options={colors}
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

export default ColorPicker
