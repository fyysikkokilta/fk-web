'use client'

import { FocusableItem, MenuInstance, SubMenu } from '@szhsin/react-menu'
import { ChevronUp } from 'lucide-react'
import { useRef } from 'react'

import { Link } from '@/i18n/navigation'

import type { MenuItemProps } from './types'
import { getChildrenArray, useGetPath, useIsActive } from './utils'

export function MobileMenuItem({ item, level = 'main' }: MenuItemProps) {
  const isActive = useIsActive()
  const getPath = useGetPath()
  const subMenuRef = useRef<MenuInstance>(null)

  const itemPath = getPath(item)
  const hasChildren = item.type === 'menu'
  const children = getChildrenArray(item, level, hasChildren)
  const isActiveItem = isActive(itemPath)

  const marginClass = level === 'main' ? '' : level === 'sub' ? 'ml-4' : 'ml-8'

  if (!hasChildren || children.length === 0) {
    return (
      <FocusableItem
        aria-label={item.label}
        className={`text-fk-white w-full px-2 text-base font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
      >
        {({ ref, closeMenu }) => (
          <Link
            className="w-full"
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

  return (
    <SubMenu
      instanceRef={subMenuRef}
      openTrigger="clickOnly"
      label={({ open }) => (
        <span
          className={`text-fk-white flex justify-between px-2 text-base font-bold uppercase ${isActiveItem ? 'border-fk-yellow border-l-4' : ''} ${marginClass}`}
        >
          {item.label}
          <ChevronUp size={24} className={`text-fk-yellow ${open ? 'rotate-180' : ''}`} />
        </span>
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
