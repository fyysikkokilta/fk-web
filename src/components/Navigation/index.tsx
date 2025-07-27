'use client'

import '@szhsin/react-menu/dist/transitions/slide.css'

import { ControlledMenu, RectElement, useClick, useMenuState } from '@szhsin/react-menu'
import { Menu as LucideMenu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { RefObject, useRef } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'

import { DesktopMenuItem } from './DesktopMenuItem'
import { MobileMenuItem } from './MobileMenuItem'
import type { MainNavigationProps } from './types'

export function MainNavigation({ navigation }: MainNavigationProps) {
  const t = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const [menuState, toggleMenu] = useMenuState({ transition: true })
  const anchorProps = useClick(menuState.state, toggleMenu)

  return (
    <nav
      className="bg-fk-gray text-fk-white relative z-50 w-full font-bold"
      aria-label={t('mainNavigation.menu')}
    >
      <div className="mx-auto hidden items-center justify-between px-4 md:flex lg:px-8 xl:px-12 2xl:container">
        <NavbarBrand logo={navigation.logo} title={navigation.title} variant="desktop" />
        <div className="flex" role="menubar">
          {navigation.items.map((item, index) => (
            <DesktopMenuItem key={item.id || index.toString()} item={item} level="main" />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 md:hidden" ref={ref}>
        <NavbarBrand logo={navigation.logo} title={navigation.title} variant="mobile" />
        <div className="relative">
          <button
            {...anchorProps}
            className="text-fk-white cursor-pointer p-2 focus:outline-none"
            aria-label={t('mainNavigation.toggleMenu')}
          >
            {menuState.state === 'open' || menuState.state === 'closing' ? (
              <X size={24} />
            ) : (
              <LucideMenu size={24} />
            )}
          </button>
          <ControlledMenu
            {...menuState}
            onClose={() => toggleMenu(false)}
            position="initial"
            align="start"
            anchorRef={ref as RefObject<Element | RectElement>}
            transition={true}
            unmountOnClose={true}
            menuClassName="w-screen bg-fk-gray border-t shadow-lg text-fk-white space-y-2 p-2"
          >
            {navigation.items.map((item, idx) => (
              <MobileMenuItem key={item.id || idx} item={item} level="main" />
            ))}
          </ControlledMenu>
        </div>
      </div>
    </nav>
  )
}
