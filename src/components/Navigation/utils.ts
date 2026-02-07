import { useCallback } from 'react'

import { usePathname } from '@/i18n/navigation'
import type { MainNavigation } from '@/payload-types'

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
  return useCallback(
    (
      item:
        | MainNavigation['items'][number]
        | NonNullable<MainNavigation['items'][number]['children']>[number]
    ) => {
      if (item.type === 'page') {
        if (typeof item.page === 'number') return '#'
        return `/${item.page?.path}` || '#'
      }
      if (item.type === 'page-navigation') {
        if (typeof item.pageNavigation === 'number' || !item.pageNavigation?.pages) return '#'
        const pageIndex = item.pageIndex ?? 0
        const indexToUse = pageIndex >= 0 ? pageIndex : item.pageNavigation.pages.length + pageIndex
        if (indexToUse < 0 || indexToUse >= item.pageNavigation.pages.length) return '#'
        const page = item.pageNavigation.pages[indexToUse]
        if (page && typeof page.page === 'object') return `/${page.page.path}`
        return '#'
      }
      if (item.type === 'external') {
        return item.url || '#'
      }
      return '#'
    },
    []
  )
}
