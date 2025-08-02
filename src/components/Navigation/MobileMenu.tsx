'use client'

import { Accordion } from '@base-ui-components/react/accordion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'
import { Link } from '@/i18n/navigation'
import type { MainNavigation } from '@/payload-types'

import { LanguageSwitcher } from '../LanguageSwitcher'
import { useGetPath, useIsActive } from './utils'

export function MobileMenu({ navigation }: { navigation: MainNavigation }) {
  const isActive = useIsActive()
  const getPath = useGetPath()
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
      <nav className="bg-fk-gray text-fk-white fixed top-0 right-0 left-0 z-50 flex items-center px-4 font-bold lg:hidden">
        <NavbarBrand
          LinkElement={Link}
          logo={navigation.logo}
          title={navigation.title}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <LanguageSwitcher LinkElement={Link} />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-fk-white hover:text-fk-gray-light ml-auto p-2"
          aria-label={
            isMobileMenuOpen ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')
          }
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-x-0 top-12 bottom-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="border-fk-gray-light bg-fk-gray fixed inset-x-0 top-12 z-50 max-h-[calc(100dvh-3rem)] w-full overflow-y-auto border-t lg:hidden">
            <Accordion.Root
              render={<ul />}
              role="menu"
              aria-label={t('mainNavigation.menu')}
              className="bg-fk-gray text-fk-white font-bold tracking-wide uppercase"
            >
              {navigation.items.map((item) => {
                const itemPath = getPath(item)
                const hasChildren = item.type === 'menu' && (item?.children?.length ?? 0) > 0
                const children = item?.children || []
                const isActiveItem = isActive(itemPath)
                const childIsActive = children.some((child) => isActive(getPath(child)))

                if (item.type !== 'menu') {
                  return (
                    <li role="menuitem" key={item.id} className="border-fk-gray-light border-b">
                      <Link
                        href={itemPath}
                        className={
                          'flex w-full items-center justify-between px-6 py-3 text-left font-bold tracking-wide uppercase ' +
                          'hover:text-fk-gray-light focus-visible:relative' +
                          (isActiveItem
                            ? ' decoration-fk-yellow underline decoration-2 underline-offset-4'
                            : '')
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                }

                if (hasChildren) {
                  return (
                    <Accordion.Item
                      render={<li />}
                      role="menuitem"
                      key={item.id}
                      value={item.id}
                      className="border-fk-gray-light border-b"
                    >
                      <Accordion.Header render={<div />}>
                        <Accordion.Trigger
                          aria-haspopup="menu"
                          className={
                            'group flex w-full items-center justify-between px-6 py-3 text-left font-bold tracking-wide uppercase ' +
                            'hover:text-fk-gray-light border-fk-yellow border-b-4 focus-visible:relative' +
                            (childIsActive
                              ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                              : '')
                          }
                        >
                          {item.label}
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 ease-in-out group-data-[panel-open]:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Panel className="bg-fk-gray px-6 py-2">
                        <Accordion.Root render={<ul />} role="menu" className="mt-2">
                          {children.map((child) => {
                            const childPath = getPath(child)
                            const isActiveChild = isActive(childPath)
                            const hasGrandChildren =
                              child.type === 'menu' && (child?.subchildren?.length ?? 0) > 0
                            const grandChildren = child?.subchildren || []
                            const grandChildrenIsActive = grandChildren.some((grandChild) =>
                              isActive(getPath(grandChild))
                            )

                            if (hasGrandChildren) {
                              return (
                                <Accordion.Item
                                  key={child.id}
                                  render={<li />}
                                  role="menuitem"
                                  value={child.id}
                                >
                                  <Accordion.Header render={<div />}>
                                    <Accordion.Trigger
                                      aria-haspopup="menu"
                                      className={
                                        'group flex w-full items-center justify-between px-4 py-2 text-left font-bold tracking-wide uppercase ' +
                                        'hover:text-fk-gray-light border-fk-yellow border-b-4 focus-visible:relative' +
                                        (grandChildrenIsActive
                                          ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                          : '')
                                      }
                                    >
                                      {child.label}
                                      <ChevronDown className="h-5 w-5 transition-transform duration-200 ease-in-out group-data-[panel-open]:rotate-180" />
                                    </Accordion.Trigger>
                                  </Accordion.Header>
                                  <Accordion.Panel className="bg-fk-gray px-6 py-2">
                                    <ul role="menu">
                                      {grandChildren.map((grandChild) => {
                                        const grandChildPath = getPath(grandChild)
                                        return (
                                          <li role="menuitem" key={grandChild.id}>
                                            <Link
                                              href={grandChildPath}
                                              onClick={() => setIsMobileMenuOpen(false)}
                                              className={
                                                'block px-4 py-2 font-bold tracking-wide uppercase ' +
                                                'hover:text-fk-gray-light' +
                                                (isActive(grandChildPath)
                                                  ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                                  : '')
                                              }
                                            >
                                              {grandChild.label}
                                            </Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </Accordion.Panel>
                                </Accordion.Item>
                              )
                            }

                            return (
                              <li role="menuitem" key={child.id}>
                                <Link
                                  href={childPath}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={
                                    'block px-4 py-2 font-bold tracking-wide uppercase ' +
                                    'hover:text-fk-gray-light' +
                                    (isActiveChild
                                      ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                      : '')
                                  }
                                >
                                  {child.label}
                                </Link>
                              </li>
                            )
                          })}
                        </Accordion.Root>
                      </Accordion.Panel>
                    </Accordion.Item>
                  )
                }

                return null
              })}
            </Accordion.Root>
          </div>
        </>
      )}
    </>
  )
}
