import { SerializedHeadingNode } from '@payloadcms/richtext-lexical'
import { JSXConverter } from '@payloadcms/richtext-lexical/react'

import { extractTextFromHeadingChildren } from '@/utils/extractTextFromHeadingChildren'
import { slugify } from '@/utils/slugify'

export const renderCustomHeading: JSXConverter<SerializedHeadingNode> = ({ node, nodesToJSX }) => {
  const Tag = node.tag
  const text = extractTextFromHeadingChildren(node.children)

  return <Tag id={slugify(text)}>{nodesToJSX({ nodes: node.children })}</Tag>
}
