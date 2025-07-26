import Image from 'next/image'
import { useCallback } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link } from '@/i18n/navigation'
import type { Media } from '@/payload-types'

interface NavbarBrandProps {
  logo?: Media | string | number | null
  title: string
  variant?: 'desktop' | 'mobile'
}

export function NavbarBrand({ logo, title, variant = 'desktop' }: NavbarBrandProps) {
  const getLogoAlt = useCallback(
    (logo: Media | string | number | null | undefined, title: string) => {
      if (logo && typeof logo === 'object' && 'alt' in logo) {
        return logo.alt || title
      }
      return title
    },
    []
  )

  const getLogoUrl = useCallback((logo: Media | string | number | null | undefined) => {
    if (logo && typeof logo === 'object' && 'url' in logo) {
      return logo.url
    }
    return null
  }, [])

  const shouldShowLogo = logo && typeof logo === 'object' && 'url' in logo

  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="flex items-center gap-2 hover:no-underline">
        {shouldShowLogo && (
          <Image
            priority
            src={getLogoUrl(logo)!}
            alt={getLogoAlt(logo, title)}
            unoptimized
            width={48}
            height={48}
          />
        )}
        <span
          className={`text-2xl font-bold ${
            variant === 'desktop' ? 'text-nowrap max-lg:hidden' : ''
          }`}
        >
          {title}
        </span>
      </Link>
      <LanguageSwitcher />
    </div>
  )
}
