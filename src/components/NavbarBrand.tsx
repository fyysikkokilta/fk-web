import Image from 'next/image'

import type { Media } from '@/payload-types'

interface NavbarBrandProps {
  LinkElement: React.ElementType
  logo?: Media | string | number | null
  title: string
  onClose?: () => void
}

export const NavbarBrand = ({ LinkElement, logo, title, onClose }: NavbarBrandProps) => (
  <LinkElement href="/" className="flex items-center gap-2 hover:no-underline" onClick={onClose}>
    {!!logo && typeof logo === 'object' && logo.url && (
      <Image priority src={logo.url} alt="" unoptimized width={48} height={48} />
    )}
    <span className="text-2xl font-bold">{title}</span>
  </LinkElement>
)
