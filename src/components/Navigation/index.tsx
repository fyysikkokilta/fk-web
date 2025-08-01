'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'
import type { MainNavigation } from '@/payload-types'

import { DesktopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'

interface MainNavigationProps {
  navigation: MainNavigation
}

export function MainNavigation({ navigation }: MainNavigationProps) {
  const t = useTranslations()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lock/unlock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className="bg-fk-gray text-fk-white fixed top-0 right-0 left-0 z-50 w-full font-bold">
        <div className="mx-auto hidden items-center justify-between px-4 md:flex lg:px-8 xl:px-12 2xl:container">
          <NavbarBrand logo={navigation.logo} title={navigation.title} variant="desktop" />
          <DesktopMenu items={navigation.items} />
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between px-4">
            <NavbarBrand
              logo={navigation.logo}
              title={navigation.title}
              variant="mobile"
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-fk-white hover:text-fk-gray-light p-2"
              aria-label={
                isMobileMenuOpen ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')
              }
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-x-0 top-12 bottom-0 z-40 bg-black/50"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="border-fk-gray-light bg-fk-gray relative z-50 max-h-[calc(100vh-3rem)] overflow-y-auto border-t">
                <MobileMenu items={navigation.items} onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </>
          )}
        </div>
      </nav>
      <div className="h-12" />
    </>
  )
}
