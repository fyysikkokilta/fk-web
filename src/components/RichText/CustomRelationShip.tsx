import { SerializedRelationshipNode } from '@payloadcms/richtext-lexical'
import { Locale } from 'next-intl'

import { BlockLink } from '../BlockLink'

export const CustomRelationship = ({
  node,
  locale
}: {
  node: SerializedRelationshipNode
  locale: Locale
}) => {
  const { relationTo, value } = node

  switch (relationTo) {
    case 'pages':
      if (typeof value !== 'object') {
        return null
      }
      return <BlockLink type="page" document={value} locale={locale} />
    default:
      return null
  }
}
