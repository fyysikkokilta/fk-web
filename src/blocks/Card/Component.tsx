import { Locale } from 'next-intl'

import type { CardBlock as CardBlockType } from '@/payload-types'

import { RichText } from '../../components/RichText/BlockRichText'

interface CardBlockProps {
  block: CardBlockType
  locale: Locale
}

export const Card = ({ block, locale }: CardBlockProps) => {
  if (!block.content) {
    return null
  }

  return (
    <div
      className="mx-auto my-8 rounded-lg px-4 py-6 shadow-lg transition-all duration-300 hover:shadow-2xl sm:px-6 lg:px-8"
      style={{
        backgroundColor: block.backgroundColor || '#ffffff',
        color: block.textColor || '#000000'
      }}
    >
      <div className="max-w-none">
        <RichText data={block.content} locale={locale} />
      </div>
    </div>
  )
}
