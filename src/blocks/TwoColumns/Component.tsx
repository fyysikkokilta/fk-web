import type { Locale } from 'next-intl'

import { RichText } from '@/components/RichText/BlockRichText'
import type { TwoColumnsBlock as TwoColumnsBlockType } from '@/payload-types'

interface TwoColumnsProps {
  block: TwoColumnsBlockType
  locale: Locale
}

export const TwoColumns = ({ block, locale }: TwoColumnsProps) => {
  const { wrapOnMobile, layout, contentLeft, contentRight } = block

  return (
    <div className={`${wrapOnMobile ? 'md:grid' : 'grid'} ${layout} gap-4`}>
      <div className="flex-1">
        <RichText data={contentLeft} locale={locale} />
      </div>
      <div className="flex-1">
        <RichText data={contentRight} locale={locale} />
      </div>
    </div>
  )
}
