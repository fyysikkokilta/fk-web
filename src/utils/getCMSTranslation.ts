import { Translation } from '@/payload-types'

export const getCMSTranslation = (field: number | Translation) => {
  if (typeof field === 'object') {
    return field.translation
  }

  return `Error: Translation not working for id ${field.toString()}`
}
