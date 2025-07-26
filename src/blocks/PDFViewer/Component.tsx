import { ExternalLink, FileText } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { PDFViewerBlock as PDFViewerBlockType } from '@/payload-types'

interface PDFViewerProps {
  block: PDFViewerBlockType
}

export const PDFViewer = async ({ block }: PDFViewerProps) => {
  const t = await getTranslations()

  // Determine URL and title based on type
  const getUrlAndTitle = () => {
    if (block.type === 'internal') {
      if (block.document && typeof block.document !== 'number') {
        return {
          url: block.document.url || '',
          title: block.document.title || block.title || 'PDF Document'
        }
      }
      return null
    }

    if (block.type === 'external') {
      if (block.directUrl) {
        return {
          url: block.directUrl,
          title: block.title || 'PDF Document'
        }
      }
      return null
    }

    return null
  }

  const urlAndTitle = getUrlAndTitle()

  if (!urlAndTitle) {
    return null
  }

  const { url, title } = urlAndTitle

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="bg-fk-white border-fk-gray overflow-hidden rounded-lg border shadow-sm">
        {/* Header */}
        <div className="border-fk-gray border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-fk-gray text-lg font-semibold">{title}</span>
            <a
              href={url}
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
          <iframe
            src={`${url}#page=1&view=FitH&toolbar=0`}
            className="h-full w-full border-none"
            title={title}
          >
            {t('pdfViewer.fallbackMessage')}
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
