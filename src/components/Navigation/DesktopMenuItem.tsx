'use client'

import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu'

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
    'w-full p-2 whitespace-nowrap uppercase focus:outline-none cursor-pointer flex items-center gap-1 tracking-wide text-fk-white hover:text-fk-white/70'
  const activeClass = isActiveItem ? 'underline' : ''
  const buttonClassName = `${baseButtonClass} ${activeClass}`

  if (level === 'main' && hasChildren && children.length > 0) {
    return (
      <Menu
        aria-label={item.label}
        menuClassName="bg-fk-gray text-fk-white p-2"
        transition={true}
        menuButton={
          <MenuButton className={`${buttonClassName} border-fk-yellow border-b-4`}>
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
      <Link className={`${buttonClassName} border-b-4 border-transparent`} href={itemPath}>
        {item.label}
      </Link>
    )
  }

  if (level === 'sub' && hasChildren && children.length > 0) {
    return (
      <SubMenu
        aria-label={item.label}
        label={item.label}
        className={`${buttonClassName} border-fk-yellow border-r-4`}
        menuClassName="bg-fk-gray text-fk-white p-2 !ml-5"
        shift={-10}
      >
        {children.map((child, childIndex) => (
          <DesktopMenuItem key={child.id || childIndex} item={child} level="subsub" />
        ))}
      </SubMenu>
    )
  }

  return (
    <MenuItem className={buttonClassName} href={itemPath} aria-label={item.label}>
      {item.label}
    </MenuItem>
  )
}
