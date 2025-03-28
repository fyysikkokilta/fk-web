import type { Locale } from 'next-intl'

import { RichText } from '@/components/RichText/BlockRichText'
import type { AlignBlock as AlignBlockType } from '@/payload-types'

interface AlignBlockProps {
  block: AlignBlockType
  locale: Locale
}

const parentStyles = {
  left: 'flex justify-start mr-auto',
  center: 'flex justify-center mx-auto',
  right: 'flex justify-end ml-auto'
}

const childStyles = {
  left: 'flex flex-col items-start',
  center: 'flex flex-col items-center',
  right: 'flex flex-col items-end'
}

export const Align = ({ block, locale }: AlignBlockProps) => {
  const { align, width, content } = block

  return (
    <div className={parentStyles[align]} style={{ width: `${width}%` }}>
      <RichText data={content} locale={locale} extraClassName={childStyles[align]} />
    </div>
  )
}
