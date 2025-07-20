'use client'

import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu'

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

  const buttonClassName =
    `w-full p-2 whitespace-nowrap uppercase focus:outline-none cursor-pointer flex items-center gap-1 tracking-wide text-fk-white hover:text-fk-white/70 ${
      isActiveItem ? 'underline' : ''
    }`.trim()

  const menuClassName = `bg-fk-gray text-fk-white p-2`

  if (level === 'main' && hasChildren && children.length > 0) {
    return (
      <Menu
        menuClassName={menuClassName}
        transition={true}
        direction="bottom"
        arrow={false}
        menuButton={
          <MenuButton className={`border-fk-yellow border-b-4 ${buttonClassName}`}>
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

  if (level === 'sub' && hasChildren && children.length > 0) {
    return (
      <SubMenu
        label={item.label}
        className={`border-fk-yellow border-r-4 ${buttonClassName}`}
        menuClassName={`border-r-4 border-fk-yellow ${menuClassName}`}
        direction="right"
        arrow={false}
      >
        {children.map((child, childIndex) => (
          <DesktopMenuItem key={child.id || childIndex} item={child} level="subsub" />
        ))}
      </SubMenu>
    )
  }

  return (
    <MenuItem className={buttonClassName} href={itemPath}>
      {item.label}
    </MenuItem>
  )
}
