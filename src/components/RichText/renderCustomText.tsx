import { SerializedTextNode } from '@payloadcms/richtext-lexical'
import { JSXConverter } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { ColorStateKeys, textState } from '@/utils/textState'

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

export const renderCustomText: JSXConverter<SerializedTextNode> = ({ node }) => {
  const styles: React.CSSProperties = {}

  if (node.$) {
    Object.entries(textState).forEach(([stateKey, stateValues]) => {
      const stateValue = node.$ && (node.$[stateKey] as ColorStateKeys)

      if (stateValue && stateValues[stateValue]) {
        Object.assign(styles, stateValues[stateValue].css)
      }
    })
  }

  let text: React.ReactNode = node.text
  if (node.format & IS_BOLD) text = <strong>{text}</strong>
  if (node.format & IS_ITALIC) text = <em>{text}</em>
  if (node.format & IS_UNDERLINE) text = <span style={{ textDecoration: 'underline' }}>{text}</span>
  if (node.format & IS_STRIKETHROUGH)
    text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
  if (node.format & IS_SUBSCRIPT) text = <sub>{text}</sub>
  if (node.format & IS_SUPERSCRIPT) text = <sup>{text}</sup>
  if (node.format & IS_CODE) text = <code>{text}</code>
  if (node['$']) text = <span style={styles}>{text}</span>
  return text
}
