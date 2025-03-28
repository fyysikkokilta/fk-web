import { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { Locale } from 'next-intl'

export const internalDocToHref = (
  { linkNode }: { linkNode: SerializedLinkNode },
  locale: Locale
) => {
  const { relationTo, value } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const path = value.path

  switch (relationTo) {
    case 'pages':
      return `/${locale}/${path}`
    default:
      return `/${locale}/${relationTo}/${path}`
  }
}
