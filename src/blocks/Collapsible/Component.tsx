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
  const contentId = `collapsible-content-${block.id ?? Math.random().toString(36).substring(2, 9)}`

  return (
    <details
      open={block.isOpenByDefault ?? false}
      className="group border-fk-gray m-3 w-full rounded border-2"
    >
      <summary
        className="border-fk-gray flex w-full cursor-pointer list-none items-center justify-between rounded p-3 group-open:border-b-2 [&::-webkit-details-marker]:hidden"
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
  )
}
