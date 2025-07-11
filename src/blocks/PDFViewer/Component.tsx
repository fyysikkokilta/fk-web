'use client'

import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { BlockLink } from '@/components/BlockLink'
import type { PDFViewerBlock as PDFViewerBlockType } from '@/payload-types'

interface PDFViewerProps {
  block: PDFViewerBlockType
}

export const PDFViewer = ({ block }: PDFViewerProps) => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(true)

  if (typeof block.document === 'number') {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Mobile view - simple link block */}
      <div className="block md:hidden">
        <BlockLink document={block.document} />
      </div>

      {/* Desktop view - full PDF viewer */}
      <div className="bg-fk-white border-fk-gray hidden overflow-hidden rounded-lg border shadow-sm md:block">
        {/* Header */}
        <div className="border-fk-gray border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-fk-gray text-lg font-semibold">{block.document.title}</span>
            <a
              href={block.document.url || ''}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm"
            >
              <ExternalLink size={24} />
              {t('pdfViewer.openInNewTab')}
            </a>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-fk-gray-lightest relative aspect-[3/4] w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse space-y-4">
                <div className="bg-fk-gray-lightest mx-auto h-8 w-3/4 rounded"></div>
                <div className="bg-fk-gray-lightest mx-auto h-4 w-1/2 rounded"></div>
                <div className="bg-fk-gray-lightest mx-auto h-4 w-2/3 rounded"></div>
                <div className="bg-fk-gray-lightest mx-auto h-4 w-1/2 rounded"></div>
              </div>
            </div>
          )}
          <iframe
            src={`/api/pdf?url=${encodeURIComponent(block.document.url || '')}#page=1&view=FitH&toolbar=0`}
            className="h-full w-full border-none"
            title={block.document.title}
            onLoad={() => setIsLoading(false)}
          >
            <p>
              {t.rich('pdfViewer.fallbackMessage', {
                downloadLink: (chunks) => {
                  if (typeof block.document === 'number') {
                    return null
                  }
                  return (
                    <a href={block.document.url || ''} target="_blank" rel="noopener noreferrer">
                      {chunks}
                    </a>
                  )
                }
              })}
            </p>
          </iframe>
        </div>

        {/* Footer */}
        <div className="border-fk-gray bg-fk-gray-lightest border-t px-6 py-3">
          <div className="text-fk-gray-light flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText size={24} />
              {'PDF'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
