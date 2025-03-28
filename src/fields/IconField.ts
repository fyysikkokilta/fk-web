import { TextField, TextFieldManyValidation, TextFieldValidation } from 'payload'

export const IconField = (
  base: Omit<TextField, 'name' | 'type'> & { name?: string } = {}
): TextField => {
  const baseTextField = {
    name: 'icon',
    label: 'Icon',
    required: true,
    ...base,
    type: 'text' as const,
    admin: {
      description: 'You can find all icons on the page https://lucide.dev/icons/',
      components: {
        Field: '@/components/IconPicker'
      }
    },
    validate: (value: string | string[] | undefined | null) => {
      if (!value) {
        return 'Please select an icon'
      }
      return true
    },
    localized: false
  }

  if (base.hasMany) {
    return {
      ...baseTextField,
      hasMany: true,
      maxRows: base.maxRows,
      minRows: base.minRows,
      validate: base.validate as TextFieldManyValidation
    }
  }
  return {
    ...baseTextField,
    hasMany: false,
    maxRows: undefined,
    minRows: undefined,
    validate: base.validate as TextFieldValidation
  }
}
