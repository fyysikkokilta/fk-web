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
        return item.page?.path || '#'
      }
      if (item.type === 'external') {
        return item.url || '#'
      }
      return '#'
    },
    []
  )
}
