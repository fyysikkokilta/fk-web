'use client'

import type { MainNavigation } from '@/payload-types'

import { DesktopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'

interface MainNavigationProps {
  navigation: MainNavigation
}

export function MainNavigation({ navigation }: MainNavigationProps) {
  return (
    <>
      <DesktopMenu navigation={navigation} />
      <MobileMenu navigation={navigation} />
      <div className="h-12" />
    </>
  )
}
