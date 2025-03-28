'use client'

import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link, usePathname } from '@/i18n/navigation'
import type { MainNavigation as MainNavigationType, Media, Page } from '@/payload-types'

interface MainNavigationProps {
  navigation: MainNavigationType
}

export function MainNavigation({ navigation }: MainNavigationProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const isActive = (path: string | null | undefined) => {
    if (!path) return false
    return pathname.endsWith(path)
  }

  const getPath = (item: MainNavigationType['items'][number]) => {
    if (item.type === 'page') {
      if (typeof item.page === 'number') {
        return '#'
      }
      return item.page?.path || '#'
    }
    return item.url || '#'
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isExpanded = (id: string) => expandedItems.includes(id)

  return (
    <nav id="main-navigation" className="bg-fk-gray text-fk-white relative z-50 w-full font-bold">
      {/* Desktop Navigation */}
      <div className="mx-auto hidden px-4 md:block lg:px-8 xl:px-12 2xl:container">
        <div className="flex items-center gap-4">
          <div className="flex min-w-fit items-center gap-5">
            <Link href="/" className="flex items-center gap-2 hover:no-underline">
              {navigation.logo && (
                <Image
                  priority
                  src={(navigation.logo as Media).url!}
                  alt={(navigation.logo as Media).alt || navigation.title}
                  width={48}
                  height={48}
                />
              )}
              <span className="text-2xl text-nowrap max-lg:hidden">{navigation.title}</span>
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="ml-auto flex">
            {navigation.items.map((item) => (
              <div key={item.id} className="group/menu relative">
                <Link
                  href={getPath(item)}
                  className={`flex items-center gap-1 px-1 py-4 tracking-wide whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 ${
                    isActive((item.page as Page)?.path) ? 'underline' : ''
                  } ${item.children && item.children.length > 0 ? 'border-fk-yellow border-b-4' : ''}`}
                >
                  <span>{item.label}</span>
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="bg-fk-gray invisible absolute top-15 left-0 mt-0 w-fit opacity-0 shadow-lg transition-all duration-200 group-hover/menu:visible group-hover/menu:opacity-100">
                    <div role="menu">
                      {item.children.map((child) => (
                        <div key={child.id} className="group/submenu relative">
                          <Link
                            href={getPath(child)}
                            className={`block p-2 whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 ${
                              isActive((child.page as Page)?.path) ? 'underline' : ''
                            } ${child.subchildren && child.subchildren.length > 0 ? 'border-fk-yellow border-r-4' : ''}`}
                            role="menuitem"
                          >
                            <span>{child.label}</span>
                          </Link>
                          {child.subchildren && child.subchildren.length > 0 && (
                            <div className="bg-fk-gray invisible absolute top-0 left-full w-fit opacity-0 shadow-lg transition-all duration-200 group-hover/submenu:visible group-hover/submenu:opacity-100">
                              <div role="menu">
                                {child.subchildren.map((grandchild) => (
                                  <Link
                                    key={grandchild.id}
                                    href={getPath(grandchild)}
                                    className={`block p-2 whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 ${
                                      isActive((grandchild.page as Page)?.path) ? 'underline' : ''
                                    }`}
                                    role="menuitem"
                                  >
                                    <span>{grandchild.label}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:no-underline">
              {navigation.logo && (
                <Image
                  priority
                  src={(navigation.logo as Media).url!}
                  alt={(navigation.logo as Media).alt || navigation.title}
                  width={48}
                  height={48}
                />
              )}
              <span className="text-2xl font-bold">{navigation.title}</span>
            </Link>
            <LanguageSwitcher />
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-fk-gray from-fk-gray-dark via-fk-gray to-fk-gray-light mt-2 border-t bg-gradient-to-b shadow-lg">
            <div className="space-y-1 px-2 pt-4 pb-4">
              {navigation.items.map((item, idx) => (
                <div key={item.id}>
                  <div
                    className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${
                      isActive((item.page as Page)?.path) || isExpanded(item.id || '')
                        ? 'bg-fk-gray-dark/70 border-fk-yellow border-l-4'
                        : 'hover:bg-fk-gray-light/70'
                    }`}
                  >
                    <Link
                      href={getPath(item)}
                      className={`block px-3 py-2 text-base whitespace-nowrap no-underline ${
                        !item.children || item.children.length === 0 ? 'w-full' : 'flex-grow'
                      } ${isActive((item.page as Page)?.path) ? 'underline' : ''}`}
                    >
                      <span>{item.label}</span>
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(item.id || '')}
                        className="p-2 focus:outline-none"
                        aria-label={isExpanded(item.id || '') ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded(item.id || '') ? (
                          <ChevronUp size={24} color="#FFD600" />
                        ) : (
                          <ChevronDown size={24} color="#FFD600" />
                        )}
                      </button>
                    )}
                  </div>
                  {item.children && item.children.length > 0 && isExpanded(item.id || '') && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <div key={child.id}>
                          <div
                            className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${
                              isActive((child.page as Page)?.path) || isExpanded(child.id || '')
                                ? 'bg-fk-gray-dark/60 border-fk-yellow border-l-4'
                                : 'hover:bg-fk-gray-light/70'
                            }`}
                          >
                            <Link
                              href={getPath(child)}
                              className={`block px-3 py-2 whitespace-nowrap no-underline ${
                                !child.subchildren || child.subchildren.length === 0
                                  ? 'w-full'
                                  : 'flex-grow'
                              } ${isActive((child.page as Page)?.path) ? 'underline' : ''}`}
                            >
                              <span>{child.label}</span>
                            </Link>
                            {child.subchildren && child.subchildren.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(child.id || '')}
                                className="p-2 focus:outline-none"
                                aria-label={isExpanded(child.id || '') ? 'Collapse' : 'Expand'}
                              >
                                {isExpanded(child.id || '') ? (
                                  <ChevronUp size={24} color="#FFD600" />
                                ) : (
                                  <ChevronDown size={24} color="#FFD600" />
                                )}
                              </button>
                            )}
                          </div>
                          {child.subchildren &&
                            child.subchildren.length > 0 &&
                            isExpanded(child.id || '') && (
                              <div className="mt-1 ml-4 space-y-1">
                                {child.subchildren?.map((grandchild) => (
                                  <Link
                                    key={grandchild.id}
                                    href={getPath(grandchild)}
                                    className={`block w-full rounded-lg px-3 py-2 whitespace-nowrap no-underline transition-colors duration-150 ${
                                      isActive((grandchild.page as Page)?.path)
                                        ? 'bg-fk-gray-dark/50 border-fk-yellow border-l-4 underline'
                                        : 'hover:bg-fk-gray-light/70'
                                    }`}
                                  >
                                    <span>{grandchild.label}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Divider except after last item */}
                  {idx < navigation.items.length - 1 && (
                    <div className="border-fk-gray-light mx-2 my-2 border-b" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
