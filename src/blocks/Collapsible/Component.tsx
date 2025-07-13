'use client'

import { ChevronDown } from 'lucide-react'
import type { Locale } from 'next-intl'
import { useState } from 'react'

import { RichText } from '@/components/RichText/BlockRichText'
import type { CollapsibleBlock as CollapsibleBlockType } from '@/payload-types'

interface CollapsibleBlockProps {
  block: CollapsibleBlockType
  locale: Locale
}

export const Collapsible = ({ block, locale }: CollapsibleBlockProps) => {
  const [isOpen, setIsOpen] = useState(block.isOpenByDefault ?? false)

  return (
    <div className="prose-h2:my-3 w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between"
      >
        <span className="text-left">{block.title}</span>
        <div className="flex h-7 w-7 items-center justify-center">
          <ChevronDown
            size={24}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-4 pt-3">
          <RichText data={block.content} locale={locale} />
        </div>
      </div>
    </div>
  )
}
