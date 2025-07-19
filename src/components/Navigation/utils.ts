import { useCallback } from 'react'

import { usePathname } from '@/i18n/navigation'

import { NavigationItem } from './types'

export function useNavigationUtils() {
  const pathname = usePathname()

  const isActive = useCallback(
    (path: string | null | undefined) => {
      if (!path) return false
      return pathname.endsWith(path)
    },
    [pathname]
  )

  const getPath = useCallback((item: NavigationItem) => {
    if (item.type === 'page') {
      if (typeof item.page === 'number') return '#'
      return item.page?.path || '#'
    }
    if (item.type === 'external') {
      return item.url || '#'
    }
    return '#'
  }, [])

  return { isActive, getPath }
}

export function getMenuItemClasses(
  isActive: boolean,
  hasChildren: boolean,
  level: 'main' | 'sub' | 'subsub' = 'main'
) {
  const baseClasses =
    'w-full px-3 py-3 whitespace-nowrap uppercase transition-colors hover:opacity-70 focus:outline-none cursor-pointer flex items-center gap-1 tracking-wide'
  const activeClass = isActive ? 'underline' : ''
  const borderClass = hasChildren
    ? level === 'main'
      ? 'border-b-4 border-fk-yellow'
      : level === 'sub'
        ? 'border-r-4 border-fk-yellow'
        : ''
    : ''
  return `${baseClasses} ${activeClass} ${borderClass}`.trim()
}

export function getChildrenArray(
  item: NavigationItem,
  level: 'main' | 'sub' | 'subsub' | number,
  hasChildren: boolean
) {
  if (!hasChildren) return []

  // For desktop menu items
  if (typeof level === 'string') {
    if (level === 'main' && 'children' in item && Array.isArray(item.children)) {
      return item.children
    }
    if (level === 'sub' && 'subchildren' in item && Array.isArray(item.subchildren)) {
      return item.subchildren
    }
  }

  // For mobile menu items
  if ('children' in item && Array.isArray(item.children)) {
    return item.children
  }
  if ('subchildren' in item && Array.isArray(item.subchildren)) {
    return item.subchildren
  }

  return []
}
