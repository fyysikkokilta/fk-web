import { useCallback } from 'react'

import { usePathname } from '@/i18n/navigation'

import { MenuLevel, NavigationItem } from './types'

export function useIsActive() {
  const pathname = usePathname()

  return useCallback(
    (path: string | null | undefined) => {
      if (!path) return false
      return pathname.endsWith(path)
    },
    [pathname]
  )
}

export function useGetPath() {
  return useCallback((item: NavigationItem) => {
    if (item.type === 'page') {
      if (typeof item.page === 'number') return '#'
      return item.page?.path || '#'
    }
    if (item.type === 'external') {
      return item.url || '#'
    }
    return '#'
  }, [])
}

export function getChildrenArray(item: NavigationItem, level: MenuLevel, hasChildren: boolean) {
  if (!hasChildren) return []

  if (level === 'main' && 'children' in item && Array.isArray(item.children)) {
    return item.children
  }
  if (level === 'sub' && 'subchildren' in item && Array.isArray(item.subchildren)) {
    return item.subchildren
  }

  return []
}
