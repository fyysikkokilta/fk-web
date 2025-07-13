import { SerializedRelationshipNode } from '@payloadcms/richtext-lexical'
import { JSXConverter } from '@payloadcms/richtext-lexical/react'

import { BlockLink } from '../BlockLink'

export const renderCustomRelationship: JSXConverter<SerializedRelationshipNode> = ({ node }) => {
  const { relationTo, value } = node

  switch (relationTo) {
    case 'pages':
      if (typeof value !== 'object') {
        return null
      }
      return <BlockLink type="page" document={value} />
    default:
      return null
  }
}
