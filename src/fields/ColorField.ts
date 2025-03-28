// src/fields/color.ts
import type { TextField, TextFieldManyValidation, TextFieldValidation } from 'payload'

export const ColorField = (
  base: Omit<TextField, 'name' | 'type'> & { name?: string } = {}
): TextField => {
  const baseTextField = {
    name: 'color',
    label: 'Color',
    required: true,
    ...base,
    type: 'text' as const,
    admin: {
      description: 'Pick a color',
      components: {
        Field: '@/components/ColorPicker'
      }
    }
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
