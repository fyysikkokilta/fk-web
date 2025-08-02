import Image from 'next/image'
import { useCallback } from 'react'

import type { Media } from '@/payload-types'

interface NavbarBrandProps {
  LinkElement: React.ElementType
  logo?: Media | string | number | null
  title: string
  onClose?: () => void
}

export function NavbarBrand({ LinkElement, logo, title, onClose }: NavbarBrandProps) {
  const getLogoUrl = useCallback((logo: Media | string | number | null | undefined) => {
    if (logo && typeof logo === 'object' && 'url' in logo) {
      return logo.url
    }
    return null
  }, [])

  const shouldShowLogo = logo && typeof logo === 'object' && 'url' in logo

  return (
    <LinkElement href="/" className="flex items-center gap-2 hover:no-underline" onClick={onClose}>
      {shouldShowLogo && (
        <Image priority src={getLogoUrl(logo)!} alt="" unoptimized width={48} height={48} />
      )}
      <span className="text-2xl font-bold">{title}</span>
    </LinkElement>
  )
}
