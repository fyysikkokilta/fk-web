import type { Form } from '@/payload-types'

type FormFieldBlock = NonNullable<Form['fields']>[number]

export const buildInitialFormState = (fields: FormFieldBlock[]) => {
  return fields.reduce((initialSchema, field) => {
    if (field.blockType === 'checkbox') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? false
      }
    }
    if (field.blockType === 'email') {
      return {
        ...initialSchema,
        [field.name]: ''
      }
    }
    if (field.blockType === 'number') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? ''
      }
    }
    if (field.blockType === 'select') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? ''
      }
    }
    if (field.blockType === 'text') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? ''
      }
    }
    if (field.blockType === 'textarea') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? ''
      }
    }
    return initialSchema
  }, {})
}
