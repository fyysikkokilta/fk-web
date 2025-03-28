import { ExternalLink, FileText, Folder } from 'lucide-react'
import { Locale } from 'next-intl'

import type { Document, Page } from '@/payload-types'

type LinkType = 'file' | 'page'

interface BlockLinkProps {
  document: Document | Page
  type?: LinkType
  className?: string
  locale?: Locale
}

const getIcon = (type: LinkType) => {
  switch (type) {
    case 'file':
      return <FileText size={24} />
    case 'page':
      return <Folder size={24} />
  }
}

const getLabel = (type: LinkType) => {
  switch (type) {
    case 'file':
      return 'PDF Document'
    case 'page':
      return 'Page'
  }
}

const getUrl = (document: Document | Page, type: LinkType, locale: Locale): string => {
  if (type === 'file' && 'url' in document) {
    return document.url || ''
  }
  if (type === 'page' && 'path' in document) {
    return `/${locale}/${document.path}`
  }
  return '#'
}

export const BlockLink = ({
  document,
  type = 'file',
  className = '',
  locale = 'fi'
}: BlockLinkProps) => {
  const url = getUrl(document, type, locale)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`border-fk-gray bg-fk-white hover:bg-fk-gray-lightest flex h-fit w-fit items-center gap-5 rounded-lg border p-4 shadow-sm ${className}`}
    >
      {getIcon(type)}
      <div className="flex-1">
        <p className="text-fk-gray font-medium">{document.title}</p>
        <p className="text-fk-gray-light text-xs">{getLabel(type)}</p>
      </div>
      <ExternalLink size={24} />
    </a>
  )
}
