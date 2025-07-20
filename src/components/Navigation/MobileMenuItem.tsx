'use client'

import { MenuItem, SubMenu } from '@szhsin/react-menu'
import { ChevronDown, ChevronUp } from 'lucide-react'

import type { MenuItemProps } from './types'
import { getChildrenArray, useGetPath, useIsActive } from './utils'

export function MobileMenuItem({ item, level = 'main' }: MenuItemProps) {
  const isActive = useIsActive()
  const getPath = useGetPath()

  const itemPath = getPath(item)
  const hasChildren = item.type === 'menu'
  const children = getChildrenArray(item, level, hasChildren)
  const isActiveItem = isActive(itemPath)

  // Get margin based on level
  const getMarginClass = () => {
    if (level === 'sub') return 'ml-6'
    if (level === 'subsub') return 'ml-12'
    return ''
  }
  const marginClass = getMarginClass()

  if (!hasChildren) {
    return (
      <MenuItem
        href={itemPath}
        className={`text-fk-white w-full text-sm font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
      >
        {item.label}
      </MenuItem>
    )
  }

  return (
    <SubMenu
      label={({ open }) => (
        <div
          className={`text-fk-white flex justify-between pt-2 text-sm font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
        >
          <span>{item.label}</span>
          {open ? (
            <ChevronUp size={24} className="text-fk-yellow" />
          ) : (
            <ChevronDown size={24} className="text-fk-yellow" />
          )}
        </div>
      )}
      direction="bottom"
      menuClassName="!static w-full bg-fk-gray pt-2"
    >
      {children.map((child, childIdx) => (
        <MobileMenuItem
          key={child.id || childIdx}
          item={child}
          level={level === 'main' ? 'sub' : 'subsub'}
        />
      ))}
    </SubMenu>
  )
}
