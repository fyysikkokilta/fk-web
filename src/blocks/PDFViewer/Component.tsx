'use client'

import { Select } from '@base-ui/react/select'
import { Check, ChevronDown, ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

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

  const selectedOption = selectOptions[selectedIndex]

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="bg-fk-white border-fk-gray overflow-hidden rounded-lg border shadow-sm">
        {/* Header */}
        <div className="border-fk-gray border-b px-6 py-4">
          <div className="flex items-center gap-4">
            {documents.length > 1 ? (
              <Select.Root
                value={selectedOption?.value ?? null}
                onValueChange={(newValue: number | null) => {
                  if (newValue !== null) {
                    setSelectedIndex(newValue)
                  }
                }}
                modal={false}
              >
                <Select.Trigger
                  className="text-fk-gray focus-visible:ring-fk-yellow group flex w-full items-center justify-between border-none bg-transparent text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
                  aria-label={t('pdfViewer.selectDocument')}
                >
                  <Select.Value>
                    {(val: number | null) => {
                      const option = selectOptions.find((opt) => opt.value === val)
                      return option ? option.label : ''
                    }}
                  </Select.Value>
                  <Select.Icon>
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-200 group-data-popup-open:rotate-180"
                    />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner alignItemWithTrigger={false} className="z-50">
                    <Select.Popup
                      className="mt-1 max-h-60 overflow-auto rounded-lg border-0 bg-white shadow-lg"
                      style={{ minWidth: 'var(--anchor-width)', width: 'var(--anchor-width)' }}
                    >
                      <Select.List>
                        {selectOptions.map((option) => (
                          <Select.Item
                            key={option.value}
                            value={option.value}
                            className={(state) =>
                              `flex cursor-pointer items-center justify-between px-4 py-2 transition-colors ${
                                state.selected
                                  ? 'bg-fk-yellow text-fk-black'
                                  : state.highlighted
                                    ? 'bg-fk-gray-lightest text-fk-gray'
                                    : 'text-fk-gray'
                              }`
                            }
                          >
                            <Select.ItemText>{option.label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            ) : (
              <span className="text-fk-gray text-lg font-semibold">{title}</span>
            )}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-fk-white relative aspect-3/4 w-full">
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
