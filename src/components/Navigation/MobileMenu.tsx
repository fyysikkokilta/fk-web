'use client'

import { Accordion } from '@base-ui/react/accordion'
import { Drawer } from '@base-ui/react/drawer'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { NavbarBrand } from '@/components/NavbarBrand'
import { Link } from '@/i18n/navigation'
import type { MainNavigation } from '@/payload-types'

import { LanguageSwitcher } from '../LanguageSwitcher'
import { useGetPath, useIsActive } from './utils'

export function MobileMenu({ navigation }: { navigation: MainNavigation }) {
  const isActive = useIsActive()
  const getPath = useGetPath()
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="right">
      <nav className="bg-fk-gray text-fk-white fixed top-0 right-0 left-0 z-50 flex h-12 items-center px-2 font-bold lg:hidden">
        <NavbarBrand
          LinkElement={Link}
          logo={navigation.logo}
          title={navigation.title}
          onClose={close}
        />
        <Drawer.Trigger
          className="text-fk-white hover:text-fk-gray-light ml-auto p-2"
          aria-label={t('mainNavigation.openMenu')}
        >
          <Menu className="h-6 w-6" />
        </Drawer.Trigger>
      </nav>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/50 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 lg:hidden" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end lg:hidden">
          <Drawer.Popup className="bg-fk-gray text-fk-white border-fk-gray-light flex h-full w-[min(20rem,85vw)] transform-[translateX(var(--drawer-swipe-movement-x))] flex-col border-l transition-transform duration-300 ease-out data-ending-style:transform-[translateX(100%)] data-starting-style:transform-[translateX(100%)] data-swiping:select-none">
            <Drawer.Title className="sr-only">{t('mainNavigation.menu')}</Drawer.Title>
            <div className="border-fk-gray-light flex h-12 shrink-0 items-center border-b pr-2">
              <LanguageSwitcher LinkElement={Link} onClick={close} />
              <Drawer.Close
                className="text-fk-white hover:text-fk-gray-light ml-auto p-2"
                aria-label={t('mainNavigation.closeMenu')}
              >
                <X className="h-6 w-6" />
              </Drawer.Close>
            </div>
            <Accordion.Root
              render={<ul />}
              role="menu"
              aria-label={t('mainNavigation.menu')}
              className="bg-fk-gray text-fk-white min-h-0 flex-1 overflow-y-auto font-bold tracking-wide uppercase"
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
                          'flex w-full items-center justify-between px-4 py-3 text-left font-bold tracking-wide uppercase ' +
                          'hover:text-fk-gray-light focus-visible:relative' +
                          (isActiveItem
                            ? 'decoration-fk-yellow underline decoration-2 underline-offset-4'
                            : '')
                        }
                        onClick={close}
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
                            'group flex w-full items-center justify-between px-4 py-3 text-left font-bold tracking-wide uppercase ' +
                            'hover:text-fk-gray-light border-fk-yellow border-b-4 focus-visible:relative' +
                            (childIsActive
                              ? 'decoration-fk-yellow underline decoration-2 underline-offset-2'
                              : '')
                          }
                        >
                          {item.label}
                          <ChevronDown className="h-6 w-6 transition-transform duration-200 ease-in-out group-data-panel-open:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Panel className="bg-fk-gray px-4 py-2">
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
                                          ? 'decoration-fk-yellow underline decoration-2 underline-offset-2'
                                          : '')
                                      }
                                    >
                                      {child.label}
                                      <ChevronDown className="h-6 w-6 transition-transform duration-200 ease-in-out group-data-panel-open:rotate-180" />
                                    </Accordion.Trigger>
                                  </Accordion.Header>
                                  <Accordion.Panel className="bg-fk-gray px-4 py-2">
                                    <ul role="menu">
                                      {grandChildren.map((grandChild) => {
                                        const grandChildPath = getPath(grandChild)
                                        return (
                                          <li role="menuitem" key={grandChild.id}>
                                            <Link
                                              href={grandChildPath}
                                              onClick={close}
                                              className={
                                                'block px-4 py-2 font-bold tracking-wide uppercase ' +
                                                'hover:text-fk-gray-light' +
                                                (isActive(grandChildPath)
                                                  ? 'decoration-fk-yellow underline decoration-2 underline-offset-2'
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
                                  onClick={close}
                                  className={
                                    'block px-4 py-2 font-bold tracking-wide uppercase ' +
                                    'hover:text-fk-gray-light' +
                                    (isActiveChild
                                      ? 'decoration-fk-yellow underline decoration-2 underline-offset-2'
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
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
