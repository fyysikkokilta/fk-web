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
      <header className="bg-fk-gray text-fk-white fixed top-0 right-0 left-0 z-50">
        <DesktopMenu navigation={navigation} />
        <MobileMenu navigation={navigation} />
      </header>
      <div className="h-12" />
    </>
  )
}
