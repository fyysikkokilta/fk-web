'use client'

import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link, usePathname } from '@/i18n/navigation'
import type { MainNavigation as MainNavigationType, Media, Page } from '@/payload-types'

interface MainNavigationProps {
  navigation: MainNavigationType
}

export function MainNavigation({ navigation }: MainNavigationProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [focusedSubmenu, setFocusedSubmenu] = useState<string | null>(null)
  const [focusedSubsubmenu, setFocusedSubsubmenu] = useState<string | null>(null)

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  const handleMobileNavigation = (item: MainNavigationType['items'][number]) => {
    if (item.page || item.url) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleDesktopKeyboardNavigation = () => {
    setFocusedSubmenu(null)
    setFocusedSubsubmenu(null)
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isExpanded = (id: string) => expandedItems.includes(id)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setFocusedSubmenu(null)
        setFocusedSubsubmenu(null)
        menuButtonRef.current?.focus()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const handleDesktopKeyDown = (
    event: React.KeyboardEvent,
    itemId: string,
    hasChildren: boolean
  ) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (hasChildren) {
          event.preventDefault()
          setFocusedSubmenu(focusedSubmenu === itemId ? null : itemId)
        } else {
          handleDesktopKeyboardNavigation()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (hasChildren) {
          setFocusedSubmenu(itemId)
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (hasChildren) {
          setFocusedSubmenu(itemId)
        }
        break
      case 'Escape':
        setFocusedSubmenu(null)
        setFocusedSubsubmenu(null)
        break
    }
  }

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent,
    itemId: string,
    hasSubchildren: boolean
  ) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (hasSubchildren) {
          event.preventDefault()
          setFocusedSubsubmenu(itemId)
        } else {
          handleDesktopKeyboardNavigation()
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (hasSubchildren) {
          setFocusedSubsubmenu(itemId)
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        setFocusedSubmenu(null)
        break
      case 'Escape':
        setFocusedSubmenu(null)
        break
    }
  }

  const handleSubsubmenuKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        handleDesktopKeyboardNavigation()
        break
      case 'ArrowLeft':
        event.preventDefault()
        setFocusedSubsubmenu(null)
        break
      case 'Escape':
        setFocusedSubsubmenu(null)
        break
    }
  }

  return (
    <nav
      id="main-navigation"
      className="bg-fk-gray text-fk-white relative z-50 w-full font-bold"
      role="navigation"
      aria-label={t('mainNavigation.menu')}
    >
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

          <ul className="ml-auto flex" role="menubar">
            {navigation.items.map((item) => (
              <li
                key={item.id}
                className="group/menu relative"
                role="none"
                onMouseEnter={() => {
                  if (item.children && item.children.length > 0) {
                    setFocusedSubmenu(item.id || null)
                  }
                }}
                onMouseLeave={() => {
                  setFocusedSubmenu(null)
                  setFocusedSubsubmenu(null)
                }}
              >
                <Link
                  href={getPath(item)}
                  className={`flex items-center gap-1 px-1 py-4 tracking-wide whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 focus:opacity-70 focus:outline-none ${
                    isActive((item.page as Page)?.path) ? 'underline' : ''
                  } ${item.children && item.children.length > 0 ? 'border-fk-yellow border-b-4' : ''}`}
                  role="menuitem"
                  aria-haspopup={item.children && item.children.length > 0 ? 'true' : undefined}
                  aria-expanded={focusedSubmenu === item.id ? 'true' : 'false'}
                  aria-label={item.label}
                  onKeyDown={(e) =>
                    handleDesktopKeyDown(
                      e,
                      item.id || '',
                      !!(item.children && item.children.length > 0)
                    )
                  }
                  onBlur={() => {
                    // Delay to allow focus to move to submenu
                    setTimeout(() => {
                      if (!document.activeElement?.closest(`[data-submenu="${item.id}"]`)) {
                        setFocusedSubmenu(null)
                      }
                    }, 100)
                  }}
                >
                  <span>{item.label}</span>
                  {item.children && item.children.length > 0 && (
                    <span className="sr-only">{t('mainNavigation.hasSubmenu')}</span>
                  )}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div
                    className={`bg-fk-gray absolute top-15 left-0 mt-0 w-fit shadow-lg transition-all duration-200 ${
                      focusedSubmenu === item.id ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
                    data-submenu={item.id}
                    role="menu"
                    aria-label={`${item.label} ${t('mainNavigation.hasSubmenu')}`}
                  >
                    <ul role="menu">
                      {item.children.map((child) => (
                        <li
                          key={child.id}
                          className="group/submenu relative"
                          role="none"
                          onMouseEnter={() => {
                            if (child.subchildren && child.subchildren.length > 0) {
                              setFocusedSubsubmenu(child.id || null)
                            }
                          }}
                          onMouseLeave={() => {
                            setFocusedSubsubmenu(null)
                          }}
                        >
                          <Link
                            href={getPath(child)}
                            className={`block p-2 whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 focus:opacity-70 focus:outline-none ${
                              isActive((child.page as Page)?.path) ? 'underline' : ''
                            } ${child.subchildren && child.subchildren.length > 0 ? 'border-fk-yellow border-r-4' : ''}`}
                            role="menuitem"
                            aria-haspopup={
                              child.subchildren && child.subchildren.length > 0 ? 'true' : undefined
                            }
                            aria-expanded={focusedSubsubmenu === child.id ? 'true' : 'false'}
                            aria-label={child.label}
                            onKeyDown={(e) =>
                              handleSubmenuKeyDown(
                                e,
                                child.id || '',
                                !!(child.subchildren && child.subchildren.length > 0)
                              )
                            }
                            onFocus={() => setFocusedSubmenu(item.id || null)}
                            onBlur={() => {
                              setTimeout(() => {
                                if (
                                  !document.activeElement?.closest(
                                    `[data-subsubmenu="${child.id}"]`
                                  )
                                ) {
                                  setFocusedSubsubmenu(null)
                                }
                              }, 100)
                            }}
                          >
                            <span>{child.label}</span>
                            {child.subchildren && child.subchildren.length > 0 && (
                              <span className="sr-only">{t('mainNavigation.hasSubmenu')}</span>
                            )}
                          </Link>
                          {child.subchildren && child.subchildren.length > 0 && (
                            <div
                              className={`bg-fk-gray absolute top-0 left-full w-fit shadow-lg transition-all duration-200 ${
                                focusedSubsubmenu === child.id
                                  ? 'visible opacity-100'
                                  : 'invisible opacity-0'
                              }`}
                              data-subsubmenu={child.id}
                              role="menu"
                              aria-label={`${child.label} ${t('mainNavigation.hasSubmenu')}`}
                            >
                              <ul role="menu">
                                {child.subchildren.map((grandchild) => (
                                  <li key={grandchild.id} role="none">
                                    <Link
                                      href={getPath(grandchild)}
                                      className={`block p-2 whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 focus:opacity-70 focus:outline-none ${
                                        isActive((grandchild.page as Page)?.path) ? 'underline' : ''
                                      }`}
                                      role="menuitem"
                                      aria-label={grandchild.label}
                                      onKeyDown={handleSubsubmenuKeyDown}
                                      onFocus={() => setFocusedSubsubmenu(child.id || null)}
                                    >
                                      <span>{grandchild.label}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
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
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:ring-fk-yellow focus:ring-offset-fk-gray p-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={
              isMobileMenuOpen ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')
            }
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="border-fk-gray from-fk-gray via-fk-gray-light to-fk-gray-lightest absolute top-full right-0 left-0 border-t bg-gradient-to-b shadow-lg"
            role="menu"
            aria-label={t('mainNavigation.menu')}
          >
            <div className="space-y-1 px-2 pt-4 pb-4">
              {navigation.items.map((item, idx) => (
                <div key={item.id}>
                  <div
                    className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${
                      isActive((item.page as Page)?.path) || isExpanded(item.id || '')
                        ? 'border-fk-yellow border-l-4'
                        : ''
                    }`}
                  >
                    <Link
                      href={getPath(item)}
                      onClick={() => handleMobileNavigation(item)}
                      className={`focus:ring-fk-yellow block px-3 py-2 text-base whitespace-nowrap no-underline focus:ring-2 focus:outline-none focus:ring-inset ${
                        !item.children || item.children.length === 0 ? 'w-full' : 'flex-grow'
                      } ${isActive((item.page as Page)?.path) ? 'underline' : ''}`}
                      role="menuitem"
                      aria-label={item.label}
                    >
                      <span>{item.label}</span>
                      {item.children && item.children.length > 0 && (
                        <span className="sr-only">{t('mainNavigation.hasSubmenu')}</span>
                      )}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(item.id || '')}
                        className="focus:ring-fk-yellow p-2 focus:ring-2 focus:outline-none focus:ring-inset"
                        aria-label={
                          isExpanded(item.id || '')
                            ? t('mainNavigation.closeMenu')
                            : t('mainNavigation.openMenu')
                        }
                        aria-expanded={isExpanded(item.id || '')}
                        aria-controls={`submenu-${item.id}`}
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
                    <div
                      id={`submenu-${item.id}`}
                      className="mt-1 ml-4 space-y-1"
                      role="menu"
                      aria-label={`${item.label} ${t('mainNavigation.hasSubmenu')}`}
                    >
                      {item.children.map((child) => (
                        <div key={child.id}>
                          <div
                            className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${
                              isActive((child.page as Page)?.path) || isExpanded(child.id || '')
                                ? 'border-fk-yellow border-l-4'
                                : ''
                            }`}
                          >
                            <Link
                              href={getPath(child)}
                              onClick={() => handleMobileNavigation(child)}
                              className={`focus:ring-fk-yellow block px-3 py-2 whitespace-nowrap no-underline focus:ring-2 focus:outline-none focus:ring-inset ${
                                !child.subchildren || child.subchildren.length === 0
                                  ? 'w-full'
                                  : 'flex-grow'
                              } ${isActive((child.page as Page)?.path) ? 'underline' : ''}`}
                              role="menuitem"
                              aria-label={child.label}
                            >
                              <span>{child.label}</span>
                              {child.subchildren && child.subchildren.length > 0 && (
                                <span className="sr-only">{t('mainNavigation.hasSubmenu')}</span>
                              )}
                            </Link>
                            {child.subchildren && child.subchildren.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(child.id || '')}
                                className="focus:ring-fk-yellow p-2 focus:ring-2 focus:outline-none focus:ring-inset"
                                aria-label={
                                  isExpanded(child.id || '')
                                    ? t('mainNavigation.closeMenu')
                                    : t('mainNavigation.openMenu')
                                }
                                aria-expanded={isExpanded(child.id || '')}
                                aria-controls={`subsubmenu-${child.id}`}
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
                              <div
                                id={`subsubmenu-${child.id}`}
                                className="mt-1 ml-4 space-y-1"
                                role="menu"
                                aria-label={`${child.label} ${t('mainNavigation.hasSubmenu')}`}
                              >
                                {child.subchildren?.map((grandchild) => (
                                  <Link
                                    key={grandchild.id}
                                    href={getPath(grandchild)}
                                    onClick={() => handleMobileNavigation(grandchild)}
                                    className={`focus:ring-fk-yellow block w-full rounded-lg px-3 py-2 whitespace-nowrap no-underline transition-colors duration-150 focus:ring-2 focus:outline-none focus:ring-inset ${
                                      isActive((grandchild.page as Page)?.path)
                                        ? 'border-fk-yellow border-l-4 underline'
                                        : ''
                                    }`}
                                    role="menuitem"
                                    aria-label={grandchild.label}
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
