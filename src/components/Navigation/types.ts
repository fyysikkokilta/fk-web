import type { MainNavigation } from '@/payload-types'

export type MenuLevel = 'main' | 'sub' | 'subsub'
export type NavigationItem =
  | MainNavigation['items'][number]
  | NonNullable<MainNavigation['items'][number]['children']>[number]

export interface DesktopMenuItemProps {
  item: NavigationItem
  level: MenuLevel
  index: number
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onNavigate: () => void
  parentRef?: React.RefObject<HTMLButtonElement | null>
  grandparentRef?: React.RefObject<HTMLButtonElement | null>
}

export interface MobileMenuItemProps {
  item: NavigationItem
  level: number
  idx: number
  isExpanded: boolean
  onToggle: () => void
  onNavigate: () => void
}

export interface MainNavigationProps {
  navigation: MainNavigation
}
