'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'

import { DesktopMenuItem } from './DesktopMenuItem'
import { MobileMenuItem } from './MobileMenuItem'
import type { MainNavigationProps } from './types'

export function MainNavigation({ navigation }: MainNavigationProps) {
  const t = useTranslations()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set())
  const [liveMessage, setLiveMessage] = useState<string>('')

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isMobileMenuOpen) return

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

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
          menuButtonRef.current?.focus()
        } else {
          // Close all submenus
          setOpenSubmenus(new Set())
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Announce submenu changes
  useEffect(() => {
    if (openSubmenus.size > 0) {
      const lastOpened = Array.from(openSubmenus).pop()
      if (lastOpened) {
        const menuItem = document.getElementById(`main-menuitem-${lastOpened}`)
        const label = menuItem?.textContent || 'Submenu'
        setLiveMessage(`${label} ${t('mainNavigation.submenu')} ${t('mainNavigation.openMenu')}`)
      }
    } else {
      setLiveMessage('')
    }
  }, [openSubmenus, t])

  const toggleMobileItem = useCallback((id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const handleMobileNavigation = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const openSubmenu = useCallback((id: string) => {
    setOpenSubmenus((prev) => new Set(prev).add(id))
  }, [])

  const closeSubmenu = useCallback((id: string) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  const closeAllMenus = useCallback(() => {
    setOpenSubmenus(new Set())
  }, [])

  return (
    <nav
      className="bg-fk-gray text-fk-white relative z-50 w-full px-2 py-1 font-bold"
      aria-label={t('mainNavigation.menu')}
    >
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      {/* Desktop Navigation */}
      <div className="mx-auto hidden px-4 md:block lg:px-8 xl:px-12 2xl:container">
        <div className="flex items-center justify-between">
          <NavbarBrand logo={navigation.logo} title={navigation.title} variant="desktop" />
          <ul className="flex" role="menubar">
            {navigation.items.map((item, index) => {
              const itemId = item.id || index.toString()
              return (
                <DesktopMenuItem
                  key={itemId}
                  item={item}
                  level="main"
                  index={index}
                  isOpen={openSubmenus.has(itemId)}
                  onOpen={() => openSubmenu(itemId)}
                  onClose={() => closeSubmenu(itemId)}
                  onNavigate={closeAllMenus}
                />
              )
            })}
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
            className="cursor-pointer p-2 focus:outline-none"
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
              {navigation.items.map((item, idx) => (
                <MobileMenuItem
                  key={item.id || idx}
                  item={item}
                  level={0}
                  idx={idx}
                  isExpanded={expandedItems.includes(`mobile-0-${item.id || idx}`)}
                  onToggle={() => toggleMobileItem(`mobile-0-${item.id || idx}`)}
                  onNavigate={handleMobileNavigation}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
