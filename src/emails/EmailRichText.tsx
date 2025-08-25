import type {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedRelationshipNode,
  SerializedUploadNode
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConverter,
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText
} from '@payloadcms/richtext-lexical/react'
import { Img, Link } from '@react-email/components'
import { Locale } from 'next-intl'

import { env } from '@/env'
import { Page } from '@/payload-types'

interface RichTextProps {
  data: SerializedEditorState
  locale: Locale
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }, locale: Locale) => {
  const { doc } = linkNode.fields
  if (!doc || typeof doc !== 'object') {
    throw new Error('Expected value to be an object')
  }

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL

  switch (doc.relationTo) {
    case 'pages':
      const page = doc.value as unknown as Page
      return `${serverUrl}/${locale}/${page.path}`
    default:
      const url = doc.value as unknown as { url?: string; path?: string }
      if (url.url) {
        return url.url
      }
      if (url.path) {
        return `${serverUrl}/${locale}/${url.path}`
      }
      return ''
  }
}

const renderCustomLinkComponent: (locale: Locale) => JSXConverter<SerializedLinkNode> =
  (locale) =>
  // eslint-disable-next-line react/display-name
  ({ node, nodesToJSX }) => {
    const href = node.fields.url || internalDocToHref({ linkNode: node }, locale)
    return (
      <Link href={href} className="text-orange">
        {nodesToJSX({ nodes: node.children })}
      </Link>
    )
  }

const renderCustomUploadComponent: JSXConverter<SerializedUploadNode> = ({ node }) => {
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

const renderCustomRelationshipComponent: (
  locale: Locale
) => JSXConverter<SerializedRelationshipNode> =
  (locale) =>
  // eslint-disable-next-line react/display-name
  ({ node }) => {
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
    link: renderCustomLinkComponent(locale),
    relationship: renderCustomRelationshipComponent(locale),
    upload: renderCustomUploadComponent
  })

  return <LexicalRichText disableContainer data={data} converters={jsxConverters} />
}
