import { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

export const extractTextFromHeadingChildren = (children: SerializedLexicalNode[]): string => {
  let text = ''
  for (const child of children) {
    const typedChild = child as unknown as { type: string; text: string }

    if (typedChild.type === 'text') {
      text += typedChild.text || ''
    }
  }
  return text
}
