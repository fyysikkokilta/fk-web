import type {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedRelationshipNode,
  SerializedUploadNode
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText
} from '@payloadcms/richtext-lexical/react'
import { Img, Link } from '@react-email/components'
import { Locale } from 'next-intl'

import { env } from '@/env'

interface RichTextProps {
  data: SerializedEditorState
  locale: Locale
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }, locale: Locale) => {
  const { relationTo, value } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const path = value.path

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL

  switch (relationTo) {
    case 'pages':
      return `${serverUrl}/${locale}/${path}`
    default:
      return `${serverUrl}/${locale}/${relationTo}/${path}`
  }
}

const CustomUploadComponent = ({ node }: { node: SerializedUploadNode }) => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, height, url, width } = uploadDoc

    let widthToUse = width
    let heightToUse = height

    if (width && width > 600) {
      widthToUse = 600
      heightToUse = (height ?? 0) * (600 / (width ?? 0))
    }

    return (
      <Img
        alt={alt ?? ''}
        height={heightToUse ?? 0}
        src={encodeURI(url ?? '')}
        width={widthToUse ?? 0}
        className="object-contain"
      />
    )
  }
  if (node.relationTo === 'documents') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    return (
      <Link href={encodeURI(`${serverUrl}${uploadDoc.url}`)} className="text-orange">
        {uploadDoc.filename}
      </Link>
    )
  }

  return null
}

const CustomRelationshipComponent = ({
  node,
  locale
}: {
  node: SerializedRelationshipNode
  locale: Locale
}) => {
  const { relationTo, value } = node
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL
  switch (relationTo) {
    case 'pages':
      if (typeof value !== 'object') {
        return null
      }
      return (
        <Link href={encodeURI(`${serverUrl}/${locale}/${value.path}`)} className="text-orange">
          {value.title}
        </Link>
      )
    default:
      return null
  }
}

export const EmailRichText = ({ data, locale }: RichTextProps) => {
  const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (linkNode) => internalDocToHref(linkNode, locale)
    }),
    relationship: ({ node }) => CustomRelationshipComponent({ node, locale }),
    upload: CustomUploadComponent
  })

  return <LexicalRichText disableContainer data={data} converters={jsxConverters} />
}
