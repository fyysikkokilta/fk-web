'use client'

import { NavigationMenu } from '@base-ui-components/react/navigation-menu'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NavbarBrand } from '@/components/NavbarBrand'
import { Link as NextLink } from '@/i18n/navigation'
import type { MainNavigation } from '@/payload-types'

import { useGetPath, useIsActive } from './utils'

export function DesktopMenu({ navigation }: { navigation: MainNavigation }) {
  const isActive = useIsActive()
  const getPath = useGetPath()
  const t = useTranslations()

  return (
    <NavigationMenu.Root
      aria-label={t('mainNavigation.menu')}
      className="bg-fk-gray text-fk-white mx-auto hidden w-full min-w-max items-center justify-between px-2 font-bold lg:flex lg:px-8 xl:px-12 2xl:container"
    >
      <NavigationMenu.List role="menubar" className="relative flex w-full items-center">
        <NavigationMenu.Item role="menuitem">
          <NavbarBrand LinkElement={Link} logo={navigation.logo} title={navigation.title} />
        </NavigationMenu.Item>

        <NavigationMenu.Item role="menuitem">
          <LanguageSwitcher LinkElement={Link} />
        </NavigationMenu.Item>

        {navigation.items.map((item, i) => {
          const itemPath = getPath(item)
          const hasChildren = item.type === 'menu' && (item?.children?.length ?? 0) > 0
          const children = item?.children || []
          const isActiveItem = isActive(itemPath)
          const childIsActive = children.some((child) => isActive(getPath(child)))

          if (item.type !== 'menu') {
            return (
              <NavigationMenu.Item
                className={i === 0 ? 'ml-auto' : ''}
                role="menuitem"
                key={item.id}
              >
                <Link
                  href={itemPath}
                  active={isActiveItem}
                  className={
                    topLevelClassName +
                    ' border-transparent' +
                    (isActiveItem
                      ? ' decoration-fk-yellow underline decoration-2 underline-offset-4'
                      : '')
                  }
                >
                  {item.label}
                </Link>
              </NavigationMenu.Item>
            )
          }

          if (hasChildren) {
            return (
              <NavigationMenu.Item
                className={i === 0 ? 'ml-auto' : ''}
                role="menuitem"
                aria-haspopup="menu"
                key={item.id}
              >
                <NavigationMenu.Trigger
                  className={
                    topLevelClassName +
                    ' border-fk-yellow' +
                    (childIsActive
                      ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                      : '')
                  }
                >
                  {item.label}
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={contentClassName}>
                  <NavigationMenu.Root orientation="vertical">
                    <NavigationMenu.List role="menu">
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
                            <Fragment key={child.id}>
                              <NavigationMenu.Item role="menuitem" aria-haspopup="menu">
                                <NavigationMenu.Trigger
                                  className={
                                    linkCardClassName +
                                    ' border-fk-yellow border-r-4' +
                                    (grandChildrenIsActive
                                      ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                      : '')
                                  }
                                >
                                  {child.label}
                                </NavigationMenu.Trigger>
                                <NavigationMenu.Content className={contentClassName}>
                                  <NavigationMenu.Root orientation="vertical">
                                    <NavigationMenu.List role="menu">
                                      {grandChildren.map((grandChild) => {
                                        const grandChildPath = getPath(grandChild)
                                        const isActiveGrandChild = isActive(grandChildPath)
                                        return (
                                          <NavigationMenu.Item role="menuitem" key={grandChild.id}>
                                            <Link
                                              href={grandChildPath}
                                              active={isActiveGrandChild}
                                              className={
                                                linkCardClassName +
                                                (isActiveGrandChild
                                                  ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                                  : '')
                                              }
                                            >
                                              {grandChild.label}
                                            </Link>
                                          </NavigationMenu.Item>
                                        )
                                      })}
                                    </NavigationMenu.List>
                                  </NavigationMenu.Root>
                                </NavigationMenu.Content>
                              </NavigationMenu.Item>

                              <NavigationMenu.Portal>
                                <NavigationMenu.Positioner
                                  sideOffset={10}
                                  align="start"
                                  side="right"
                                  className="z-10 box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
                                  style={{
                                    ['--duration' as string]: '0.35s',
                                    ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)'
                                  }}
                                >
                                  <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] bg-fk-gray text-fk-white border-fk-yellow relative h-(--popup-height) origin-(--transform-origin) transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 min-[500px]:w-(--popup-width)">
                                    <NavigationMenu.Arrow className="flex transition-[left] duration-(--duration) ease-(--easing) data-[side=bottom]:top-[-11px] data-[side=left]:right-[-11px] data-[side=left]:rotate-90 data-[side=right]:left-[-11px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-11px] data-[side=top]:rotate-180">
                                      <Arrow className="fill-fk-yellow stroke-fk-yellow h-3 w-3 border-none" />
                                    </NavigationMenu.Arrow>
                                    <NavigationMenu.Viewport className="relative h-full w-full" />
                                  </NavigationMenu.Popup>
                                </NavigationMenu.Positioner>
                              </NavigationMenu.Portal>
                            </Fragment>
                          )
                        }

                        return (
                          <NavigationMenu.Item role="menuitem" key={child.id}>
                            <Link
                              href={childPath}
                              active={isActiveChild}
                              className={
                                linkCardClassName +
                                (isActiveChild
                                  ? ' decoration-fk-yellow underline decoration-2 underline-offset-2'
                                  : '')
                              }
                            >
                              {child.label}
                            </Link>
                          </NavigationMenu.Item>
                        )
                      })}
                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            )
          }

          return null
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          sideOffset={10}
          side="bottom"
          align="start"
          collisionPadding={{ top: 0, bottom: 20, left: 20, right: 20 }}
          className="z-10 box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
          style={{
            ['--duration' as string]: '0.35s',
            ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] bg-fk-gray text-fk-white relative h-(--popup-height) origin-(--transform-origin) transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
            <NavigationMenu.Arrow className="flex transition-[left] duration-(--duration) ease-(--easing) data-[side=bottom]:top-[-11px] data-[side=left]:right-[-11px] data-[side=left]:rotate-90 data-[side=right]:left-[-11px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-11px] data-[side=top]:rotate-180">
              <Arrow className="fill-fk-yellow stroke-fk-yellow h-3 w-3 border-none" />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className="relative h-full w-full" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

function Link(props: NavigationMenu.Link.Props) {
  return <NavigationMenu.Link render={<NextLink href={props.href ?? ''} />} {...props} />
}

function Arrow(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" {...props}>
      <path d="M6 0L0 10H12L6 0Z" className="fill-fk-gray stroke-fk-gray" />
    </svg>
  )
}

const topLevelClassName =
  'box-border flex items-center justify-center h-12 border-b-4 ' +
  'px-2 bg-fk-gray text-fk-white font-bold uppercase tracking-wide ' +
  'leading-6 no-underline ' +
  'hover:text-fk-gray-light active:text-fk-gray-light data-[popup-open]:text-fk-gray-light ' +
  'focus-visible:relative'

const contentClassName =
  'h-full' +
  'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] ' +
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ' +
  'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] ' +
  'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] ' +
  'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] ' +
  'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]'

const linkCardClassName =
  'w-full text-left block px-4 py-3 no-underline text-inherit font-bold uppercase tracking-wide ' +
  'hover:text-fk-gray-light ' +
  'data-[popup-open]:text-fk-gray-light'
