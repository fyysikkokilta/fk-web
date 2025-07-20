'use client'

import { ChevronDown } from 'lucide-react'
import type { Locale } from 'next-intl'

import { RichText } from '@/components/RichText/BlockRichText'
import type { CollapsibleBlock as CollapsibleBlockType } from '@/payload-types'

interface CollapsibleBlockProps {
  block: CollapsibleBlockType
  locale: Locale
}

export const Collapsible = ({ block, locale }: CollapsibleBlockProps) => {
  const contentId = `collapsible-content-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="prose-h2:my-3 w-full">
      <details open={block.isOpenByDefault ?? false} className="group rounded">
        <summary
          className="border-fk-gray flex w-full cursor-pointer list-none items-center justify-between rounded border-2 p-3 [&::-webkit-details-marker]:hidden"
          aria-controls={contentId}
        >
          <div className="text-left text-lg font-bold">{block.title}</div>
          <div className="flex h-7 w-7 items-center justify-center">
            <ChevronDown
              size={24}
              className="transition-transform duration-200 group-open:rotate-180"
            />
          </div>
        </summary>
        <div id={contentId} className="px-4 pb-3">
          <RichText data={block.content} locale={locale} />
        </div>
      </details>
    </div>
  )
}
