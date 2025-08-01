'use client'

import { Accordion } from '@base-ui-components/react/accordion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { MainNavigation } from '@/payload-types'

import { useGetPath, useIsActive } from './utils'

export function MobileMenu({
  items,
  onClose
}: {
  items: MainNavigation['items']
  onClose?: () => void
}) {
  const isActive = useIsActive()
  const getPath = useGetPath()
  const t = useTranslations()

  return (
    <Accordion.Root
      role="menubar"
      aria-label={t('mainNavigation.menu')}
      className="bg-fk-gray text-fk-white font-bold tracking-wide uppercase"
    >
      {items.map((item) => {
        const itemPath = getPath(item)
        const hasChildren = item.type === 'menu' && (item?.children?.length ?? 0) > 0
        const children = item?.children || []
        const isActiveItem = isActive(itemPath)
        const childIsActive = children.some((child) => isActive(getPath(child)))

        if (item.type !== 'menu') {
          return (
            <Accordion.Item key={item.id} value={item.id} className="border-fk-gray-light border-b">
              <Accordion.Header className="m-0">
                <Accordion.Trigger
                  role="menuitem"
                  className={
                    'flex w-full items-center justify-between px-4 py-3 text-left font-bold tracking-wide uppercase ' +
                    'hover:text-fk-gray-light focus-visible:relative' +
                    (isActiveItem
                      ? ' decoration-fk-yellow underline decoration-2 underline-offset-4'
                      : '')
                  }
                >
                  <Link href={itemPath} className="flex-1" onClick={onClose}>
                    {item.label}
                  </Link>
                </Accordion.Trigger>
              </Accordion.Header>
            </Accordion.Item>
          )
        }

        if (hasChildren) {
          return (
            <Accordion.Item key={item.id} value={item.id} className="border-fk-gray-light border-b">
              <Accordion.Header className="m-0">
                <Accordion.Trigger
                  role="menuitem"
                  aria-haspopup="menu"
                  className={
                    'group flex w-full items-center justify-between px-4 py-3 text-left font-bold tracking-wide uppercase ' +
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
              <Accordion.Panel className="bg-fk-gray">
                <div className="px-4 py-2">
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
                        <Accordion.Root role="menu" key={child.id} className="mt-2">
                          <Accordion.Item value={child.id}>
                            <Accordion.Header className="m-0">
                              <Accordion.Trigger
                                role="menuitem"
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
                            <Accordion.Panel className="bg-fk-gray">
                              <div className="px-4 py-2">
                                {grandChildren.map((grandChild) => {
                                  const grandChildPath = getPath(grandChild)
                                  return (
                                    <Link
                                      key={grandChild.id}
                                      href={grandChildPath}
                                      role="menuitem"
                                      onClick={onClose}
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
                                  )
                                })}
                              </div>
                            </Accordion.Panel>
                          </Accordion.Item>
                        </Accordion.Root>
                      )
                    }

                    return (
                      <Link
                        key={child.id}
                        href={childPath}
                        role="menuitem"
                        onClick={onClose}
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
                    )
                  })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          )
        }

        return null
      })}
    </Accordion.Root>
  )
}
