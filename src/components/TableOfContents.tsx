'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { RefObject, useEffect, useRef, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const mainHeadingRef = useRef<IntersectionObserverEntry>(undefined)
  const headingElementsRef: RefObject<Record<string, IntersectionObserverEntry>> = useRef({})
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const contentRoot = document.getElementById('page-content-root')
    if (!contentRoot) return

    // Find all heading elements (h2-h6), excluding h1
    const headingElements = contentRoot.querySelectorAll('h2, h3, h4, h5, h6')

    const mainElements = contentRoot.querySelectorAll('h1, #main-navigation')
    const lastMainElement = mainElements.item(mainElements.length - 1)

    const extractedHeadings: Heading[] = Array.from(headingElements).map((element) => {
      const level = parseInt(element.tagName[1])
      const text = element.textContent || ''
      const id = element.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      // Ensure the element has an ID for scrolling
      if (!element.id) {
        element.id = id
      }

      return { id, text, level }
    })

    setHeadings(extractedHeadings)

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

        const getIndexFromId = (id: string) =>
          Array.from(headingElements).findIndex((heading) => heading.id === id)
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

    headingElements.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

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

  return (
    <>
      <nav
        ref={mobileNavRef}
        className="border-fk-black/20 bg-fk-white/50 fixed top-0 left-0 z-10 w-full overflow-y-auto border-b-1 backdrop-blur-sm lg:hidden"
      >
        {activeHeading && (
          <div className="flex items-center justify-between">
            <button
              className="w-full cursor-pointer rounded-md px-6 py-4"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle table of contents"
            >
              <div className="flex items-center justify-between">
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
                    className={`rounded-md transition-colors duration-200 ${
                      activeId === heading.id
                        ? 'text-fk-white bg-fk-orange font-medium'
                        : 'text-fk-black'
                    }`}
                    style={{
                      marginLeft: `${(heading.level - 1) * 0.75}rem`
                    }}
                  >
                    <a href={`#${heading.id}`} className="block rounded-md py-1.5 pl-2 text-sm">
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>

      <nav className="sticky top-4 h-fit max-h-[calc(100dvh-2rem)] w-[20%] overflow-y-auto max-lg:hidden">
        <ul className="ml-0 p-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`rounded-md transition-colors duration-200 ${
                activeId === heading.id ? 'text-fk-white bg-fk-orange font-medium' : 'text-fk-black'
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
