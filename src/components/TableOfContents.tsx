'use client'

import type {
  SerializedEditorState,
  SerializedLexicalNode
} from '@payloadcms/richtext-lexical/lexical'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Locale, useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import {
  AlignBlock,
  CardBlock,
  CollapsibleBlock,
  FormBlock,
  FuksiYearBlock,
  NewsletterBlock,
  TwoColumnsBlock
} from '@/payload-types'
import { extractTextFromHeadingChildren } from '@/utils/extractTextFromHeadingChildren'
import { getSectionHeading, groupNewsByDate, groupNewsByType } from '@/utils/newsletters'
import { slugify } from '@/utils/slugify'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  show: boolean | null | undefined
  richText: SerializedEditorState
}

// Utility function to create a heading object
const createHeading = (text: string, level: number): Heading => ({
  id: slugify(text),
  text: text.trim(),
  level
})

// Utility function to extract headings from RichText data
const extractHeadingsFromRichText = (data: SerializedEditorState, locale: Locale) => {
  const headings: Heading[] = []

  const traverseNodes = (nodes: SerializedLexicalNode[]) => {
    for (const node of nodes) {
      if (node.type === 'heading') {
        const typedNode = node as unknown as {
          tag: string
          type: string
          children: SerializedLexicalNode[]
        }
        const level = parseInt(typedNode.tag.slice(1))
        if (level !== 1) {
          // Extract text content from the heading node
          let text = ''
          if (typedNode.children) {
            text = extractTextFromHeadingChildren(typedNode.children)
          }

          if (text.trim()) {
            headings.push(createHeading(text, level))
          }
        }

        // Recursively traverse children
        if (typedNode.children && Array.isArray(typedNode.children)) {
          traverseNodes(typedNode.children)
        }
      }
      if (node.type === 'block') {
        const typedNode = node as unknown as {
          fields: {
            blockType: string
          }
        }
        switch (typedNode.fields.blockType) {
          case 'align':
            const align = typedNode.fields as AlignBlock
            traverseNodes(align.content.root.children)
            break
          case 'card':
            const card = typedNode.fields as CardBlock
            traverseNodes(card.content.root.children)
            break
          case 'collapsible':
            const collapsible = typedNode.fields as CollapsibleBlock
            traverseNodes(collapsible.content.root.children)
            break
          case 'form':
            const form = typedNode.fields as FormBlock
            if (form.enableIntro && form.introContent) {
              traverseNodes(form.introContent.root.children)
            }
            break
          case 'fuksi-year':
            const fuksiYear = typedNode.fields as FuksiYearBlock
            if (fuksiYear.fuksiGroups) {
              const groups = fuksiYear.fuksiGroups
                .filter((group) => typeof group !== 'number')
                .sort((a, b) => a.name.localeCompare(b.name, 'fi'))
              groups.forEach((group) => {
                headings.push(createHeading(group.name, 2))
              })
            }
            break
          case 'newsletter':
            const newsletter = typedNode.fields as NewsletterBlock
            const newsletterData = newsletter.newsletter
            if (typeof newsletterData === 'number') return
            const newsletterTitle = createHeading(newsletterData.newsletterNumber, 2)
            headings.push(newsletterTitle)
            const newsGroups = groupNewsByType(newsletterData.newsItems || [])
            const sortedNewsHeadings = Object.values(newsGroups)
              .flatMap((group) => {
                const { thisWeek, followingWeeks } = groupNewsByDate(
                  group.items,
                  newsletterData.newsletterNumber
                )

                const thisWeekTitle = getSectionHeading(group.type, 'thisWeek', locale)
                const groupTitleThisWeek = createHeading(thisWeekTitle, 3)

                const followingWeeksTitle = getSectionHeading(group.type, 'followingWeeks', locale)
                const groupTitleFollowingWeeks = createHeading(followingWeeksTitle, 3)

                const thisWeekHeadings = thisWeek
                  .filter((item) => typeof item !== 'number')
                  .map((item) => createHeading(item.title, 4))

                if (thisWeekHeadings.length > 0) {
                  thisWeekHeadings.unshift(groupTitleThisWeek)
                }

                const followingWeeksHeadings = followingWeeks
                  .filter((item) => typeof item !== 'number')
                  .map((item) => createHeading(item.title, 4))

                if (followingWeeksHeadings.length > 0) {
                  followingWeeksHeadings.unshift(groupTitleFollowingWeeks)
                }

                return [...thisWeekHeadings, ...followingWeeksHeadings]
              })
              .filter((item) => !!item)
            headings.push(...sortedNewsHeadings)
            break
          case 'two-columns':
            const block = typedNode.fields as TwoColumnsBlock
            traverseNodes(block.contentLeft.root.children)
            traverseNodes(block.contentRight.root.children)
            break
          default:
            break
        }
      }
    }
  }

  // Start traversal from the root
  if (data.root && data.root.children) {
    traverseNodes(data.root.children)
  }

  return headings
}

