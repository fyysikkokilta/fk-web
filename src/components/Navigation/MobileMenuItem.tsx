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

  const marginClass = level === 'main' ? '' : level === 'sub' ? 'ml-4' : 'ml-8'

  if (!hasChildren || children.length === 0) {
    return (
      <MenuItem
        href={itemPath}
        aria-label={item.label}
        className={`text-fk-white w-full p-2 text-base font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
      >
        {item.label}
      </MenuItem>
    )
  }

  return (
    <SubMenu
      label={({ open }) => (
        <div
          aria-label={item.label}
          className={`text-fk-white flex justify-between px-2 text-base font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
        >
          <span>{item.label}</span>
          {open ? (
            <ChevronUp size={24} className="text-fk-yellow" />
          ) : (
            <ChevronDown size={24} className="text-fk-yellow" />
          )}
        </div>
      )}
      aria-label={item.label}
      menuClassName="!static w-full bg-fk-gray space-y-2 pt-2"
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
