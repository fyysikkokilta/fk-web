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
import { BoardMemberGrid } from '@/blocks/BoardMemberGrid/Component'
import { Calendar } from '@/blocks/Calendar/Component'
import { Card } from '@/blocks/Card/Component'
import { Collapsible } from '@/blocks/Collapsible/Component'
import { Committee } from '@/blocks/Committee/Component'
import { EmbedVideo } from '@/blocks/EmbedVideo/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FuksiYear } from '@/blocks/FuksiYear/Component'
import { Icon } from '@/blocks/Icon/Component'
import { Newsletter } from '@/blocks/Newsletter/Component'
import { OfficialYear } from '@/blocks/OfficialYear/Component'
import { PageNavigation } from '@/blocks/PageNavigation/Component'
import { PDFViewer } from '@/blocks/PDFViewer/Component'
import { TwoColumns } from '@/blocks/TwoColumns/Component'
import type {
  AlignBlock as AlignBlockType,
  BoardMemberGridBlock as BoardMembersBlockType,
  CalendarBlock as CalendarBlockType,
  CardBlock as CardBlockType,
  CollapsibleBlock as CollapsibleBlockType,
  CommitteeBlock as CommitteeBlockType,
  EmbedVideoBlock as EmbedVideoBlockType,
  FormBlock as FormBlockType,
  FuksiYearBlock as FuksiYearBlockType,
  IconBlock as IconBlockType,
  NewsletterBlock as NewsletterBlockType,
  OfficialYearBlock as OfficialYearBlockType,
  PageNavigationBlock as PageNavigationBlockType,
  PDFViewerBlock as PdfViewerBlockType,
  TwoColumnsBlock as TwoColumnsBlockType
} from '@/payload-types'

import { CustomRelationship } from './CustomRelationShip'
import { CustomText } from './CustomText'
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
  | SerializedBlockNode<
      | AlignBlockType
      | BoardMembersBlockType
      | CalendarBlockType
      | CardBlockType
      | CollapsibleBlockType
      | CommitteeBlockType
      | EmbedVideoBlockType
      | FormBlockType
      | FuksiYearBlockType
      | NewsletterBlockType
      | OfficialYearBlockType
      | PageNavigationBlockType
      | PdfViewerBlockType
      | TwoColumnsBlockType
    >
  | SerializedInlineBlockNode<IconBlockType>

export const RichText = ({ data, locale, extraClassName }: RichTextProps) => {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (linkNode) => internalDocToHref(linkNode, locale)
    }),
    text: ({ node }) => <CustomText node={node} />,
    relationship: ({ node }) => <CustomRelationship node={node} locale={locale} />,
    upload: ({ node }) => <CustomUpload node={node} />,
    blocks: {
      ...defaultConverters.blocks,
      align: ({ node }) => <Align block={node.fields} locale={locale} />,
      'board-member-grid': ({ node }) => <BoardMemberGrid block={node.fields} />,
      calendar: ({ node }) => <Calendar block={node.fields} locale={locale} />,
      card: ({ node }) => <Card block={node.fields} locale={locale} />,
      collapsible: ({ node }) => <Collapsible block={node.fields} locale={locale} />,
      committee: ({ node }) => <Committee block={node.fields} />,
      'embed-video': ({ node }) => <EmbedVideo block={node.fields} />,
      form: ({ node }) => <FormBlock block={node.fields} locale={locale} />,
      'fuksi-year': ({ node }) => <FuksiYear block={node.fields} />,
      newsletter: ({ node }) => <Newsletter block={node.fields} locale={locale} />,
      'official-year': ({ node }) => <OfficialYear block={node.fields} />,
      'page-navigation': ({ node }) => <PageNavigation block={node.fields} />,
      'pdf-viewer': ({ node }) => <PDFViewer block={node.fields} />,
      'two-columns': ({ node }) => <TwoColumns block={node.fields} locale={locale} />
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
