'use client'

import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'
import { Link, usePathname } from '@/i18n/navigation'
import type { MainNavigation as MainNavigationType, Page } from '@/payload-types'

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

  // Utility function to generate consistent menu item classes
  const getMenuItemClasses = useCallback(
    (
      isActive: boolean,
      hasChildren: boolean,
      isDisabled: boolean,
      variant: 'desktop' | 'mobile' = 'desktop',
      childrenIndicator?: 'border-b-4' | 'border-r-4'
    ) => {
      const baseClasses =
        'px-3 py-3 whitespace-nowrap uppercase transition-colors hover:no-underline hover:opacity-70 focus:outline-none'
      const variantClasses =
        variant === 'desktop'
          ? 'flex items-center gap-1 tracking-wide'
          : 'block text-base no-underline'
      const activeClass = isActive ? 'underline' : ''
      const childrenClass =
        hasChildren && childrenIndicator ? `border-fk-yellow ${childrenIndicator}` : ''
      const disabledClass = isDisabled ? 'cursor-default' : ''

      return `${baseClasses} ${variantClasses} ${activeClass} ${childrenClass} ${disabledClass}`.trim()
    },
    []
  )

  const isActive = useCallback(
    (path: string | null | undefined) => {
      if (!path) return false
      return pathname.endsWith(path)
    },
    [pathname]
  )

  const getPath = useCallback((item: MainNavigationType['items'][number]) => {
    if (item.type === 'page') {
      if (typeof item.page === 'number') return '#'
      return item.page?.path || '#'
    }
    return item.url || '#'
  }, [])

  const isDisabled = useCallback((path: string) => path === '#', [])

  const handleMobileNavigation = useCallback(
    (item: MainNavigationType['items'][number]) => {
      const path = getPath(item)
      if (path !== '#' && (item.page || item.url)) {
        setIsMobileMenuOpen(false)
      }
    },
    [getPath]
  )

  const handleMenuClick = useCallback((event: React.MouseEvent, path: string) => {
    if (path === '#') {
      event.preventDefault()
    }
  }, [])

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const isExpanded = useCallback((id: string) => expandedItems.includes(id), [expandedItems])

  const closeAllMenus = useCallback(() => {
    setFocusedSubmenu(null)
    setFocusedSubsubmenu(null)
  }, [])

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
          menuButtonRef.current?.focus()
        } else {
          closeAllMenus()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen, closeAllMenus])

  const handleKeyDown = useCallback(
    (
      event: React.KeyboardEvent,
      itemId: string,
      hasChildren: boolean,
      level: 'main' | 'sub' | 'subsub' = 'main'
    ) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          if (hasChildren) {
            event.preventDefault()
            if (level === 'main') {
              setFocusedSubmenu(focusedSubmenu === itemId ? null : itemId)
            } else if (level === 'sub') {
              setFocusedSubsubmenu(focusedSubsubmenu === itemId ? null : itemId)
            }
          } else {
            closeAllMenus()
          }
          break
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          if (hasChildren) {
            if (level === 'main') {
              setFocusedSubmenu(itemId)
            } else if (level === 'sub') {
              setFocusedSubsubmenu(itemId)
            }
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (level === 'sub') {
            setFocusedSubmenu(null)
          } else if (level === 'subsub') {
            setFocusedSubsubmenu(null)
          }
          break
        case 'Escape':
          closeAllMenus()
          break
      }
    },
    [focusedSubmenu, focusedSubsubmenu, closeAllMenus]
  )

  const renderDesktopMenuItem = useCallback(
    (
      item:
        | MainNavigationType['items'][number]
        | NonNullable<MainNavigationType['items'][number]['children']>[number],
      level: 'main' | 'sub' | 'subsub' = 'main',
      index: number = 0
    ) => {
      const itemPath = getPath(item)
      const itemDisabled = isDisabled(itemPath)
      const hasChildren =
        level !== 'subsub' &&
        Boolean(
          ('children' in item && item.children && item.children.length > 0) ||
            ('subchildren' in item && item.subchildren && item.subchildren.length > 0)
        )
      const submenuId = `${level}-submenu-${item.id || index}`
      const menuitemId = `${level}-menuitem-${item.id || index}`
      const isOpen =
        level === 'main'
          ? focusedSubmenu === (item.id || index.toString())
          : level === 'sub'
            ? focusedSubsubmenu === (item.id || index.toString())
            : false

      const borderIndicator =
        level === 'main' ? 'border-b-4' : level === 'sub' ? 'border-r-4' : undefined

      // Get children with proper typing
      const children =
        level === 'main'
          ? 'children' in item
            ? item.children
            : null
          : level === 'sub' && 'subchildren' in item
            ? item.subchildren
            : null

      return (
        <li
          key={item.id || `desktop-${level}-${index}`}
          className="relative"
          role="none"
          onMouseEnter={() => {
            if (hasChildren) {
              if (level === 'main') {
                setFocusedSubmenu(item.id || index.toString())
              } else if (level === 'sub') {
                setFocusedSubsubmenu(item.id || index.toString())
              }
            }
          }}
          onMouseLeave={() => {
            if (level === 'main') {
              setFocusedSubmenu(null)
              setFocusedSubsubmenu(null)
            } else if (level === 'sub') {
              setFocusedSubsubmenu(null)
            }
          }}
        >
          <Link
            href={itemPath}
            id={menuitemId}
            className={getMenuItemClasses(
              isActive((item.page as Page)?.path),
              hasChildren,
              itemDisabled,
              'desktop',
              borderIndicator
            )}
            role="menuitem"
            aria-haspopup={hasChildren ? 'menu' : undefined}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-controls={hasChildren ? submenuId : undefined}
            aria-disabled={itemDisabled || undefined}
            onKeyDown={(e) => handleKeyDown(e, item.id || index.toString(), hasChildren, level)}
            onBlur={(e) => {
              const relatedTarget = e.relatedTarget as HTMLElement | null
              if (
                !relatedTarget ||
                !relatedTarget.closest(`[data-submenu="${item.id || index}"]`)
              ) {
                if (level === 'main') {
                  setFocusedSubmenu(null)
                } else if (level === 'sub') {
                  setFocusedSubsubmenu(null)
                }
              }
            }}
            onClick={(e) => handleMenuClick(e, itemPath)}
          >
            {item.label}
          </Link>
          {hasChildren && isOpen && children && (
            <ul
              id={submenuId}
              className={`bg-fk-gray absolute w-fit shadow-lg ${
                level === 'main' ? 'top-full left-0' : 'top-0 left-full'
              }`}
              data-submenu={item.id || index}
              role="menu"
              aria-labelledby={menuitemId}
            >
              {children.map((child: MainNavigationType['items'][number], childIndex) =>
                renderDesktopMenuItem(child, level === 'main' ? 'sub' : 'subsub', childIndex)
              )}
            </ul>
          )}
        </li>
      )
    },
    [
      getPath,
      isDisabled,
      getMenuItemClasses,
      isActive,
      focusedSubmenu,
      focusedSubsubmenu,
      handleKeyDown,
      handleMenuClick
    ]
  )

  const renderMobileItem = useCallback(
    (
      item:
        | MainNavigationType['items'][number]
        | NonNullable<MainNavigationType['items'][number]['children']>[number],
      level: number = 0,
      idx: number = 0
    ) => {
      const itemPath = getPath(item)
      const itemDisabled = isDisabled(itemPath)
      const children =
        ('children' in item ? item.children : 'subchildren' in item ? item.subchildren : null) || []
      const hasChildren = children.length > 0
      const submenuId = `mobile-submenu-${item.id || idx}-${level}`
      const itemKey = item.id || `mobile-${level}-${idx}`
      const isItemExpanded = isExpanded(itemKey)

      return (
        <div key={itemKey}>
          <div
            className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${isActive(itemPath) || isItemExpanded ? 'border-fk-yellow border-l-4' : ''}`}
          >
            <Link
              href={itemPath}
              onClick={() => handleMobileNavigation(item)}
              className={`${getMenuItemClasses(isActive(itemPath), false, itemDisabled, 'mobile')} ${!hasChildren ? 'w-full' : 'flex-grow'}`}
              role="menuitem"
              aria-disabled={itemDisabled || undefined}
            >
              {item.label}
            </Link>
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(itemKey)}
                className="p-2"
                aria-expanded={isItemExpanded}
                aria-controls={submenuId}
                aria-label={`${isItemExpanded ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')} ${item.label}`}
              >
                {isItemExpanded ? (
                  <ChevronUp size={24} className="text-fk-yellow" />
                ) : (
                  <ChevronDown size={24} className="text-fk-yellow" />
                )}
              </button>
            )}
          </div>
          {hasChildren && isItemExpanded && (
            <div id={submenuId} className="mt-1 ml-4 space-y-1" role="menu">
              {children.map((child, childIdx) => renderMobileItem(child, level + 1, childIdx))}
            </div>
          )}
          {idx < (level === 0 ? navigation.items.length - 1 : children.length - 1) && (
            <div className="border-fk-gray-light mx-2 my-2 border-b" />
          )}
        </div>
      )
    },
    [
      getPath,
      isDisabled,
      isExpanded,
      getMenuItemClasses,
      isActive,
      handleMobileNavigation,
      toggleExpanded,
      t,
      navigation.items.length
    ]
  )

  return (
    <nav
      className="bg-fk-gray text-fk-white relative z-50 w-full px-2 py-1 font-bold"
      aria-label={t('mainNavigation.menu')}
    >
      {/* Desktop Navigation */}
      <div className="mx-auto hidden px-4 md:block lg:px-8 xl:px-12 2xl:container">
        <div className="flex items-center justify-between">
          <NavbarBrand logo={navigation.logo} title={navigation.title} variant="desktop" />

          <ul className="flex" role="menubar">
            {navigation.items.map((item, index) => renderDesktopMenuItem(item, 'main', index))}
          </ul>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4">
          <NavbarBrand logo={navigation.logo} title={navigation.title} variant="mobile" />
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={`${isMobileMenuOpen ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="border-fk-gray from-fk-gray via-fk-gray-light to-fk-gray-lightest absolute top-full right-0 left-0 border-t bg-gradient-to-b shadow-lg"
            role="menu"
            aria-label={t('mainNavigation.menu')}
          >
            <div className="space-y-1 px-2 pt-4 pb-4">
              {navigation.items.map((item, idx) => renderMobileItem(item, 0, idx))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
