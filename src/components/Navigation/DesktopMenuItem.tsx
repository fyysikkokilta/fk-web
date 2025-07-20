'use client'

import { FocusableItem, Menu, MenuButton, SubMenu } from '@szhsin/react-menu'

import { Link } from '@/i18n/navigation'
import type { Page } from '@/payload-types'

import type { MenuItemProps } from './types'
import { getChildrenArray, useGetPath, useIsActive } from './utils'

export function DesktopMenuItem({ item, level = 'main' }: MenuItemProps) {
  const isActive = useIsActive()
  const getPath = useGetPath()

  const itemPath = getPath(item)
  const hasChildren = item.type === 'menu' && level !== 'subsub'
  const children = getChildrenArray(item, level, hasChildren)
  const isActiveItem = isActive((item.page as Page)?.path)

  const baseButtonClass =
    'w-full whitespace-nowrap uppercase focus:outline-none cursor-pointer flex items-center gap-1 tracking-wide text-fk-white hover:text-fk-white/70'
  const activeClass = isActiveItem ? 'underline' : ''
  const buttonClassName = `${baseButtonClass} ${activeClass}`

  if (level === 'main' && hasChildren && children.length > 0) {
    return (
      <Menu
        aria-label={item.label}
        menuClassName="bg-fk-gray text-fk-white"
        transition={true}
        menuButton={
          <MenuButton className={`${buttonClassName} border-fk-yellow border-b-4 px-2 py-2.5`}>
            {item.label}
          </MenuButton>
        }
      >
        {children.map((child, childIndex) => (
          <DesktopMenuItem key={child.id || childIndex} item={child} level="sub" />
        ))}
      </Menu>
    )
  }

  if (level === 'main' && !hasChildren) {
    return (
      <Link className={`${buttonClassName} border-b-4 border-transparent px-2`} href={itemPath}>
        {item.label}
      </Link>
    )
  }

  if (level === 'sub' && hasChildren && children.length > 0) {
    return (
      <SubMenu
        aria-label={item.label}
        label={item.label}
        className={buttonClassName}
        menuClassName="bg-fk-gray text-fk-white"
        itemProps={{ className: 'px-4 py-2 w-full border-fk-yellow border-r-4' }}
      >
        {children.map((child, childIndex) => (
          <DesktopMenuItem key={child.id || childIndex} item={child} level="subsub" />
        ))}
      </SubMenu>
    )
  }

  return (
    <FocusableItem aria-label={item.label} className={`${buttonClassName} px-4 py-2`}>
      {({ ref, closeMenu }) => (
        <Link
          ref={ref}
          href={itemPath}
          onClick={({ detail }) => closeMenu(detail === 0 ? 'Enter' : undefined)}
        >
          {item.label}
        </Link>
      )}
    </FocusableItem>
  )
}