interface TableOfContentsProps {
  show: boolean | null | undefined
  richText: SerializedEditorState
}

export const TableOfContents = ({ show, richText }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  const headings = extractHeadingsFromRichText(richText, locale)

  const mainHeadingRef = useRef<IntersectionObserverEntry>(undefined)
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({})
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mainElements = document.querySelectorAll('h1, #main-navigation')
    const lastMainElement = mainElements.item(mainElements.length - 1)

    const observer = new IntersectionObserver(
      (entries) => {
        const leadElement = entries.at(0)
        if (leadElement?.target.tagName === 'H1' || leadElement?.target.id === 'main-heading') {
          mainHeadingRef.current = leadElement
        }

        headingElementsRef.current = entries.reduce((map, heading) => {
          map[heading.target.id] = heading
          return map
        }, headingElementsRef.current)

        const visibleHeadings: IntersectionObserverEntry[] = []
        Object.values(headingElementsRef.current).forEach((headingElement) => {
          if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
        })

        if (visibleHeadings.length === 0 && mainHeadingRef.current?.isIntersecting) {
          setActiveId('')
          return
        }

        if (visibleHeadings.length === 1) {
          setActiveId(visibleHeadings[0].target.id)
          return
        }

        const getIndexFromId = (id: string) => headings.findIndex((heading) => heading.id === id)
        const byIndex = (a: IntersectionObserverEntry, b: IntersectionObserverEntry) =>
          getIndexFromId(a.target.id) - getIndexFromId(b.target.id)

        if (visibleHeadings.length > 1) {
          const sortedVisibleHeadings = visibleHeadings.sort(byIndex)
          setActiveId(sortedVisibleHeadings[0].target.id)
        }
      },
      {
        rootMargin: '-20px 0px -60% 0px'
      }
    )

    if (lastMainElement) {
      observer.observe(lastMainElement)
    }

    headings.forEach((heading) => {
      const headingElement = document.getElementById(heading.id)
      if (headingElement) {
        observer.observe(headingElement)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    if (mainHeadingRef.current?.isIntersecting && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
  }, [mainHeadingRef.current?.isIntersecting, isDrawerOpen])

  // Close drawer on outside click
  useEffect(() => {
    if (!isDrawerOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDrawerOpen])

  const activeHeading = headings.find((h) => h.id === activeId)

  // If table of contents is not shown, return a div with a width of 20%
  if (!show) return <div className="lg:w-[20%]" />

  return (
    <>
      <nav
        ref={mobileNavRef}
        className="border-fk-black/20 bg-fk-white/50 fixed top-12 left-0 z-10 w-full overflow-y-auto border-b backdrop-blur-sm lg:hidden"
      >
        {activeHeading && (
          <div className="flex items-center justify-between">
            <button
              className="w-full cursor-pointer rounded-md px-6 py-4"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label={t('tableOfContents.toggle')}
            >
              <div className="flex items-center justify-between text-left">
                <span>{activeHeading.text}</span>
                {isDrawerOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>
          </div>
        )}
        {isDrawerOpen && (
          <>
            <div className="shadow-sm lg:hidden lg:shadow-none">
              <ul className="ml-0 max-h-[60vh] overflow-y-auto p-2">
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={`rounded-md border-2 transition-colors duration-200 ${
                      activeId === heading.id
                        ? 'bg-fk-yellow border-fk-black'
                        : 'border-transparent'
                    }`}
                    style={{
                      marginLeft: `${(heading.level - 1) * 0.75}rem`
                    }}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="block rounded-md py-1.5 pl-2 text-sm"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>

      <nav
        className={`scrollbar ${
          headings.length > 0 ? 'border-fk-black' : 'border-transparent'
        } sticky top-20 h-fit max-h-[calc(100dvh-5rem)] w-[20%] overflow-y-auto rounded border-2 max-lg:hidden`}
      >
        <ul className="ml-0 p-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`rounded-md border-2 transition-colors duration-200 ${
                activeId === heading.id ? 'bg-fk-yellow border-fk-black' : 'border-transparent'
              }`}
              style={{
                marginLeft: `${(heading.level - 2) * 0.75}rem`
              }}
            >
              <a href={`#${heading.id}`} className="block rounded-md py-1.5 pl-2 text-sm">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
