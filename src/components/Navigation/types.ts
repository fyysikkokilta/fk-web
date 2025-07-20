import type { MainNavigation } from '@/payload-types'

export type MenuLevel = 'main' | 'sub' | 'subsub'
export type NavigationItem =
  | MainNavigation['items'][number]
  | NonNullable<MainNavigation['items'][number]['children']>[number]

export interface MenuItemProps {
  item: NavigationItem
  level: MenuLevel
}

export interface MainNavigationProps {
  navigation: MainNavigation
}
