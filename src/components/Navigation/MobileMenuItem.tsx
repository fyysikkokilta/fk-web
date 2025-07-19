import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Link } from '@/i18n/navigation'

import type { MobileMenuItemProps } from './types'
import { getChildrenArray, useNavigationUtils } from './utils'

export function MobileMenuItem({
  item,
  level = 0,
  idx = 0,
  isExpanded,
  onToggle,
  onNavigate
}: MobileMenuItemProps) {
  const t = useTranslations()
  const { isActive, getPath } = useNavigationUtils()

  // Manage child expansion state independently
  const [childExpandedItems, setChildExpandedItems] = useState<string[]>([])

  const itemPath = getPath(item)
  const hasChildren = item.type === 'menu'

  // Get children with proper type checking
  const children = getChildrenArray(item, level, hasChildren)

  const id = item.id || idx.toString()

  // Toggle function for child items
  const toggleChildItem = (childId: string) => {
    setChildExpandedItems((prev) =>
      prev.includes(childId) ? prev.filter((item) => item !== childId) : [...prev, childId]
    )
  }

  return (
    <div>
      <div
        className={`flex items-center rounded-lg px-1 transition-colors duration-150 ${isActive(itemPath) || isExpanded ? 'border-fk-yellow border-l-4' : ''}`}
      >
        {hasChildren ? (
          <button
            onClick={onToggle}
            className={`flex w-full cursor-pointer items-center justify-between px-3 py-3 text-base uppercase transition-colors hover:opacity-70 focus:outline-none ${isActive(itemPath) ? 'underline' : ''}`}
            aria-expanded={isExpanded}
            aria-controls={`mobile-submenu-${id}-${level}`}
            aria-label={`${isExpanded ? t('mainNavigation.closeMenu') : t('mainNavigation.openMenu')} ${item.label}`}
            role="menuitem"
          >
            <span>{item.label}</span>
            {isExpanded ? (
              <ChevronUp size={24} className="text-fk-yellow" />
            ) : (
              <ChevronDown size={24} className="text-fk-yellow" />
            )}
          </button>
        ) : (
          <Link
            href={itemPath}
            onClick={onNavigate}
            className="block w-full cursor-pointer px-3 py-3 text-base uppercase transition-colors hover:opacity-70 focus:outline-none"
            role="menuitem"
            aria-current={isActive(itemPath) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )}
      </div>
      {hasChildren && isExpanded && children.length > 0 && (
        <div id={`mobile-submenu-${id}-${level}`} className="mt-1 ml-4 space-y-1" role="menu">
          {children.map((child, childIdx) => {
            const childId = `mobile-${level + 1}-${child.id || childIdx}`
            return (
              <MobileMenuItem
                key={child.id || childIdx}
                item={child}
                level={level + 1}
                idx={childIdx}
                isExpanded={childExpandedItems.includes(childId)}
                onToggle={() => toggleChildItem(childId)}
                onNavigate={onNavigate}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
