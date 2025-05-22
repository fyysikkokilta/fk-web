import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText
} from '@payloadcms/richtext-lexical/react'
import { Locale } from 'next-intl'

import { Align } from '@/blocks/Align/Component'
import { Card } from '@/blocks/Card/Component'
import { Collapsible } from '@/blocks/Collapsible/Component'
import { Icon } from '@/blocks/Icon/Component'
import type {
  AlignBlock as AlignBlockType,
  CardBlock as CardBlockType,
  CollapsibleBlock as CollapsibleBlockType,
  IconBlock as IconBlockType
} from '@/payload-types'

import { CustomRelationship } from './CustomRelationShip'
import { CustomUpload } from './CustomUpload'
import { internalDocToHref } from './internalDocToHref'
import ProseWrapper from './ProseWrapper'

interface RichTextProps {
  data: SerializedEditorState
  locale: Locale
  extraClassName?: string
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<AlignBlockType | CardBlockType | CollapsibleBlockType | IconBlockType>
  | SerializedInlineBlockNode<IconBlockType>

// Use this component for rich text content inside blocks
// The main component cannot be used here because it contains blocks which may be server components
export const RichText = ({ data, locale, extraClassName }: RichTextProps) => {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (linkNode) => internalDocToHref(linkNode, locale)
    }),
    relationship: ({ node }) => CustomRelationship({ node, locale }),
    upload: CustomUpload,
    blocks: {
      ...defaultConverters.blocks,
      align: ({ node }) => <Align block={node.fields} locale={locale} />,
      card: ({ node }) => <Card block={node.fields} locale={locale} />,
      collapsible: ({ node }) => <Collapsible block={node.fields} locale={locale} />
    },
    inlineBlocks: {
      ...defaultConverters.inlineBlocks,
      icon: ({ node }) => <Icon block={node.fields} />
    }
  })

  return (
    <ProseWrapper extraClassName={extraClassName}>
      <LexicalRichText disableContainer data={data} converters={jsxConverters} />
    </ProseWrapper>
  )
}
