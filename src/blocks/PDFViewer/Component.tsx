'use client'

import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Select from 'react-select'

import type { PDFViewerBlock as PDFViewerBlockType } from '@/payload-types'

interface PDFViewerProps {
  block: PDFViewerBlockType
}

export const PDFViewer = ({ block }: PDFViewerProps) => {
  const t = useTranslations()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const getUrlAndTitle = () => {
    const documents = block.type === 'internal' ? block.documents : block.externalDocuments
    if (!documents?.length) return null

    const selectedDoc = documents[selectedIndex]
    if (!selectedDoc || typeof selectedDoc === 'number') return null

    return {
      url: selectedDoc.url || '',
      title: selectedDoc.title || 'PDF Document',
      documents
    }
  }

  const urlAndTitle = getUrlAndTitle()

  if (!urlAndTitle) {
    return null
  }

  const { url, title, documents } = urlAndTitle

  const selectOptions = documents
    .filter((doc) => typeof doc !== 'number')
    .map((doc, index) => ({
      value: index,
      label: doc.title || `Document ${index + 1}`
    }))

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="bg-fk-white border-fk-gray overflow-hidden rounded-lg border shadow-sm">
        {/* Header */}
        <div className="border-fk-gray border-b px-6 py-4">
          <div className="flex items-center gap-4">
            {documents.length > 1 ? (
              <Select
                value={selectOptions[selectedIndex]}
                onChange={(option) => option && setSelectedIndex(option.value)}
                options={selectOptions}
                aria-label={t('pdfViewer.selectDocument')}
                className="min-w-[200px]"
                classNamePrefix="fk"
                isSearchable={false}
                instanceId={`pdf-viewer-document-select-${block.id}`}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    border: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--color-fk-gray)',
                    cursor: 'pointer',
                    outline: state.isFocused ? '2px solid var(--color-fk-yellow)' : 'none'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? 'var(--color-fk-yellow)'
                      : state.isFocused
                        ? 'var(--color-fk-gray-lightest)'
                        : 'transparent',
                    color: 'var(--color-fk-gray)',
                    cursor: 'pointer',
                    border: state.isSelected ? '1px solid var(--color-fk-black)' : 'none'
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'var(--color-fk-gray)',
                    fontWeight: '600'
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    border: '1px solid var(--color-fk-gray)'
                  })
                }}
              />
            ) : (
              <span className="text-fk-gray text-lg font-semibold">{title}</span>
            )}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-fk-white relative aspect-[3/4] w-full">
          <iframe
            src={`${url}#page=1&view=FitH&toolbar=0`}
            className="h-full w-full border-none"
            title={title}
          >
            {t('pdfViewer.fallbackMessage')}
          </iframe>
        </div>

        {/* Footer */}
        <div className="border-fk-gray bg-fk-white border-t px-6 py-3">
          <div className="text-fk-gray flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText size={24} />
              {'PDF'}
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink size={16} />
              {t('pdfViewer.openInNewTab')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
