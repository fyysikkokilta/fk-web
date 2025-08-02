import Image from 'next/image'
import { useCallback } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link } from '@/i18n/navigation'
import type { Media } from '@/payload-types'

interface NavbarBrandProps {
  logo?: Media | string | number | null
  title: string
  variant?: 'desktop' | 'mobile'
  onClose?: () => void
}

export function NavbarBrand({ logo, title, variant = 'desktop', onClose }: NavbarBrandProps) {
  const getLogoUrl = useCallback((logo: Media | string | number | null | undefined) => {
    if (logo && typeof logo === 'object' && 'url' in logo) {
      return logo.url
    }
    return null
  }, [])

  const shouldShowLogo = logo && typeof logo === 'object' && 'url' in logo

  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="flex items-center gap-2 hover:no-underline" onClick={onClose}>
        {shouldShowLogo && (
          <Image priority src={getLogoUrl(logo)!} alt="" unoptimized width={48} height={48} />
        )}
        <span className="text-2xl font-bold">{title}</span>
      </Link>
      <LanguageSwitcher onClick={onClose} />
    </div>
  )
}
